import type {FC} from "react";
import { type BaseError } from 'wagmi';
import {Alert, AlertDescription, AlertTitle} from "./ui/alert";
import {RocketIcon, TriangleAlertIcon} from "lucide-react";

type TransactionAlertProps = {
  hash?: string;
  isConfirming?: boolean;
  isConfirmed?: boolean;
  error?: BaseError;
};

const TransactionAlert: FC<TransactionAlertProps> = ({ hash, isConfirming, isConfirmed, error }) => {
  return (
      <>
        {hash &&
            <Alert className="bg-lime-200 mt-5 mb-5">
              <RocketIcon className="h-4 w-4"/>
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                Hash de la transaction : {hash}
              </AlertDescription>
            </Alert>
        }
        {isConfirming &&
            <Alert className="bg-yellow-200 mt-5 mb-5">
              <RocketIcon className="h-4 w-4"/>
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                La transaction est en train d'être confirmée.
              </AlertDescription>
            </Alert>}
        {isConfirmed &&
            <Alert className="bg-lime-200 mt-5 mb-5">
              <RocketIcon className="h-4 w-4"/>
              <AlertTitle>Bravo !</AlertTitle>
              <AlertDescription>
                Transaction confirmée.
              </AlertDescription>
            </Alert>}
        {error && (
            <Alert className="bg-rose-200 mt-5 mb-5">
              <TriangleAlertIcon className="h-4 w-4"/>
              <AlertTitle>Erreur !</AlertTitle>
              <AlertDescription>
                Erreur : {error.shortMessage || error.message}
              </AlertDescription>
            </Alert>
        )}
      </>
  )
};

export default TransactionAlert;