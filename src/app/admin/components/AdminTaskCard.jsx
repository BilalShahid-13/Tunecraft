"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToDollars, formatDateTime, formatTimeHMSS } from '@/lib/utils';
import useAllUsers from '@/store/allUsers';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";

export default function AdminTaskCard({ username = 'bilal',
  time = '12hr dummy', email = 'b', file, role, orderName, planName, planPrice,
  item, crafterId, ref
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
        toast.success(res.data.message)
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
      <Card className={'w-full'} ref={ref}>
        <CardHeader className={'w-full '}>
          <CardTitle className={'flex flex-row gap-12 justify-between items-center w-full'}>
            {/* order Template */}
            <div className="flex flex-col gap-2">
              <h2 className='capitalize italic font-light text-zinc-400'># {crafterId}</h2>
              <h2 className='capitalize text-3xl max-sm:text-xl max-xs:text-sm'> {orderName}</h2>
            </div>
            <div className='flex flex-col justify-end items-end gap-3'>
              <Badge className='capitalize font-semibold text-sm max-xs:text-xs'>{role}</Badge>
              <div className='flex flex-col justify-end items-end gap-3'>
                <p className='text-primary font-semibold max-sm:text-sm'>{planName}</p>
                <p className="max-xs:text-sm">${formatCentsToDollars(planPrice)}</p>
              </div>
            </div>
          </CardTitle>
          <Separator className="my-4" />
          <CardDescription className={'flex flex-row justify-between items-center'}>
            <div className='flex flex-col gap-1'>
              <h2 className='capitalize text-zinc-200 font-medium text-xl max-sm:text-lg max-xs:text-sm max-xs:font-bold'> {username}</h2>
              <a href={`mailto:${email}`} className="hover:underline">{email}</a>
            </div>
            <div className='flex flex-col justify-end items-end'>
              <p>{formatDateTime(time).date} </p>
              <p>{formatDateTime(time).time} </p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className={'flex flex-row-reverse max-sm:flex-col-reverse justify-between items-center gap-3'}>
          <Button
            className={'max-sm:w-full'}
            onClick={() => onApprove(item)}>{
              isLoading ?
                <>
                  <Loader2 className='animate-spin' /> Loading
                </> : 'Approve'
            }</Button>
          <Accordion type="single" collapsible className={'max-xs:w-full max-sm:w-full'}>
            <AccordionItem value="item-1" >
              <AccordionTrigger className={'max-xs:text-xs'}> View Submission Links</AccordionTrigger>
              <AccordionContent className={'max-w-lg max-sm:max-w-xs max-xs:max-w-[250px]'}>
                <div className="w-full overflow-x-auto">
                  <div className="flex space-x-2 pb-2 max-w-xl flex-col">
                    {file.map((file, index) => (
                      <Button
                        key={index}
                        variant="link"
                        className="cursor-pointer flex-shrink-0 whitespace-nowrap"
                        onClick={() => window.open(file, "_blank", "noopener,noreferrer")}
                      >
                        <p className="truncate max-xs:text-xs">{file}</p>
                      </Button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card >

    </>
  )
}
