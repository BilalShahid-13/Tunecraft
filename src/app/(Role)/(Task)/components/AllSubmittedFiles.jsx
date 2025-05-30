"use client";
import { Button } from '@/components/ui/button';
import { handleDownloadWithRef } from '@/lib/handleDownloadWithName';
import { Files, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';

export default function AllSubmittedFiles({ files }) {
  const [loadingStates, setLoadingStates] = useState({})
  const downloadRefs = useRef([])
  const handleDownload = async (fileUrl, fileName, index) => {
    setLoadingStates((prev) => ({ ...prev, [index]: true }))

    try {
      const linkRef = { current: downloadRefs.current[index] }
      await handleDownloadWithRef(fileUrl, fileName, linkRef)
    } finally {
      setLoadingStates((prev) => ({ ...prev, [index]: false }))
    }
  }
  return (
    <>
      <div className='bg-[#111111] flex w-full
      flex-col gap-8 p-4 rounded-lg max-sm:max-w-sm'>
        <h2 className='text-xl font-semibold font-inter'>All Submitted Files</h2>
        <div className='flex flex-col gap-2 justify-start items-start w-full'>
          {files.map((items, index) =>
            <div key={index} className='flex flex-row gap-4 justify-center items-center
             bg-zinc-600/20 p-3 rounded-lg w-full'>
              <div className='flex flex-row gap-4 justify-start items-center w-full'>
                <Files size={30}
                  className='text-red-400 bg-primary/20 p-1 rounded-md' />
                <p className='text-zinc-400 flex-shrink-0 whitespace-nowrap truncate max-w-3xl'>{items.fileName}</p>
              </div>
              <Button
                variant="link"
                className="cursor-pointer"
                disabled={loadingStates[index]}
                onClick={() => handleDownload(items.fileUrl, items.fileName, index)}
              >
                {loadingStates[index] ? <>
                  <Loader2 className='animate-spin'/>
                  Downloading</> : "Download File"}
              </Button>
              {/* Hidden anchor element for each file */}
              <a ref={(el) => (downloadRefs.current[index] = el)}
                style={{ display: "none" }} aria-hidden="true" />
            </div>)}
        </div>
      </div>
    </>
  )
}
