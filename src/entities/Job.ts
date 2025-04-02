import {address} from "@/types/address";
import {JobStatus} from "@/entities/enums/JobStatus";

export interface Job {
    id: bigint,
    creator: address,
    worker: address,
    description: string,
    stars: bigint,
    reward: bigint,
    jobStatus: JobStatus,
}

export const mapContractDataToJob = (data: any): Job => {
    return {
        id: data[0] as bigint,
        creator: data[1] as address,
        worker: data[2] as address,
        description: data[3],
        stars: data[4] as bigint,
        reward: data[5] as bigint,
        jobStatus: Number(data[6]) as JobStatus,
    };
};
