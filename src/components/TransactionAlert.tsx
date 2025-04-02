import { FC, useEffect, useState } from "react";
import { type BaseError } from 'wagmi';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { RocketIcon, TriangleAlertIcon } from "lucide-react";

type TransactionAlertProps = {
  hash?: string;
  isConfirming?: boolean;
  isConfirmed?: boolean;
  error?: BaseError;
};

const TransactionAlert: FC<TransactionAlertProps> = ({ hash, isConfirming, isConfirmed, error }) => {

  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isConfirmed) {
      setShowSuccess(true);
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }

    return () => clearTimeout(timer);

  }, [isConfirmed]);

  return (
      <>
        {hash && !isConfirmed && (
            <Alert className="bg-lime-200 mt-5 mb-5">
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                Transaction hash : {hash}
              </AlertDescription>
            </Alert>
        )}

        {isConfirming && (
            <Alert className="bg-yellow-200 mt-5 mb-5">
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                The transaction is being confirmed.
              </AlertDescription>
            </Alert>
        )}

        {showSuccess && (
            <Alert className="bg-lime-200 mt-5 mb-5">
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Congrats !</AlertTitle>
              <AlertDescription>
                Transaction confirmed.
              </AlertDescription>
            </Alert>
        )}

        {error && (
            <Alert className="bg-rose-200 mt-5 mb-5">
              <TriangleAlertIcon className="h-4 w-4" />
              <AlertTitle>Error !</AlertTitle>
              <AlertDescription>
                Error : {error.shortMessage || error.message}
              </AlertDescription>
            </Alert>
        )}
      </>
  )
};

export default TransactionAlert;