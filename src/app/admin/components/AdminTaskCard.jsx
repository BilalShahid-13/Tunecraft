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
import { Loader2 } from 'lucide-react'
import { formatTimeHMSS } from '@/lib/utils'
import useAllUsers from '@/store/allUsers';
export default function AdminTaskCard({ username = 'bilal',
  time = '12hr dummy', email = 'b', file,
  item,
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
        <CardHeader>
          <CardTitle className={'capitalize'}>{username}</CardTitle>
          <CardDescription>
            <p>
              {formatTimeHMSS(time)}
            </p>
            <p>{email}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className={'flex flex-row-reverse justify-start items-center gap-3'}>
          <Button onClick={() => onApprove(item)}>{
            isLoading ?
              <>
                <Loader2 className='animate-spin' /> Loading
              </> : 'Approve'
          }</Button>
          <Button
            variant="link"
            className={'cursor-pointer'}
            onClick={() => window.open(file, "_blank", "noopener,noreferrer")}
          >
            View Submission
          </Button>
        </CardContent>
        <CardFooter>
          {/* <p>Card Footer</p> */}

        </CardFooter>
      </Card>

    </>
  )
}
