import {useState, useEffect, useRef, useCallback} from "react";
import {publicClient} from "@/utils/client";
import {parseAbiItem} from "viem";
import {SUPERHELPER_ADDRESS} from "@/constants";
import {Job} from "@/entities/Job";
import {address} from "@/types/address";
import {toast} from "sonner";

const fromDeploymentBlock = process.env.DEPLOYMENT_BLOCK ? BigInt(process.env.DEPLOYMENT_BLOCK) : 0n;

export const useJobsEvents = () => {
    const [addedJobs, setAddedJobs] = useState<Job[]>([]);
    const [takenJobs, setTakenJobs] = useState<Job[]>([]);
    const lastFetchedBlock = useRef<bigint>(fromDeploymentBlock);

    const isFetching = useRef(false);

    const loadJobs = useCallback(async () => {
        if (isFetching.current) {
            return;
        }
        isFetching.current = true;

        try {
            const currentBlockNumber = await publicClient.getBlockNumber();

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
                    fromBlock: lastFetchedBlock.current + 1n,
                    toBlock: currentBlockNumber
                }),
                publicClient.getLogs({
                    address: SUPERHELPER_ADDRESS as address,
                    event: parseAbiItem('event JobTaken(address indexed worker, uint id)'),
                    fromBlock: lastFetchedBlock.current + 1n,
                    toBlock: currentBlockNumber
                }),
                publicClient.getLogs({
                    address: SUPERHELPER_ADDRESS as address,
                    event: parseAbiItem('event JobIsCompletedAndPaid(address indexed creator, address indexed worker, uint id, uint pricePaid, uint stars)'),
                    fromBlock: lastFetchedBlock.current + 1n,
                    toBlock: currentBlockNumber
                }),
                publicClient.getLogs({
                    address: SUPERHELPER_ADDRESS as address,
                    event: parseAbiItem('event JobIsCompletedButNotPaid(address indexed creator, address indexed worker, uint id, uint pricePaid, uint stars)'),
                    fromBlock: lastFetchedBlock.current + 1n,
                    toBlock: currentBlockNumber
                }),
                publicClient.getLogs({
                    address: SUPERHELPER_ADDRESS as address,
                    event: parseAbiItem('event JobCanceled(address indexed creator, uint id)'),
                    fromBlock: lastFetchedBlock.current + 1n,
                    toBlock: currentBlockNumber
                })
            ]);

            const finishedIds = new Set<number>([
                ...jobCompletedAndPaidLogs,
                ...jobCompletedButNotPaidLogs,
                ...jobCanceledLogs
            ].map(log => Number(log.args?.id!)));

            const jobTakenMap = jobTakenLogs.reduce<Record<number, string>>((acc, log) => {
                const id = Number(log.args?.id!);
                acc[id] = log.args?.worker!;
                return acc;
            }, {});

            const newJobsData = jobAddedLogs
                .map(log => ({
                    id: BigInt(Number(log.args?.id!)),
                    description: log.args?.description!,
                    reward: log.args?.price!,
                    creator: log.args?.creator!,
                    worker: jobTakenMap[Number(log.args?.id!)] || "0x0000000000000000000000000000000000000000",
                    stars: 0n,
                    jobStatus: jobTakenMap[Number(log.args?.id!)] ? 1 : 0
                } as Job))
                .filter(job => !finishedIds.has(Number(job.id)));

            const takenJobIds = new Set(jobTakenLogs.map(log => Number(log.args?.id!)));
            const newJobsFiltered = newJobsData.filter(job => !takenJobIds.has(Number(job.id)));

            setAddedJobs(prevJobs =>
                [...prevJobs.filter(job => !takenJobIds.has(Number(job.id))), ...newJobsFiltered]
            );


            setTakenJobs(prevJobs => {
                const existingIds = new Set(prevJobs.map(job => job.id));
                return [
                    ...prevJobs,
                    ...newJobsData.filter(job => job.jobStatus === 1 && !existingIds.has(job.id))
                ];
            });

            lastFetchedBlock.current = currentBlockNumber;

        } catch (error) {
            toast.error("Error while fetching jobs events :", error);
        } finally {
            isFetching.current = false;
        }
    }, []);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    const reloadJobs = useCallback(() => {
        loadJobs();
    }, [loadJobs]);

    return {addedJobs, takenJobs, reloadJobs};
};