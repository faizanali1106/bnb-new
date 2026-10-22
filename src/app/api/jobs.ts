const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchJobs() {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }
    const res = await fetch(`${API_URL}/jobs`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch jobs: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch jobs. Please try again later.");
  }
}

export async function fetchJob(id: string) {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }
    if (!id) {
      throw new Error("Job ID is required");
    }
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Job not found");
      }
      throw new Error(`Failed to fetch job: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch job. Please try again later.");
  }
}

export async function submitApplication(jobId: string, data: unknown) {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }
    if (!jobId) {
      throw new Error("Job ID is required");
    }
    const res = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to submit application: ${res.status} ${res.statusText}${errorText ? ` - ${errorText}` : ""}`
      );
    }
    return res.json();
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to submit application. Please try again later.");
  }
}

// export async function deleteJob(id: string) {
//   const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//   if (!res.ok) throw new Error("Failed to delete job");
//   return res.json();
// }
