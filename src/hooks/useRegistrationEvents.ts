import { useWatchContractEvent } from "wagmi";
import { SUPERHELPER_ADDRESS, SUPERHELPER_ABI } from '@/constants';
import { address } from "@/types/address";
import {useQueryClient} from "@tanstack/react-query";
import {useContractInfo} from "@/contexts/ContractsInfoContext";

type FirstRegistrationEventProps = {
    userAddress: address | undefined;
    isRegistered: boolean | undefined;
    callback: () => void;
};

export const useFirstRegistrationEvent = ({ userAddress, isRegistered, callback }: FirstRegistrationEventProps) => {
    const queryClient = useQueryClient();
    const {helperTokenAddress} = useContractInfo();

    useWatchContractEvent({
        address: SUPERHELPER_ADDRESS as address,
        abi: SUPERHELPER_ABI,
        eventName: 'FirstRegistration',
        onLogs: (logs) => {
            logs.forEach(log => {
                const { args } = log;
                if (args && args.newUser && args.newUser.toLowerCase() === userAddress?.toLowerCase()) {
                    callback();
                    queryClient.invalidateQueries({
                        predicate: query =>
                            query.queryKey[0] === 'readContract' &&
                            query.queryKey[1]?.address?.toLowerCase() === helperTokenAddress.toLowerCase() &&
                            query.queryKey[1]?.functionName === 'balanceOf' &&
                            query.queryKey[1]?.args?.[0]?.toLowerCase() === userAddress?.toLowerCase()
                    });
                }
            });
        },
        enabled: isRegistered === false
    });
};

export default useFirstRegistrationEvent;