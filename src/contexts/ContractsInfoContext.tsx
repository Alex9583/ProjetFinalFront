'use client'
import React, {createContext, useContext, ReactNode, useEffect} from "react";
import {useGetHelperTokenAddress, useGetUserInfo} from "@/hooks/useSuperHelperActions";
import {toast} from "sonner";
import {address} from "@/types/address";
import {User} from "@/entities/User";
import {useAccount} from "wagmi";


type ContractsInfoContextType = {
    helperTokenAddress: address;
    user: User | undefined;
    refetchUser: () => void;
};

const ContractsInfoContext = createContext<ContractsInfoContextType | undefined>(undefined);

export const ContractsInfoProvider = ({children}: { children: ReactNode }) => {
    const {
        helperTokenAddress,
        isError: isErrorGetHelperTokenAddress,
        error: errorGetHelperTokenAddress
    } = useGetHelperTokenAddress();
    const {address} = useAccount();
    const {user, isError: isErrorGetUserInfo, error: errorGetUserInfo, refetch} = useGetUserInfo(address);

    useEffect(() => {
        if (isErrorGetHelperTokenAddress && errorGetHelperTokenAddress) {
            toast.error(`Error while fetching helperToken address : ${errorGetHelperTokenAddress.message}`);
        }
    }, [isErrorGetHelperTokenAddress, errorGetHelperTokenAddress]);

    useEffect(() => {
        if (isErrorGetUserInfo && errorGetUserInfo) {
            toast.error(`Error while fetching user info : ${errorGetUserInfo.message}`);
        }
    }, [isErrorGetUserInfo, errorGetUserInfo]);


    return (
        <ContractsInfoContext.Provider value={{
            helperTokenAddress: helperTokenAddress,
            user: user,
            refetchUser: refetch
        }}>
            {children}
        </ContractsInfoContext.Provider>
    );
};

export const useContractInfo = (): ContractsInfoContextType => {
    const context = useContext(ContractsInfoContext);
    if (!context) {
        throw new Error("useContractInfo has to be call inside ContractsInfoProvider");
    }
    return context;
};
