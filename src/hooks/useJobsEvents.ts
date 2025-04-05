import {useState, useEffect, useCallback} from "react";
import {publicClient} from "@/utils/client";
import {parseAbiItem} from "viem";
import {SUPERHELPER_ADDRESS} from "@/constants";
import {Job} from "@/entities/Job";
import {JobStatus} from "@/entities/enums/JobStatus";
import {address} from "@/types/address";
import {useAccount} from "wagmi";
import {useContractInfo} from "@/contexts/ContractsInfoContext";

const fromDeploymentBlock = process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK ? BigInt(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK) : 0n;

export const useJobsEvents = () => {
    const [addedJobs, setAddedJobs] = useState<Job[]>([]);
    const [takenJobs, setTakenJobs] = useState<Job[]>([]);
    const [disputedJobs, setDisputedJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {address: userAddress} = useAccount();
    const {isOwner} = useContractInfo();

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
            jobCanceledLogs,
            jobDisputedLogs
        ] = await Promise.all([
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobAdded(address indexed creator, string description, uint256 price, uint256 id)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobTaken(address indexed worker, uint256 id)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobCompletedAndPaid(address indexed creator, address indexed worker, uint256 id, uint256 pricePaid, uint8 stars)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobCompletedButNotPaid(address indexed creator, address indexed worker, uint256 id, uint256 pricePaid, uint8 stars)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobCanceled(address indexed creator, uint256 id)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            }),
            publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem('event JobDisputed(address indexed creator, address indexed worker, uint256 id)'),
                fromBlock: fromBlockNumber,
                toBlock: currentBlockNumber
            })
        ]);

        const completedIds = new Set([...jobCompletedAndPaidLogs, ...jobCompletedButNotPaidLogs].map(log => Number(log.args?.id)));
        const canceledIds = new Set(jobCanceledLogs.map(log => Number(log.args?.id)));
        const disputedIds = new Set(jobDisputedLogs.map(log => Number(log.args?.id)));

        const jobTakenMap = jobTakenLogs.reduce<Record<number, string>>((acc, log) => {
            acc[Number(log.args?.id)] = log.args?.worker as address;
            return acc;
        }, {});

        const allJobs: Job[] = jobAddedLogs.map(log => {
            const id = Number(log.args?.id);
            let status = JobStatus.CREATED;

            if (completedIds.has(id)) {
                status = JobStatus.COMPLETED;
            } else if (disputedIds.has(id)) {
                status = JobStatus.DISPUTED;
            } else if (canceledIds.has(id)) {
                status = JobStatus.CANCELLED;
            } else if (jobTakenMap[id]) {
                status = JobStatus.TAKEN;
            }

            return {
                id: BigInt(id),
                description: log.args?.description!,
                reward: log.args?.price!,
                creator: log.args?.creator!,
                worker: jobTakenMap[id] || "0x0000000000000000000000000000000000000000",
                stars: 0n,
                jobStatus: status
            } as Job;
        });

        setAddedJobs(allJobs.filter(job => job.jobStatus === JobStatus.CREATED));
        if (userAddress) {
            setTakenJobs(
                allJobs.filter(job =>
                    job.jobStatus === JobStatus.TAKEN && (
                            job.creator.toLowerCase() === userAddress.toLowerCase() ||
                            job.worker.toLowerCase() === userAddress.toLowerCase()
                        )
                )
            );
        } else {
            setTakenJobs([]);
        }
        setDisputedJobs(isOwner ? allJobs.filter(job => job.jobStatus === JobStatus.DISPUTED) : []);

        setIsLoading(false);
    }, [isOwner, userAddress]);

    const reloadJobs = useCallback(() => loadJobs(), [loadJobs]);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    return {addedJobs, takenJobs, disputedJobs, reloadJobs, isLoading};
};