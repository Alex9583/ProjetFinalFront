import {useContractInfo} from "@/contexts/ContractsInfoContext";
import {Button} from "@/components/ui/button";
import {Alert, AlertTitle, AlertDescription} from "@/components/ui/alert";
import {useDistributeToNewUser} from "@/hooks/useSuperHelperActions";
import TransactionAlert from "@/components/TransactionAlert";
import {useAccount} from "wagmi";
import useFirstRegistrationEvent from "@/hooks/useRegistrationEvents";
import JobManagement from "@/components/JobManagement";

const SuperHelperHome = () => {
    const {user, refetchUser} = useContractInfo();
    const {address} = useAccount();
    const {distributeToNewUser, isPending, hash, error, isConfirming, isConfirmed} = useDistributeToNewUser(address);

    const handleRegisterClick = () => {
        distributeToNewUser();
    };

    useFirstRegistrationEvent({
        userAddress: address,
        isRegistered: user?.isRegistered,
        callback: refetchUser,
    });

    return (
        <div className="flex flex-col items-center justify-center">
            {user?.isRegistered ? (
                <JobManagement/>
            ) : (
                <>
                    <Alert className="mb-4 max-w-md">
                        <AlertTitle>Information</AlertTitle>
                        <AlertDescription>
                            You need to register to use the app.
                        </AlertDescription>
                    </Alert>

                    <Button onClick={handleRegisterClick} disabled={isPending || isConfirmed}>
                        {isConfirmed ? "Done" : isPending ? "Registering..." : "Register"}
                    </Button>

                    <TransactionAlert hash={hash} isConfirming={isConfirming} isConfirmed={isConfirmed} error={error}/>
                </>
            )}
        </div>
    );
};

export default SuperHelperHome;