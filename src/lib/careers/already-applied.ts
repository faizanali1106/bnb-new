import { getSupabaseService } from "@/lib/supabase/service";

type DupCheck = {
  jobId: number | null;
  jobTitle: string;
  email: string;
};

/** True if this email already applied to this job (by id and/or title). */
export async function hasExistingApplication({
  jobId,
  jobTitle,
  email,
}: DupCheck): Promise<boolean> {
  const supabase = getSupabaseService();
  if (!supabase) return false;

  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !jobTitle.trim()) return false;

  if (jobId != null) {
    const { data, error } = await supabase
      .from("job_applications")
      .select("id")
      .eq("job_id", jobId)
      .ilike("email", emailNorm)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[hasExistingApplication] by job_id", error);
    } else if (data) {
      return true;
    }
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("id")
    .eq("job_title", jobTitle.trim())
    .ilike("email", emailNorm)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[hasExistingApplication] by job_title", error);
    return false;
  }

  return Boolean(data);
}

export const ALREADY_APPLIED_MESSAGE =
  "You've already applied for this role. If you need to update your application, please email hr@bitandbytes.net.";
