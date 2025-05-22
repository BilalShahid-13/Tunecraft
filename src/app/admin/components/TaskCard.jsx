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
export default function TaskCard({ username = 'bilal',
  time = '12hr dummy',
  isLoading = false,
  onClick = () => { } }) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{username}</CardTitle>
          <CardDescription>{formatTimeHMSS(time)}</CardDescription>
        </CardHeader>
        <CardContent>
        </CardContent>
        <CardFooter>
          {/* <p>Card Footer</p> */}
          <Button onClick={onClick}>{
            isLoading ? <>
              <Loader2 className='animate-spin' /> Loading
            </> : 'Approve'
          }</Button>
        </CardFooter>
      </Card>

    </>
  )
}
