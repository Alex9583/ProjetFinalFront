'use client'
import React, {createContext, useContext, ReactNode, useEffect} from "react";
import {useGetHelperTokenAddress} from "@/hooks/useSuperHelperActions";
import { toast } from "sonner";
import {address} from "@/types/address";


type ContractsInfoContextType = {
    helperTokenAddress: address;
};

const ContractsInfoContext = createContext<ContractsInfoContextType | undefined>(undefined);

export const ContractsInfoProvider = ({children}: { children: ReactNode }) => {
    const {helperTokenAddress, isError, error} = useGetHelperTokenAddress();

    useEffect(() => {
        if (isError && error) {
            toast.error(`Error while fetching helperToken address : ${error.message}`);
        }
    }, [isError, error]);


    return (
        <ContractsInfoContext.Provider value={{
            helperTokenAddress: helperTokenAddress
        }}>
            {children}
        </ContractsInfoContext.Provider>
    );
};

export const useContractAddress = (): ContractsInfoContextType => {
    const context = useContext(ContractsInfoContext);
    if (!context) {
        throw new Error("useContractAddress has to be call inside ContractsInfoProvider");
    }
    return context;
};
