// @ts-nocheck
import { useEffect, useRef } from "react";
import { publicClient } from "@/utils/client";
import { parseAbiItem } from "viem";
import { SUPERHELPER_ADDRESS } from "@/constants";
import { address } from "@/types/address";
import { useQueryClient } from "@tanstack/react-query";
import { useContractInfo } from "@/contexts/ContractsInfoContext";

const fromDeploymentBlock = process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK
    ? BigInt(process.env.NEXT_PUBLIC_DEPLOYMENT_BLOCK)
    : BigInt(0);

type FirstRegistrationEventProps = {
    userAddress: address | undefined;
    isRegistered: boolean | undefined;
    callback: () => void;
    hasRegistered: boolean;
};

export const useFirstRegistrationEvent = ({
                                              userAddress,
                                              isRegistered,
                                              callback,
                                              hasRegistered,
                                          }: FirstRegistrationEventProps) => {
    const intervalId = useRef<NodeJS.Timeout | null>(null);
    const queryClient = useQueryClient();
    const { helperTokenAddress } = useContractInfo();

    useEffect(() => {
        const checkRegistrationEvent = async () => {
            if (!userAddress || isRegistered) {
                if (intervalId.current) {
                    clearInterval(intervalId.current);
                    intervalId.current = null;
                }
                return;
            }

            const currentBlockNumber = await publicClient.getBlockNumber();

            const logs = await publicClient.getLogs({
                address: SUPERHELPER_ADDRESS as address,
                event: parseAbiItem("event FirstRegistration(address indexed newUser)"),
                fromBlock: fromDeploymentBlock,
                toBlock: currentBlockNumber,
                args: {
                    newUser: userAddress,
                },
            });

            if (logs && logs.length > 0) {
                await callback();

                queryClient.invalidateQueries({
                    predicate: (query) =>
                        query.queryKey[0] === "readContract" &&
                        query.queryKey[1]?.address?.toLowerCase() === helperTokenAddress.toLowerCase() &&
                        query.queryKey[1]?.functionName === "balanceOf" &&
                        query.queryKey[1]?.args?.[0]?.toLowerCase() === userAddress.toLowerCase(),
                });

                if (intervalId.current) {
                    clearInterval(intervalId.current);
                    intervalId.current = null;
                }
            }
        };

        if (hasRegistered && !isRegistered && userAddress && !intervalId.current) {
            checkRegistrationEvent();
            intervalId.current = setInterval(checkRegistrationEvent, 5000);
        }

        return () => {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        };
    }, [userAddress, isRegistered, callback, queryClient, helperTokenAddress, hasRegistered]);

    return {};
};

export default useFirstRegistrationEvent;