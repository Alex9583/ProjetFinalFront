import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"

const NotConnected = () => {
    return (
        <>
            <Alert className="p-6 bg-white rounded-lg text-center mt-4">
                <AlertTitle className="text-lg">Connect your wallet to use the Dapp.</AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground mt-2">
                    By connecting your wallet you will be able to use the SuperHelper Dapp.
                </AlertDescription>
            </Alert>
        </>
    )
}

export default NotConnected;