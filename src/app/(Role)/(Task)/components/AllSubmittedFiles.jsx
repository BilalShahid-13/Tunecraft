import { Button } from '@/components/ui/button'
import { Files } from 'lucide-react'
import React from 'react'

export default function AllSubmittedFiles({ files }) {
  return (
    <>
      <div className='bg-[#111111] flex
      flex-col gap-8 p-4 rounded-lg max-sm:max-w-sm'>
        <h2 className='text-xl font-semibold font-inter'>All Submitted Files</h2>
        <div className='flex flex-col gap-2 justify-start items-start'>
          {files.map((items, index) =>
            <div key={index} className='flex flex-row gap-4 justify-center items-center bg-zinc-600/20 p-3 rounded-lg'>
              <Files size={50}
                className='text-red-400 bg-primary/20 p-1 rounded-md' />
              <p className='text-zinc-400 flex-shrink-0 whitespace-nowrap truncate max-w-3xl'>{items}</p>
              <Button
                variant="link"
                className="cursor-pointer"
                onClick={() => window.open(items, "_blank", "noopener,noreferrer")}>Download File</Button>
            </div>)}
        </div>
      </div>
    </>
  )
}
