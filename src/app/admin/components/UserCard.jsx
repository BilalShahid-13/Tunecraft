"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useAllUsers from "@/store/allUsers";
import { generateStrongPassword } from "@/utils/generateStrongPassword";
import axios from "axios";
import { Check, Loader2, Mail, Phone, Sliders, User, X } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateUser from "./UpdateUser";

function Loader() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export default function UserCard({ users, isLoading = false, approveUser = false }) {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [approveLoading, setApproveLoading] = useState(false)
  const [discardLoading, setDiscardLoading] = useState(false)
  const [updateUserProfile, setUpdateUserProfile] = useState(null);
  const { setIsUpdate } = useAllUsers()

  useEffect(() => {
    if (users) {
      setAllUsers(users)
      console.log('uses', users)
    }
    if (loading) {
      setLoading(isLoading)
    }
  }, [users, isLoading])

  async function onApprove(user) {
    setApproveLoading(user._id);
    setIsUpdate(true);
    const password = generateStrongPassword();
    try {
      const res = await axios.patch('/api/approve-application', {
        id: user._id,
        email: user.email,
        username: user.username,
        password: password,
      });
      if (res) {
        setIsUpdate();
      }
      toast.success(res.data.message);
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to send reset link';
      console.error(msg);
      toast.error(msg);
    } finally {
      setApproveLoading(null);
    }
  }

  async function onDiscard(user) {
    setDiscardLoading(user._id)
    console.log('user', user._id)
    try {
      const res = await axios.delete('/api/discard-application', {
        data: { id: user._id }
      });
      if (res) {
        setIsUpdate();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDiscardLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {loading ? <Loader />
        : allUsers.map((items, index) =>
          <AlertDialog key={index} className='relative z-0'>
            <Card key={index} className={'relative z-0 max-lg:w-full'}>
              <CardHeader className={'flex flex-col gap-4'}>
                <CardTitle className={'flex justify-between items-center gap-3 text-lg font-inter capitalize w-full'}>
                  <div className='flex flex-row justify-start items-center gap-3'>
                    <Sliders color={'#ff7e6e'} size={15} />
                    {items.role}
                    <Badge className={'bg-[#ff7e6e]'}>{items.isApproved ? 'Approved' : 'Pending'}</Badge>
                  </div>
                  <p className='capitalize font-medium text-zinc-200'>{items?.musicTemplate}</p>
                </CardTitle>
                <CardDescription className={'flex flex-col gap-2'}>
                  <p className="capitalize font-inter flex flex-row gap-2 justify-start items-center"> <User size={13} /> {items?.username}</p>
                  <a href={`tel:${items.phone}`} className='flex flex-row justify-start items-center gap-1 hover:underline'>
                    <Phone size={13} />
                    {items.phone}
                  </a>
                  <a href={`mailto:${items.email}`} className='flex flex-row justify-start items-center gap-1 hover:underline'>
                    <Mail size={13} />
                    {items.email}
                  </a>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className={'cursor-pointer'}>
                      View CV
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* CV Preview (using Google Docs Viewer) */}
                      <iframe
                        src={`https://docs.google.com/viewer?url=${items.cv}&embedded=true`}
                        width="100%"
                        height="600px"
                        title="CV Preview"
                      ></iframe>

                      {/* Download Button */}
                      <a
                        href={items.cv}
                        download={`${items.username}CV-Resume.pdf`}
                        className="mt-4 inline-block bg-[#ff7e6e] hover:bg-red-400 transition duration-150 ease text-zinc-900 py-2 px-4 rounded"
                      >
                        Download CV
                      </a>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {items.info && <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className={'cursor-pointer'}>
                      Additional Info
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* CV Preview (using Google Docs Viewer) */}
                      {items?.info}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>}
              </CardContent>

              {items.isApproved ? null
                : <CardFooter className={'flex flex-row-reverse justify-end items-center w-full gap-3'}>
                  <Button className="bg-[#ff7e6e] hover:bg-red-400 cursor-pointer active:bg-red-400"
                    onClick={() => onApprove(items)}
                    disabled={approveLoading === items._id}>
                    {approveLoading === items._id ?
                      <React.Fragment>
                        <Loader2 className="animate-spin" />
                        Approving
                      </React.Fragment>
                      :
                      <React.Fragment>
                        <Check /> Approve</React.Fragment>}
                  </Button>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={discardLoading === items._id}
                      className="bg-zinc-700 text-white hover:bg-zinc-800 cursor-pointer active:green-300">
                      {discardLoading === items._id ?
                        <React.Fragment>
                          <Loader2 className="animate-spin" />
                          Discarding
                        </React.Fragment>
                        :
                        <React.Fragment>
                          <X /> Discard</React.Fragment>}
                    </Button>
                  </AlertDialogTrigger>
                </CardFooter>
              }
              {approveUser ?
                <div className="flex flex-row justify-start items-center w-full gap-3 ml-4"
                >
                  <div onClick={(e) => setUpdateUserProfile(items)}>
                    <UpdateUser
                      user={updateUserProfile}
                    />
                  </div>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => onDiscard(items)}
                      disabled={discardLoading === items._id}
                      className="bg-zinc-700 text-white hover:bg-zinc-800 cursor-pointer active:green-300">
                      {discardLoading === items._id ?
                        <React.Fragment>
                          <Loader2 className="animate-spin" />
                          Discarding
                        </React.Fragment>
                        :
                        <React.Fragment>
                          <X /> Discard</React.Fragment>}
                    </Button>
                  </AlertDialogTrigger>
                </div> : null}
            </Card >
          </AlertDialog>
        )}
    </div>
  )
}
