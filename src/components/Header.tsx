'use client'
import {ConnectButton} from "@rainbow-me/rainbowkit";
import Image from "next/image";
import logo from "@/app/public/logo.png";
import {useGetHelperTokenBalance} from "@/hooks/useHelperTokenActions";
import {useContractInfo} from "@/contexts/ContractsInfoContext";
import {useAccount} from "wagmi";
import { Badge } from "@/components/ui/badge"
import { Loader, CircleX } from 'lucide-react';
import { toast } from "sonner";
import {formatBalance} from "@/utils/formatUtils";

const Header = () => {
    const { helperTokenAddress } = useContractInfo();
    const { isConnected, address } = useAccount();
    const { balance, isLoading, error, isError } = useGetHelperTokenBalance(helperTokenAddress, address);

    const displayBalance = () => {
        if (isLoading) return <Loader className="animate-spin" size="16" />
        if (isError) {
            toast.error(error?.message ?? "Failed to fetch balance");
            return <CircleX className="text-red-500" size="16" />
        }
        return <Badge>{formatBalance(balance)}$HELP</Badge>;
    }

    return (
        <div className="flex justify-between items-center p-5">
            <Image src={logo} width="50" height="50" alt="logo" />
            <div className={"flex items-center"}>
                {isConnected && displayBalance()}
                <ConnectButton showBalance={false}/>
            </div>
        </div>
    )
}

export default Header