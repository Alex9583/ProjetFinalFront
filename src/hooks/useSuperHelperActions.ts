import {useReadContract, useWriteContract, useWaitForTransactionReceipt} from "wagmi";
import {SUPERHELPER_ABI, SUPERHELPER_ADDRESS} from "@/constants";
import {address} from "@/types/address";
import {Job, mapContractDataToJob} from "@/entities/Job";
import {mapContractDataToUser, User} from "@/entities/User";

type jobContractData = readonly [bigint, string, string, string, bigint, bigint, number];
type userContractData = readonly [bigint, bigint, bigint, boolean];

export const useGetHelperTokenAddress = () => {
    const {data: helperTokenAddress, isError, error} = useReadContract({
        address: SUPERHELPER_ADDRESS as address,
        abi: SUPERHELPER_ABI,
        functionName: 'helperToken',
    });

    return {helperTokenAddress: helperTokenAddress as address, isError, error};
};

export const useGetJobById = (jobId: bigint) => {
    const {data, isError, error, isLoading} = useReadContract({
        address: SUPERHELPER_ADDRESS as address,
        abi: SUPERHELPER_ABI,
        functionName: 'jobs',
        args: [jobId],
    });

    const job = data ? mapContractDataToJob(data as jobContractData) : undefined;


    return {job: job as Job, isError, error, isLoading};
};

export const useGetUserInfo = (userAddress: address | undefined) => {
    const {data, isError, error, isLoading, refetch} = useReadContract({
        address: SUPERHELPER_ADDRESS as address,
        abi: SUPERHELPER_ABI,
        functionName: 'users',
        args: [userAddress],
        query: {
            enabled: !!userAddress,
        }
    });

    const user = data ? mapContractDataToUser(data as userContractData) : undefined;

    return {user: user as User, isError, error, isLoading, refetch};
};

export const useGetIsOwner = (userAddress: address | undefined) => {
    const {data, isError, error, isLoading} = useReadContract({
        address: SUPERHELPER_ADDRESS as address,
        abi: SUPERHELPER_ABI,
        functionName: 'owner',
        query: {
            enabled: !!userAddress,
        }
    });

    const typedData = data as address | undefined;

    const isOwner = typedData ? typedData === userAddress : false;

    return {isOwner, isError, error, isLoading};
}

export const useCreateJob = (accountAddress: address | undefined) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const createJob = (description: string, reward: bigint) => {
        if (accountAddress) {
            writeContract({
                address: SUPERHELPER_ADDRESS as address,
                abi: SUPERHELPER_ABI,
                functionName: 'createJob',
                args: [description, reward],
                account: accountAddress
            });
        }
    };

    return {createJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useCancelJob = (accountAddress: address | undefined) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const cancelJob = (jobId: bigint) => {
        if (accountAddress) {
            writeContract({
                address: SUPERHELPER_ADDRESS as address,
                abi: SUPERHELPER_ABI,
                functionName: 'cancelJob',
                args: [jobId],
                account: accountAddress
            });
        }
    };

    return {cancelJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useTakeJob = (accountAddress: address | undefined) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const takeJob = (jobId: bigint) => {
        if (accountAddress) {
            writeContract({
                address: SUPERHELPER_ADDRESS as address,
                abi: SUPERHELPER_ABI,
                functionName: 'takeJob',
                args: [jobId],
                account: accountAddress
            });
        }
    };

    return {takeJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useCompleteAndReviewJob = (accountAddress: address | undefined) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const completeAndReviewJob = (jobId: bigint, rating: number, isDisputed: boolean) => {
        if (accountAddress) {
            writeContract({
                address: SUPERHELPER_ADDRESS as address,
                abi: SUPERHELPER_ABI,
                functionName: 'completeAndReviewJob',
                args: [jobId, rating, isDisputed],
                account: accountAddress
            });
        }
    };

    return {completeAndReviewJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useHandleDisputedJob = (accountAddress: address | undefined) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const handleDisputedJob = (jobId: bigint, isResolved: boolean) => {
        if (accountAddress) {
            writeContract({
                address: SUPERHELPER_ADDRESS as address,
                abi: SUPERHELPER_ABI,
                functionName: 'handleDisputedJob',
                args: [jobId, isResolved],
                account: accountAddress
            });
        }
    };

    return {handleDisputedJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useDistributeToNewUser = (accountAddress: address | undefined) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const distributeToNewUser = () => {
        if (accountAddress) {
            writeContract({
                address: SUPERHELPER_ADDRESS as address,
                abi: SUPERHELPER_ABI,
                functionName: 'distributeToNewUser',
                account: accountAddress
            });
        }
    };

    return {distributeToNewUser, hash, error, isPending, isConfirming, isConfirmed};
};
