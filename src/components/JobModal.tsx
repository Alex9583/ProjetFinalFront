import { FC, useEffect, useState } from "react";
import { Job } from "@/entities/Job";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import {useTakeJob, useCompleteAndReviewJob, useCancelJob} from "@/hooks/useSuperHelperActions";
import { address } from "@/types/address";
import { toast } from "sonner";
import TransactionAlert from "@/components/TransactionAlert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {Query, useQueryClient} from "@tanstack/react-query";
import {useContractInfo} from "@/contexts/ContractsInfoContext";
import {useAccount} from "wagmi";

type WagmiReadContractQueryKey = [
    'readContract',
    {
        address?: string;
        functionName?: string;
        args?: string[];
        chainId?: number;
    }
];

type WagmiReadContractQuery = Query<unknown, Error, unknown, WagmiReadContractQueryKey>;

type JobModalProps = {
    job: Job | null;
    accountAddress?: address;
    onClose: () => void;
    reloadJobs: () => void;
};

const JobModal: FC<JobModalProps> = ({ job, accountAddress, onClose, reloadJobs }) => {
    const { takeJob, isPending: isTakingPending, isConfirmed: isTakingConfirmed, error: takeJobError, hash: takeJobHash, isConfirming: isTakingConfirming } = useTakeJob(accountAddress);
    const {
        completeAndReviewJob,
        isPending: isReviewPending,
        isConfirmed: isReviewConfirmed,
        error: reviewJobError,
        hash: reviewJobHash,
        isConfirming: isReviewConfirming
    } = useCompleteAndReviewJob(accountAddress);
    const {
        cancelJob,
        hash: cancelJobHash,
        isPending: isCancelPending,
        isConfirming: isCancelConfirming,
        isConfirmed: isCancelConfirmed,
        error: cancelJobError
    } = useCancelJob(accountAddress);
    const {helperTokenAddress} = useContractInfo();
    const {address: userAddress} = useAccount();

    const queryClient = useQueryClient();

    const [rating, setRating] = useState<number>(0);

    const isWorker = accountAddress?.toLowerCase() === job?.worker?.toLowerCase();
    const isCreator = accountAddress?.toLowerCase() === job?.creator?.toLowerCase();

    const handleReview = () => {
        if (rating < 1 || rating > 5) {
            toast.error('Please choose a valid rating from 1 to 5.');
            return;
        }

        if (job) {
            completeAndReviewJob(job.id, rating);
        }
    };

    const handleCancelJob = () => {
        if (job) {
            cancelJob(job.id);
        }
    };

    useEffect(() => {
        if (isTakingConfirmed) {
            toast.success('Job successfully taken!');
            reloadJobs();
            onClose();
        }

        if (takeJobError) {
            toast.error(`Error: ${takeJobError.message}`);
        }
    }, [isTakingConfirmed, takeJobError, reloadJobs, onClose]);

    useEffect(() => {
        if (isReviewConfirmed) {
            toast.success('Review successfully submitted!');
            reloadJobs();
            onClose();
        }

        if (reviewJobError) {
            toast.error(`Error: ${reviewJobError.message}`);
        }
    }, [isReviewConfirmed, reviewJobError, reloadJobs, onClose]);

    useEffect(() => {
        if (isCancelConfirmed) {
            toast.success("Job canceled successfully!");
            reloadJobs();
            queryClient.invalidateQueries({
                predicate: (query: WagmiReadContractQuery) =>
                    query.queryKey[0] === 'readContract' &&
                    query.queryKey[1]?.address?.toLowerCase() === helperTokenAddress.toLowerCase() &&
                    query.queryKey[1]?.functionName === 'balanceOf' &&
                    query.queryKey[1]?.args?.[0]?.toLowerCase() === userAddress?.toLowerCase()
            });
            onClose();
        }

        if (cancelJobError) {
            toast.error(`Error: ${cancelJobError.message}`);
        }
    }, [isCancelConfirmed, cancelJobError, reloadJobs, onClose]);

    return (
        <Dialog open={!!job} onOpenChange={onClose}>
            <DialogContent className="max-w-[550px]">
                {job && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold">Job Details</DialogTitle>
                            <DialogDescription>
                                Review the details of this job.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 space-y-2">
                            <p><strong>Description:</strong> {job.description}</p>
                            <p><strong>Creator:</strong> {job.creator}</p>
                            <p><strong>Worker:</strong> {job.worker !== "0x0000000000000000000000000000000000000000" ? job.worker : "Not taken yet"}</p>
                            <p><strong>Reward:</strong> {Number(job.reward) / 100} $HELP</p>
                            <p><strong>Status:</strong> {job.jobStatus === 0 ? "Available" : "Taken"}</p>
                        </div>

                        <TransactionAlert
                            hash={takeJobHash || reviewJobHash || cancelJobHash}
                            isConfirming={isTakingConfirming || isReviewConfirming || isCancelConfirming}
                            isConfirmed={isTakingConfirmed || isReviewConfirmed || isCancelConfirmed}
                            error={takeJobError || reviewJobError || cancelJobError}
                        />

                        <DialogFooter className="mt-4 justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>

                            {isCreator && job.jobStatus === 0 ? (
                                <Button
                                    disabled={isCancelPending || isCancelConfirming}
                                    onClick={handleCancelJob}>
                                    {isCancelPending || isCancelConfirming ? "Canceling..." : "Cancel Job"}
                                </Button>
                            ) : (
                                job.jobStatus === 0 && (
                                    <Button onClick={() => takeJob(job.id)} disabled={isTakingPending}>
                                        {isTakingPending ? "Confirming..." : "Take the Job"}
                                    </Button>
                                )
                            )}

                            {job.jobStatus === 1 && isWorker && (
                                <div className="text-muted-foreground font-medium">
                                    Waiting for review
                                </div>
                            )}

                            {job.jobStatus === 1 && isCreator && (
                                <div className="flex flex-col gap-3 items-end">
                                    <Select onValueChange={(value) => setRating(Number(value))}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select rating (1-5)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <SelectItem key={num} value={num.toString()}>
                                                    {num}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button onClick={handleReview} disabled={isReviewPending || rating === 0}>
                                        {isReviewPending ? "Submitting..." : "Submit Review & Validate"}
                                    </Button>
                                </div>
                            )}
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default JobModal;