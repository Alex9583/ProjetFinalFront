import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import {HELPERTOKEN_ABI, SUPERHELPER_ADDRESS} from "@/constants";
import {address} from "@/types/address";

export const useGetHelperTokenBalance = (helperTokenAddress: address, accountAddress: address | undefined) => {
    const {
        data: balance,
        isLoading,
        isError,
        error,
    } = useReadContract({
        address: helperTokenAddress as address,
        abi: HELPERTOKEN_ABI,
        functionName: 'balanceOf',
        args: [accountAddress],
        account: accountAddress,
        query: {
            enabled: !!accountAddress,
        }
    });

    return {
        balance: balance as bigint,
        isLoading,
        isError,
        error
    };
}

export const useGetHelperTokenApprove = (helperTokenAddress: address, accountAddress: address | undefined) => {
    const { data: hash, error, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const approve = (amount: bigint) => {
        if (accountAddress) {
            writeContract({
                address: helperTokenAddress as address,
                abi: HELPERTOKEN_ABI,
                functionName: "approve",
                args: [SUPERHELPER_ADDRESS, amount],
                account: accountAddress
            });
        }
    };

    return { hash, error, isConfirming, isConfirmed, approve };
}