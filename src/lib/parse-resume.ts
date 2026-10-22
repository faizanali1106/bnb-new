export interface ParsedEducation {
  school: string;
  degree: string;
  year: string;
}

export interface ParsedExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ParsedResume {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  education: ParsedEducation[];
  experience: ParsedExperience[];
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{4}/g;
const DATE_RANGE_RE =
  /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2})\s*[-–—to]+\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+)?((?:19|20)\d{2}|present|current|now)/i;
const YEAR_RE = /\b((?:19|20)\d{2})\b/;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/[A-Za-z0-9._\-/%]+/i;
const URL_RE = /https?:\/\/[^\s)]+/i;

const SECTION_HEADINGS = [
  "education",
  "academic background",
  "academics",
  "qualifications",
  "experience",
  "work experience",
  "employment",
  "professional experience",
  "work history",
  "employment history",
  "skills",
  "technical skills",
  "projects",
  "summary",
  "profile",
  "objective",
  "about me",
  "contact",
  "certifications",
  "languages",
  "references",
];

const DEGREE_RE =
  /\b(ph\.?d|doctorate|mba|msc|ms|m\.s|bsc|bs|b\.s|ba|b\.a|be|b\.e|bcs|mcs|llb|md|bachelor(?:'s)?|master(?:'s)?|associate|diploma|intermediate|fsc|a[\s-]?levels?|high school)\b/i;
const SCHOOL_RE =
  /\b(university|college|institute|school|academy|polytechnic)\b/i;
const ROLE_RE =
  /\b(engineer|developer|designer|manager|specialist|lead|intern|analyst|consultant|officer|director|founder|architect|administrator|coordinator|executive|associate|assistant|scientist|researcher|writer|marketer|recruiter)\b/i;

function looksLikePdfJunk(value: string) {
  return /^(endstream|endobj|stream|obj|BT|ET|Td|Tj|TJ|Tf|Tm|cm|re|Do|\/[A-Z]|<<|>>)/i.test(
    value.trim()
  );
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let line = "";
    let lastY: number | null = null;
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = "transform" in item ? Number((item as { transform: number[] }).transform[5]) : 0;
      if (lastY != null && Math.abs(lastY - y) > 4) {
        pages.push(line.trim());
        line = "";
      }
      line += `${item.str} `;
      lastY = y;
    }
    if (line.trim()) pages.push(line.trim());
    pages.push("");
  }

  return pages.join("\n");
}

async function extractDocxText(file: File): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const xml = await zip.file("word/document.xml")?.async("string");
  if (!xml) return "";
  return xml
    .replace(/<w:tab[^/]*\/>/g, " ")
    .replace(/<w:br[^/]*\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function extractAsciiFallback(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunks: string[] = [];
  let current = "";
  for (let i = 0; i < bytes.length; i += 1) {
    const code = bytes[i];
    if (code >= 32 && code <= 126) {
      current += String.fromCharCode(code);
    } else if (current.length >= 4) {
      if (!looksLikePdfJunk(current)) chunks.push(current.trim());
      current = "";
    } else {
      current = "";
    }
  }
  if (current.length >= 4 && !looksLikePdfJunk(current)) chunks.push(current.trim());
  return chunks.join("\n");
}

async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || file.type.startsWith("text/")) {
    return file.text();
  }
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    try {
      return await extractPdfText(file);
    } catch {
      return extractAsciiFallback(file);
    }
  }
  if (name.endsWith(".docx")) {
    try {
      return await extractDocxText(file);
    } catch {
      return extractAsciiFallback(file);
    }
  }
  return extractAsciiFallback(file);
}

function cleanLines(text: string): string[] {
  return text
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 1 && line.length < 280)
    .filter((line) => !looksLikePdfJunk(line))
    .filter((line) => !/^[\d\s./-]+$/.test(line));
}

function normalizeHeading(line: string) {
  return line.toLowerCase().replace(/[:|\-–—]/g, " ").replace(/\s+/g, " ").trim();
}

function isHeading(line: string) {
  const normalized = normalizeHeading(line);
  return SECTION_HEADINGS.some(
    (heading) => normalized === heading || normalized === `${heading}s`
  );
}

