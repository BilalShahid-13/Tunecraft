"use client";
import axios from 'axios'
import { useState } from 'react'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { FileIcon, Loader2 } from 'lucide-react'
import { formatCentsToDollars, formatTimeHMSS } from '@/lib/utils'
import useAllUsers from '@/store/allUsers';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminTaskCard({ username = 'bilal',
  time = '12hr dummy', email = 'b', file, role, orderName, planName, planPrice,
  item, crafterId
}) {
  const [isLoading, setIsLoading] = useState(false)
  const { setIsUpdate } = useAllUsers()

  const onApprove = async (item) => {
    console.log('adminTask OnClick', item._id);
    let setRole = '';
    if (item.submittedCrafter.role === 'lyricist') {
      setRole = 'singer';
    } else if (item.submittedCrafter.role === 'singer') {
      setRole = 'engineer';
    } else if (item.submittedCrafter.role === 'engineer') {
      setRole = 'engineer';
    }
    console.log(item.submittedCrafter.role)

    try {
      setIsLoading(true)
      const res = await axios.patch('/api/admin/crafter-approve', {
        orderId: item._id,
        role: setRole,
        prevRole: item.submittedCrafter.role
      })
      if (res.status === 200) {
        console.log(res.data)
        setIsUpdate(true);
      }
    }
    catch (error) {
      console.error(error.response.data.error);
    }
    finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <Card>
        <CardHeader className={'w-full'}>
          <CardTitle className={'flex flex-row gap-12 justify-between items-center w-full'}>
            <h2 className='capitalize'> {orderName}</h2>
            <div className='flex flex-col justify-end items-end gap-3'>
              <Badge className='capitalize font-semibold text-sm'>{role}</Badge>
              <div className='flex flex-col justify-end items-end gap-3'>
                <p className='text-primary font-semibold'>{planName}</p>
                <p>${formatCentsToDollars(planPrice)}</p>
              </div>
            </div>
          </CardTitle>
          <div className='flex flex-row gap-5'>
            <h2 className='capitalize'> {username}</h2>
            <h2 className='capitalize italic font-light text-zinc-400'># {crafterId}</h2>
          </div>
          <CardDescription>
            <p>
              {formatTimeHMSS(time)}
            </p>
            <p>{email}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className={'flex flex-row-reverse justify-between items-center gap-3'}>
          <Button onClick={() => onApprove(item)}>{
            isLoading ?
              <>
                <Loader2 className='animate-spin' /> Loading
              </> : 'Approve'
          }</Button>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger> View Submission</AccordionTrigger>
              <AccordionContent className={'max-w-xl'}>
                <div className="w-full overflow-x-auto">
                  <div className="flex space-x-2 pb-2 max-w-xl flex-col">
                    {file.map((file, index) => (
                      <Button
                        key={index}
                        variant="link"
                        className="cursor-pointer flex-shrink-0 whitespace-nowrap"
                        onClick={() => window.open(file, "_blank", "noopener,noreferrer")}
                      >
                        <p className="truncate">{file}</p>
                      </Button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* <Button
            variant="link"
            className={'cursor-pointer'}
            onClick={() => window.open(file, "_blank", "noopener,noreferrer")}
          >

            View Submission
          </Button> */}
        </CardContent>
        <CardFooter>
          {/* <p>Card Footer</p> */}

        </CardFooter>
      </Card >

    </>
  )
}
