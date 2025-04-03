'use client'
import { useAccount } from "wagmi";
import SuperHelperHome from "@/components/SuperHelperHome";
import NotConnected from "@/components/NotConnected";

export default function Home() {
  const {isConnected} = useAccount();
  return (
      <main className="flex min-h-screen flex-col items-center p-4 md:p-8 ">
        <div className="w-full max-w-4xl">

          {isConnected ? (
              <SuperHelperHome />
          ) : (
              <NotConnected />
          )}


        </div>
      </main>
  );
}
