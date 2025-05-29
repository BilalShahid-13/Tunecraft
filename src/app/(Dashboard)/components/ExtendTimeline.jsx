"use client";
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import useTasks from '@/store/tasks';

export default function ExtendTimeline({ isOpen, timeUp, onOpenChange, orderId, role, userId, setTimeUpHandled }) {
  const [isLoading, setLoading] = useState(false)
  const [endingLoading, setEndingLoading] = useState(false)
  const { setFetchedTasks } = useTasks();
  async function extendTask() {
    try {
      setLoading(true)
      const res = await axios.patch('/api/extend-crafter-time', {
        orderId,
        role,
        crafterId: userId,
      })
      if (res.status === 205) {
        setFetchedTasks(true)
      }
      if (res.status === 200) {
        setFetchedTasks(true)
        setTimeUpHandled(true)
        toast.success(res.data.message)
      }
      if (res.status === 204) {
        console.log('no content')
      }
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data.error)

    } finally {
      setFetchedTasks(true)
      onOpenChange(false)
      // loading = false
      setLoading(false)
    }
  }

  async function endTask() {
    setEndingLoading(true)
    try {
      const res = await axios.patch('/api/end-active-task', {
        orderId,
        role,
        crafterId: userId,
      })
      if (res.status === 200) {
        toast.success(res.data.message)
        setFetchedTasks(true);
      }
    } catch (error) {
      console.error(error.response.data.error);
    } finally {
      setFetchedTasks(true);
      setEndingLoading(false)
      onOpenChange(false)
    }
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Crafter Submission</AlertDialogTitle>
            <div className="space-y-2">
              <AlertDialogDescription>
                You can either:
              </AlertDialogDescription>
              <ul className="list-disc ml-5 text-muted-foreground text-sm">
                <li><strong>Grant a 3-hour extension</strong> – give you extra time to finish without penalty.</li>
                <li><strong>End the assignment</strong> – mark this task as failed, hide it from their dashboard, and apply the penalty.</li>
              </ul>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* extend */}
            {timeUp && <Button variant={'outline'}
              onClick={extendTask}
              disabled={isLoading}
              className={'text-white'}>{
              }{isLoading ? <>
                <Loader2 className='animate-spin' />
                Granting Extension
              </> : 'Grant 3 Hour Extension'}</Button>}
            {/* end */}
            <Button onClick={endTask}
              disabled={endingLoading}>
              {endingLoading ? <>
                <Loader2 className='animate-spin' />
                Ending Task
              </> : 'End Task'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}
