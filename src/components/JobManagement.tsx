import React, {useState, useEffect, useMemo, useCallback} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import TransactionAlert from "@/components/TransactionAlert";
import {useCreateJob} from "@/hooks/useSuperHelperActions";
import {useJobsEvents} from "@/hooks/useJobsEvents";
import {useAccount} from "wagmi";
import {toast} from "sonner";
import {Query, useQueryClient} from "@tanstack/react-query";
import {useGetHelperTokenApprove} from "@/hooks/useHelperTokenActions";
import {useContractInfo} from "@/contexts/ContractsInfoContext";
import JobCard from "@/components/JobCard";
import JobModal from "@/components/JobModal";
import {Job} from "@/entities/Job";
import DisputedJobModal from "@/components/DisputedJobModal";

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


const JobManagement = () => {
    const {helperTokenAddress, isOwner} = useContractInfo();
    const {address: userAddress} = useAccount();
    const {addedJobs, takenJobs, disputedJobs, reloadJobs} = useJobsEvents();
    const {
        createJob,
        hash: createJobHash,
        isPending: isCreatePending,
        isConfirming: isCreateConfirming,
        isConfirmed: isCreateConfirmed,
        error: createJobError
    } = useCreateJob(userAddress);
    const {
        approve,
        hash: approveHash,
        isConfirming: isApproveConfirming,
        isConfirmed: isApproveConfirmed,
        error: approveError
    } = useGetHelperTokenApprove(helperTokenAddress, userAddress);

    const [description, setDescription] = useState("");
    const [reward, setReward] = useState("");
    const [isApproving, setIsApproving] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedDisputedJob, setSelectedDisputedJob] = useState<Job | null>(null);

    const closeModal = useCallback(() => setSelectedJob(null), []);
    const closeDisputeModal = useCallback(() => setSelectedDisputedJob(null), []);

    const queryClient = useQueryClient();

    const handleSelectDisputedJob = useCallback((job: Job) => {
        setSelectedDisputedJob(job);
    }, []);

    const handleCreateJob = useCallback(() => {
        if (!description || !reward) {
            toast.error("Please fill all the fields.");
            return;
        }

        const rewardAmount = BigInt(Number(reward) * 100);
        setIsApproving(true);
        approve(rewardAmount);
    }, [description, reward, approve]);

    useEffect(() => {
        if (isApproveConfirmed && isApproving) {
            const rewardAmount = BigInt(Number(reward) * 100);
            createJob(description, rewardAmount);
            setIsApproving(false);
        }
    }, [isApproveConfirmed]);

    useEffect(() => {
        if (isCreateConfirmed) {
            reloadJobs();
            queryClient.invalidateQueries({
                predicate: (query: WagmiReadContractQuery) =>
                    query.queryKey[0] === 'readContract' &&
                    query.queryKey[1]?.address?.toLowerCase() === helperTokenAddress.toLowerCase() &&
                    query.queryKey[1]?.functionName === 'balanceOf' &&
                    query.queryKey[1]?.args?.[0]?.toLowerCase() === userAddress?.toLowerCase()
            });
            setDescription("");
            setReward("");
            toast.success("Job created successfully.");
        }
    }, [isCreateConfirmed, helperTokenAddress, queryClient, reloadJobs, userAddress]);

    const transactionInProgress = useMemo(() => isApproving || isApproveConfirming || isCreatePending || isCreateConfirming, [
        isApproving, isApproveConfirming, isCreatePending, isCreateConfirming
    ]);

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle>Create a job</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Job description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Reward (in $HELP)"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                    />
                    <Button
                        onClick={handleCreateJob}
                        disabled={transactionInProgress}
                    >
                        {isApproving ? "Approving" :
                            isApproveConfirming ? "Approve confirming" :
                                isCreatePending ? "Creation pending" :
                                    isCreateConfirming ? "Creation confirming" : "Create"
                        }
                    </Button>

                    {approveHash && <TransactionAlert
                        hash={approveHash}
                        isConfirming={isApproveConfirming}
                        isConfirmed={isApproveConfirmed}
                        error={approveError}
                    />}

                    {createJobHash && <TransactionAlert
                        hash={createJobHash}
                        isConfirming={isCreateConfirming}
                        isConfirmed={isCreateConfirmed}
                        error={createJobError}
                    />}
                </CardContent>
            </Card>


            <Separator className="my-8"/>

            <h2 className="text-2xl font-semibold mb-4">Jobs created</h2>

            {addedJobs.length === 0 ? (
                <p className="text-muted-foreground">No jobs available.</p>
            ) : (
                <div className="grid gap-4">
                    {addedJobs.map(job => (
                        <JobCard key={job.id.toString()} job={job} onSelect={setSelectedJob}/>
                    ))}
                </div>
            )}

            <Separator className="my-8"/>

            <h2 className="text-2xl font-semibold mb-4">Jobs Taken</h2>

            {takenJobs.length === 0 ? (
                <p className="text-muted-foreground">No jobs taken.</p>
            ) : (
                <div className="grid gap-4">
                    {takenJobs.map(job => (
                        <JobCard key={job.id.toString()} job={job} onSelect={setSelectedJob}/>
                    ))}
                </div>
            )}

            {isOwner && (<>
                    <Separator className="my-8"/>

                    <h2 className="text-2xl font-semibold mb-4">Jobs Disputed</h2>

                    {disputedJobs.length === 0 ? (
                        <p className="text-muted-foreground">No jobs disputed.</p>
                    ) : (
                        <div className="grid gap-4">
                            {disputedJobs.map(job => (
                                <JobCard key={job.id.toString()} job={job} onSelect={handleSelectDisputedJob}/>
                            ))}
                        </div>
                    )}</>
            )}

            <DisputedJobModal
                job={selectedDisputedJob}
                accountAddress={userAddress}
                onClose={closeDisputeModal}
                reloadJobs={reloadJobs}
            />

            <JobModal
                job={selectedJob}
                accountAddress={userAddress}
                onClose={closeModal}
                reloadJobs={reloadJobs}
            />
        </div>
    );
};

export default JobManagement;