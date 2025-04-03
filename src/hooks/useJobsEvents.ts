import {useState, useEffect, useCallback} from "react";
import {publicClient} from "@/utils/client";
import {parseAbiItem} from "viem";
import {SUPERHELPER_ADDRESS} from "@/constants";
import {Job} from "@/entities/Job";
import {address} from "@/types/address";

const fromDeploymentBlock = process.env.DEPLOYMENT_BLOCK ? BigInt(process.env.DEPLOYMENT_BLOCK) : 0n;

export const useJobsEvents = () => {
    const [addedJobs, setAddedJobs] = useState<Job[]>([]);
    const [takenJobs, setTakenJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadJobs = useCallback(async () => {
        if (isLoading) return;
        setIsLoading(true);

        const currentBlockNumber = await publicClient.getBlockNumber();

        const fromBlockNumber = fromDeploymentBlock;

        const [
            jobAddedLogs,
            jobTakenLogs,
            jobCompletedAndPaidLogs,
            jobCompletedButNotPaidLogs,
            jobCanceledLogs
        ] = await Promise.all([
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobAdded(address indexed creator, string description, uint price, uint id)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobTaken(address indexed worker, uint id)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobIsCompletedAndPaid(address indexed creator, address indexed worker, uint id, uint pricePaid, uint stars)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobIsCompletedButNotPaid(address indexed creator, address indexed worker, uint id, uint pricePaid, uint stars)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobCanceled(address indexed creator, uint id)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            })
        ]);

        const finishedIds = new Set([
            ...jobCompletedAndPaidLogs,
            ...jobCompletedButNotPaidLogs,
            ...jobCanceledLogs
        ].map(log => Number(log.args?.id)));

        const jobTakenMap = jobTakenLogs.reduce<Record<number, string>>((acc, log) => {
            acc[Number(log.args?.id)] = log.args?.worker as address;
            return acc;
        }, {});

        const allJobs: Job[] = jobAddedLogs
            .map(log => {
                const id = Number(log.args?.id);
                return {
                    id: BigInt(id),
                    description: log.args?.description!,
                    reward: log.args?.price!,
                    creator: log.args?.creator!,
                    worker: jobTakenMap[id] || "0x0000000000000000000000000000000000000000",
                    stars: 0n,
                    jobStatus: jobTakenMap[id] ? 1 : 0
                } as Job;
            })
            .filter(job => !finishedIds.has(Number(job.id)));

        setAddedJobs(allJobs.filter(job => job.jobStatus === 0));
        setTakenJobs(allJobs.filter(job => job.jobStatus === 1));

        setIsLoading(false);
    }, []);

    const reloadJobs = useCallback(() => loadJobs(), [loadJobs]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    return {addedJobs, takenJobs, reloadJobs, isLoading};
};