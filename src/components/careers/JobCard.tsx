import { Clock, MapPin } from "lucide-react";
import { formatPostedAgo, type Job } from "@/data/jobs";
import Arrow from "../ui/Arrow";
import TLink from "../ui/TLink";

export function JobPills({ employmentType, workMode }: { employmentType: string; workMode: string }) {
  return (
    <div className="chips">
      <span className="tag">{employmentType}</span>
      <span className="tag">{workMode}</span>
    </div>
  );
}

export function JobCard({ job }: { job: Job }) {
  return (
    <TLink href={`/careers/${job.id}`} className="grow-tile hover-arrow" style={{ minHeight: "24rem" }}>
      <span className="grow-tile__bg" />
      <div>
        <div className="label" style={{ marginBottom: "1rem" }}>
          {job.department}
        </div>
        <h3 className="h5 grow-tile__h" style={{ marginBottom: "1rem" }}>
          {job.title}
        </h3>
        <JobPills employmentType={job.employmentType} workMode={job.workMode} />
        <p className="p-s soft clamp-4" style={{ marginTop: "1.25rem" }}>
          {job.summary}
        </p>
      </div>
      <div className="grow-tile__end">
        <div className="job-meta">
          <span>
            <MapPin /> {job.location}
          </span>
          <span>
            <Clock /> {formatPostedAgo(job.postedAt)}
          </span>
        </div>
        <Arrow size="lg" />
      </div>
    </TLink>
  );
}
