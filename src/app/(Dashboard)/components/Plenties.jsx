"use client";
import plentyAction from "@/components/serverComponents/plentyAction"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TriangleAlert } from 'lucide-react'
import { useEffect, useState } from "react";
export default function Plenties() {
  const [plenty, setPlenty] = useState(0);
  useEffect(() => {
    fetchPlenties(); // Fetch plenties once the component is mounted
  }, []);

  const fetchPlenties = async () => {
    try {
      const res = await plentyAction(); // Call the action function
      console.log("Plenty:", res); // Log the fetched plenty count
      setPlenty(res.plenty); // Update the state with plenty count
    } catch (error) {
      console.error("Error fetching plenties:", error);
    }
  };
  return (
    <>
      <Alert variant="default | destructive"
        className={'flex flex-col justify-start items-start gap-3'}>
        <div className={'flex flex-row justify-between items-center w-full px-3'}>
          <div className="flex flex-row justify-center items-center gap-2">
            <TriangleAlert className="text-yellow-400" />
            <AlertTitle className={'font-inter'}>Plenties</AlertTitle>
          </div>
          <AlertDescription className={'font-inter'}>
            <p>0{plenty}</p>
          </AlertDescription>
        </div>
        {plenty >= 2 && <div className="flex flex-col gap-2">
          <h3 className="font-inter font-semibold">Attention, Crafter!</h3>
          <p className="text-sm italic text-zinc-400">It seems that you have reached a
            plenty count of 2 or 3. As a result, all
            available tasks have been temporarily
            frozen for the next 2 hours. During this
            time, you will not be able to pick up
            new tasks or work on the current ones.
          </p>
        </div>}
      </Alert>
    </>
  )
}
