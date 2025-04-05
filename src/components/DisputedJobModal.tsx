import {FC, useEffect} from "react";
import {Job} from "@/entities/Job";
import {Button} from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import {toast} from "sonner";
import TransactionAlert from "@/components/TransactionAlert";
import {useHandleDisputedJob} from "@/hooks/useSuperHelperActions";
import {address} from "@/types/address";

type DisputedJobModalProps = {
    job: Job | null;
    accountAddress?: address;
    onClose: () => void;
    reloadJobs: () => void;
};

const DisputedJobModal: FC<DisputedJobModalProps> = ({job, accountAddress, onClose, reloadJobs}) => {
    const {
        handleDisputedJob,
        hash,
        error,
        isPending,
        isConfirming,
        isConfirmed
    } = useHandleDisputedJob(accountAddress);

    const handleResolve = () => {
        if (job) handleDisputedJob(job.id, true);
    };

    const handleUnresolve = () => {
        if (job) handleDisputedJob(job.id, false);
    };

    useEffect(() => {
        if (isConfirmed) {
            toast.success('Dispute handling succeeded!');
            reloadJobs();
            onClose();
        }
        if (error) {
            toast.error(`Error: ${error.message}`);
        }
    }, [isConfirmed, error, reloadJobs, onClose]);

    return (
        <Dialog open={!!job} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Disputed Job Detail</DialogTitle>
                    <DialogDescription>{job?.description}</DialogDescription>
                </DialogHeader>

                <div className="my-4">Reward: {Number(job?.reward) / 100} $HELP</div>

                <DialogFooter className="flex justify-between gap-4">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <div className="flex gap-4">
                        <Button variant="destructive" onClick={handleUnresolve} disabled={isPending || isConfirming}>
                            Dispute Unresolved
                        </Button>
                        <Button onClick={handleResolve} disabled={isPending || isConfirming}>
                            Dispute Resolved
                        </Button>
                    </div>
                </DialogFooter>

                <TransactionAlert
                    hash={hash}
                    isConfirming={isConfirming}
                    isConfirmed={isConfirmed}
                    error={error}
                />
            </DialogContent>
        </Dialog>
    );
};

export default DisputedJobModal;