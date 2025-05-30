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
import { handleDownloadWithRef } from "@/lib/handleDownloadWithName";
import { formatCentsToDollars, formatDateTime } from '@/lib/utils';
import useAllUsers from '@/store/allUsers';
import useNotificationStore from "@/store/notification";
import axios from 'axios';
import { Files, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from "sonner";

export default function AdminTaskCard({ username = 'bilal',
  time = '12hr dummy', email = 'b', file, role, orderName, planName, planPrice,
  item, crafterId, ref
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStates, setLoadingStates] = useState({})
  const downloadRefs = useRef([])
  const { setIsUpdate } = useAllUsers()
  const { isClicked, setClicked, notificationId } = useNotificationStore()
  const cardRefs = useRef({});

  const scrollToCard = useCallback(() => {
    console.log("Scrolling to notificationId:", notificationId);
    if (notificationId && cardRefs.current[notificationId]) {
      console.log("Found card ref for:", notificationId);
      cardRefs.current[notificationId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setClicked(false);
    } else {
      console.log("No card ref found for:", notificationId);
    }
  }, [notificationId]);


  useEffect(() => {
    // Delay the scroll by a short time to ensure the element is rendered
    if (isClicked) {
      setTimeout(scrollToCard, 200);
    }
  }, [scrollToCard]);


  const onApprove = async (item) => {
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
      <Card className={'w-full'}
        ref={(el) => {
          cardRefs.current[item._id] = el;
        }}>
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
            className={'max-sm:w-full cursor-pointer'}
            onClick={() => onApprove(item)}>{
              isLoading ?
                <>
                  <Loader2 className='animate-spin' /> Loading
                </> : 'Approve'
            }</Button>
          <Accordion type="single" collapsible className={'max-xs:w-full max-sm:w-full w-2xl'}>
            <AccordionItem value="item-1" >
              <AccordionTrigger className={'max-xs:text-xs cursor-pointer'}> View Submission Links</AccordionTrigger>
              <AccordionContent className={''}>
                <div className="w-full">
                  <div className='flex flex-col gap-2 justify-start items-start w-full'>
                    {file.map((items, index) =>
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
                            <Loader2 className='animate-spin w-full' />
                            Downloading</> : "Download File"}
                        </Button>
                        {/* Hidden anchor element for each file */}
                        <a ref={(el) => (downloadRefs.current[index] = el)}
                          style={{ display: "none" }} aria-hidden="true" />
                      </div>)}
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
