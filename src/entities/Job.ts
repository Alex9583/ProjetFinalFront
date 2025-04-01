import {address} from "@/types/address";
import {JobStatus} from "@/entities/enums/JobStatus";

export interface Job {
    id: bigint,
    creator: address,
    worker: address,
    description: string,
    stars: bigint,
    reward: number,
    jobStatus: JobStatus,
}