function extractSection(lines: string[], titles: string[]): string[] {
  const start = lines.findIndex((line) => {
    const normalized = normalizeHeading(line);
    return titles.some((title) => normalized === title || normalized.startsWith(`${title} `));
  });
  if (start === -1) return [];

  const collected: string[] = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (isHeading(lines[i])) break;
    collected.push(lines[i]);
  }
  return collected;
}

function capitalizeWord(value: string) {
  if (!value) return "";
  if (value === value.toUpperCase() && value.length > 2) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function parseName(lines: string[], email: string): { firstName: string; lastName: string } {
  const labeled = lines.find((line) => /^name\s*[:\-]/i.test(line));
  const source = labeled ? labeled.replace(/^name\s*[:\-]\s*/i, "") : "";

  const fromLine = (line: string) => {
    const words = line
      .replace(/[,|]/g, " ")
      .split(" ")
      .filter((word) => /^[A-Za-z][A-Za-z.'-]*$/.test(word));
    if (words.length < 2 || words.length > 4) return null;
    return {
      firstName: capitalizeWord(words[0]),
      lastName: words.slice(1).map(capitalizeWord).join(" "),
    };
  };

  if (source) {
    const parsed = fromLine(source);
    if (parsed) return parsed;
  }

  const top = lines.slice(0, 12);
  for (const line of top) {
    if (EMAIL_RE.test(line) || LINKEDIN_RE.test(line) || URL_RE.test(line)) continue;
    if (/phone|mobile|address|email|linkedin|github|portfolio|www\./i.test(line)) continue;
    if (isHeading(line) || DEGREE_RE.test(line) || ROLE_RE.test(line)) continue;
    const parsed = fromLine(line);
    if (parsed) return parsed;
  }

  const emailLocal = (email.split("@")[0] || "").replace(/[0-9]/g, "");
  if (emailLocal.includes(".")) {
    const [first, last] = emailLocal.split(".");
    return {
      firstName: first ? capitalizeWord(first) : "",
      lastName: last ? capitalizeWord(last) : "",
    };
  }
  if (emailLocal.includes("_")) {
    const [first, last] = emailLocal.split("_");
    return {
      firstName: first ? capitalizeWord(first) : "",
      lastName: last ? capitalizeWord(last) : "",
    };
  }

  return { firstName: "", lastName: "" };
}

function parsePhone(text: string): string {
  const matches = text.match(PHONE_RE) || [];
  const ranked = matches
    .map((value) => ({ value: value.trim(), digits: value.replace(/\D/g, "") }))
    .filter((item) => item.digits.length >= 10 && item.digits.length <= 15)
    .filter((item) => !/^19\d{2}$|^20\d{2}$/.test(item.digits));
  return ranked[0]?.value || "";
}

function parseAddress(lines: string[]): string {
  const labeled = lines.find((line) => /^(address|location)\s*[:\-]/i.test(line));
  if (labeled) return labeled.replace(/^(address|location)\s*[:\-]\s*/i, "").trim();

  const cityCountry = lines.find((line) =>
    /\b(lahore|karachi|islamabad|rawalpindi|faisalabad|multan|peshawar|quetta|london|dubai|new york|toronto|california|texas|pakistan|india|uae|uk|usa|united states|canada)\b/i.test(
      line
    ) && !EMAIL_RE.test(line) && !LINKEDIN_RE.test(line)
  );
  if (cityCountry && cityCountry.length < 80) return cityCountry;

  return (
    lines.find(
      (line) =>
        /\d{1,5}\s+\w+/.test(line) &&
        /street|st\.|avenue|ave|road|rd\.|boulevard|lane|block|house|phase/i.test(line)
    ) || ""
  );
}

function parseEducation(lines: string[]): ParsedEducation[] {
  const section = extractSection(lines, [
    "education",
    "academic background",
    "academics",
    "qualifications",
  ]);
  if (section.length === 0) return [];

  const entries: ParsedEducation[] = [];
  for (let i = 0; i < section.length; i += 1) {
    const line = section[i];
    const next = section[i + 1] || "";
    const prev = section[i - 1] || "";
    const yearMatch = line.match(YEAR_RE) || next.match(YEAR_RE) || prev.match(YEAR_RE);
    const isSchool = SCHOOL_RE.test(line);
    const isDegree = DEGREE_RE.test(line);

    if (!isSchool && !isDegree) continue;

    let school = "";
    let degree = "";
    if (isSchool && isDegree) {
      school = line;
      degree = "";
    } else if (isSchool) {
      school = line;
      degree = DEGREE_RE.test(next) ? next : DEGREE_RE.test(prev) ? prev : "";
    } else {
      degree = line;
      school = SCHOOL_RE.test(next) ? next : SCHOOL_RE.test(prev) ? prev : "";
    }

    entries.push({
      school: school.replace(YEAR_RE, "").replace(/[-–|,]+$/g, "").trim(),
      degree: degree.replace(YEAR_RE, "").replace(/[-–|,]+$/g, "").trim(),
      year: yearMatch ? yearMatch[1] : "",
    });
  }

  const unique: ParsedEducation[] = [];
  for (const entry of entries) {
    const key = `${entry.school}|${entry.degree}|${entry.year}`.toLowerCase();
    if (!unique.some((item) => `${item.school}|${item.degree}|${item.year}`.toLowerCase() === key)) {
      unique.push(entry);
    }
  }
  return unique.slice(0, 4);
}

function parseExperience(lines: string[]): ParsedExperience[] {
  const section = extractSection(lines, [
    "experience",
    "work experience",
    "employment",
    "professional experience",
    "work history",
    "employment history",
  ]);
  if (section.length === 0) return [];

  const entries: ParsedExperience[] = [];
  let current = null as ParsedExperience | null;

  const startEntry = () => {
    if (current && (current.company || current.role || current.description)) {
      entries.push(current);
    }
    current = { company: "", role: "", duration: "", description: "" };
  };

  for (const line of section) {
    const dateMatch = line.match(DATE_RANGE_RE);
    const looksLikeRole = ROLE_RE.test(line) && line.length < 90;
    const looksLikeCompany =
      /\b(inc|llc|ltd|pvt|limited|labs|studio|technologies|solutions|systems|group|company|corp|gmbh)\b/i.test(
        line
      ) && line.length < 90;

    if (dateMatch || looksLikeRole || looksLikeCompany) {
      if (!current || current.description || current.role || current.company) {
        startEntry();
      }
      if (!current) continue;
      if (dateMatch) current.duration = dateMatch[0].replace(/\s+/g, " ");
      if (looksLikeRole && !current.role) current.role = line.replace(DATE_RANGE_RE, "").replace(/[|•·]/g, " ").trim();
      if (looksLikeCompany && !current.company) {
        current.company = line.replace(DATE_RANGE_RE, "").replace(/[|•·]/g, " ").trim();
      }
      if (looksLikeRole && looksLikeCompany && line.includes("|")) {
        const [left, right] = line.split("|").map((part) => part.trim());
        if (ROLE_RE.test(left)) {
          current.role = left;
          current.company = right.replace(DATE_RANGE_RE, "").trim();
        } else {
          current.company = left;
          current.role = right.replace(DATE_RANGE_RE, "").trim();
        }
      }
      continue;
    }

    if (current) {
      current.description = [current.description, line].filter(Boolean).join(" ");
    }
  }

  if (current) entries.push(current);
  return entries
    .filter((entry) => entry.company || entry.role)
    .slice(0, 5);
}

export async function parseResumeFile(file: File): Promise<ParsedResume> {
  const text = await extractText(file);
  const lines = cleanLines(text);
  const blob = lines.join("\n");

  const email = blob.match(EMAIL_RE)?.[0] || "";
  const linkedinMatch = blob.match(LINKEDIN_RE)?.[0] || "";
  const linkedin = linkedinMatch
    ? linkedinMatch.startsWith("http")
      ? linkedinMatch
      : `https://${linkedinMatch}`
    : "";
  const websiteMatch = blob
    .match(/https?:\/\/[^\s)]+/gi)
    ?.find((url) => !/linkedin\.com/i.test(url));
  const { firstName, lastName } = parseName(lines, email);

  return {
    firstName,
    lastName,
    email,
    phone: parsePhone(blob),
    address: parseAddress(lines),
    linkedin,
    website: websiteMatch || "",
    education: parseEducation(lines),
    experience: parseExperience(lines),
  };
}

export function hasParsedValues(parsed: ParsedResume) {
  return Boolean(
    parsed.firstName ||
      parsed.lastName ||
      parsed.email ||
      parsed.phone ||
      parsed.address ||
      parsed.linkedin ||
      parsed.website ||
      parsed.education.length ||
      parsed.experience.length
  );
}
