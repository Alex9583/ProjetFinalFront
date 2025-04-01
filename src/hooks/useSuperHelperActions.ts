import {useReadContract, useWriteContract, useWaitForTransactionReceipt} from "wagmi";
import {SUPERHELPER_ABI, SUPERHELPER_ADDRESS} from "@/constants";
import {address} from "@/types/address";
import {Job} from "@/entities/Job";
import {User} from "@/entities/User";

export const useGetHelperTokenAddress = () => {
    const {data: helperTokenAddress, isError, error} = useReadContract({
        address: SUPERHELPER_ADDRESS as address,
        abi: SUPERHELPER_ABI,
        functionName: 'helperToken',
    });

    return {helperTokenAddress: helperTokenAddress as address, isError, error};
};

export const useGetJobById = (jobId: bigint) => {
    const {data: job, isError, error, isLoading} = useReadContract({
        address: SUPERHELPER_ADDRESS as address,
        abi: SUPERHELPER_ABI,
        functionName: 'jobs',
        args: [jobId],
    });

    return {job: job as Job, isError, error, isLoading};
};

export const useGetUserInfo = (userAddress: address) => {
    const {data: user, isError, error, isLoading} = useReadContract({
        address: SUPERHELPER_ADDRESS as address,
        abi: SUPERHELPER_ABI,
        functionName: 'users',
        args: [userAddress],
    });

    return {user: user as User, isError, error, isLoading};
};

export const useCreateJob = (accountAddress: address) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const createJob = (description: string, reward: bigint) => {
        writeContract({
            address: SUPERHELPER_ADDRESS as address,
            abi: SUPERHELPER_ABI,
            functionName: 'createJob',
            args: [description, reward],
            account: accountAddress
        });
    };

    return {createJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useCancelJob = (accountAddress: address) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const cancelJob = (jobId: bigint) => {
        writeContract({
            address: SUPERHELPER_ADDRESS as address,
            abi: SUPERHELPER_ABI,
            functionName: 'cancelJob',
            args: [jobId],
            account: accountAddress
        });
    };

    return {cancelJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useTakeJob = (accountAddress: address) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const takeJob = (jobId: bigint) => {
        writeContract({
            address: SUPERHELPER_ADDRESS as address,
            abi: SUPERHELPER_ABI,
            functionName: 'takeJob',
            args: [jobId],
            account: accountAddress
        });
    };

    return {takeJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useCompleteAndReviewJob = (accountAddress: address) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const completeAndReviewJob = (jobId: bigint, rating: number) => {
        writeContract({
            address: SUPERHELPER_ADDRESS as address,
            abi: SUPERHELPER_ABI,
            functionName: 'completeAndReviewJob',
            args: [jobId, rating],
            account: accountAddress
        });
    };

    return {completeAndReviewJob, hash, error, isPending, isConfirming, isConfirmed};
};

export const useDistributeToNewUser = (accountAddress: address) => {
    const {data: hash, error, writeContract, isPending} = useWriteContract();
    const {isLoading: isConfirming, isSuccess: isConfirmed} = useWaitForTransactionReceipt({hash});

    const distributeToNewUser = () => {
        writeContract({
            address: SUPERHELPER_ADDRESS as address,
            abi: SUPERHELPER_ABI,
            functionName: 'distributeToNewUser',
            account: accountAddress
        });
    };

    return {distributeToNewUser, hash, error, isPending, isConfirming, isConfirmed};
};
