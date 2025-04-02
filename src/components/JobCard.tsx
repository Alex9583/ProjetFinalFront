import {FC} from "react";
import {Job} from "@/entities/Job";
import {Card, CardContent, CardHeader, CardTitle} from "./ui/card";
import {JobStatus} from "@/entities/enums/JobStatus";

type JobCardProps = {
    job: Job;
    onSelect: (job: Job) => void;
};

const getStatusLabel = (status: JobStatus): string => {
    switch (status) {
        case JobStatus.CREATED:
            return "Available";
        case JobStatus.TAKEN:
            return "Taken";
        case JobStatus.COMPLETED:
            return "Completed";
        case JobStatus.CANCELLED:
            return "Cancelled";
        default:
            return "Unknown";
    }
};

const JobCard: FC<JobCardProps> = ({job, onSelect}) => {
    return (
        <Card onClick={() => onSelect(job)} className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
                <CardTitle className="text-lg">
                    #{job.id.toString()} - {job.description}
                </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
                <p>
                    <strong>Creator :</strong> {job.creator}
                </p>
                {job.worker !== "0x0000000000000000000000000000000000000000" && (
                    <p>
                        <strong>Worker :</strong> {job.worker}
                    </p>
                )}
                <p>
                    <strong>Reward :</strong> {Number(job.reward) / 100} $HELP
                </p>
                <p>
                    <strong>Status :</strong> {getStatusLabel(job.jobStatus)}
                </p>
            </CardContent>
        </Card>
    );
};

export default JobCard;