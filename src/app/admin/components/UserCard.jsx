"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
import { Check, Frown, Loader2, Mail, Phone, Sliders, User, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import UpdateUser from "./UpdateUser";
import useNotificationStore from "@/store/notification";
import { _userStatus } from "@/lib/utils";
import { Loader } from "@/utils/Skeleton";

export default function UserCard({ users, isLoading = false, userStatus = null, userRole = false }) {
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [approveLoading, setApproveLoading] = useState(false)
  const [discardLoading, setDiscardLoading] = useState(false)
  const [updateUserProfile, setUpdateUserProfile] = useState(null);
  const [isOpen, setOpen] = useState(false)
  const [frameLoading, setFrameLoading] = useState(null)
  const { setIsUpdate } = useAllUsers()
  const { isClicked, setClicked, notificationId } = useNotificationStore()
  const cardRefs = useRef({});
  useEffect(() => {
    if (users) {
      setAllUsers(users)
    }
    if (loading) {
      setLoading(isLoading)
    }
  }, [users, isLoading])

  const scrollToCard = useCallback(() => {
    const clickedNotificationId = notificationId;
    if (
      notificationId &&
      cardRefs.current[clickedNotificationId]
    ) {
      cardRefs.current[clickedNotificationId].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setClicked(false);
    }
  }, [notificationId]);

  useEffect(() => {
    // Delay the scroll by a short time to ensure the element is rendered
    if (isClicked) {
      setTimeout(scrollToCard, 200);
    }
  }, [scrollToCard]);

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
        console.log('userCard', res)
      }
      toast.success(`${user.crafterId} ${res.data.message}`);
      setIsUpdate(true);
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
    try {
      const res = await axios.delete('/api/reject-application', {
        data: { id: user._id }
      });
      if (res.statusText === 'OK') {
        toast.success(user.crafterId + 'Application Discarded');
        setTimeout(() => setIsUpdate(), 500);

      }
    } catch (error) {
      console.error(error);
    } finally {
      setDiscardLoading(false)
    }
  }

  async function onHide(user) {
    setDiscardLoading(user._id)
    try {
      const res = await axios.patch('/api/hide-application', {
        data: { id: user._id }
      });
      if (res.statusText === 'OK') {
        setIsUpdate();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDiscardLoading(false)
    }
  }

  const handleIframeLoad = () => {
    setFrameLoading(false);
  };

  if (allUsers.length === 0) {
    return (
      <div className="flex justify-center items-center gap-3 flex-col">
        {/* <Frown className="text-red-500" size={50} /> */}
        <p className="text-zinc-400 font-inter">{` No users have been ${userStatus} yet. Don’t worry, let’s get things started!`}
        </p>
      </div>
    )
  }



  return (
    <div className="flex flex-col gap-3">
      {loading ? <Loader />
        : allUsers.map((items, index) =>
          <AlertDialog key={index} className='relative z-0'>
            <Card key={index} className={'relative z-0 max-lg:w-full'}
              ref={(el) => {
                cardRefs.current[items._id] = el;
              }}>
              <CardHeader className={'flex flex-col gap-4'}>
                <CardTitle className={'flex justify-between items-center gap-3 text-lg font-inter capitalize w-full'}>
                  {userRole ?
                    <div className="flex flex-row-reverse justify-between items-center w-full">
                      <Badge className={_userStatus(items.approvalStatus)?.colorClass}>
                        {_userStatus(items.approvalStatus).label}
                      </Badge>
                      <p className='capitalize font-medium text-zinc-200'>{items?.musicTemplate}</p>

                    </div>
                    :
                    <React.Fragment>
                      <div className='flex flex-row justify-start items-center gap-3'>
                        <Sliders color={'#ff7e6e'} size={15} />
                        {items.role}
                        <Badge className={_userStatus(items.approvalStatus).colorClass}>
                          {_userStatus(items.approvalStatus).label}
                        </Badge>
                      </div>
                      <p className='capitalize font-medium text-zinc-200'>{items?.musicTemplate}</p>
                    </React.Fragment>
                  }
                </CardTitle>
                <CardDescription className={'flex flex-col gap-2'}>
                  <p className="capitalize font-inter flex flex-row gap-2 justify-start items-center"> # <span className="italic"> {items?.crafterId}</span></p>
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
                      {frameLoading &&
                        <div className="flex justify-center items-center h-6">
                          <Loader2 className="animate-spin h-4 w-4" />
                        </div>
                      }
                      <iframe
                        key={index}
                        src={`https://docs.google.com/viewer?url=${items.cv}&embedded=true`}
                        width="100%"
                        height="600px"
                        onLoad={handleIframeLoad}
                        title="CV Preview"
                        onError={(e) => console.error(e)}
                        style={frameLoading ? { display: 'none' } : { display: 'block' }} // Hide iframe while loading
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

              {userStatus === 'pending' &&
                <CardFooter className={'flex flex-row-reverse justify-end items-center w-full gap-3'}>
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
                  <Button
                    onClick={() => { onHide(items) }}
                    // onClick={() => onDiscard(items)}
                    disabled={discardLoading === items._id}
                    className="bg-zinc-700 text-white hover:bg-zinc-800 cursor-pointer active:green-300">
                    {discardLoading === items._id ?
                      <React.Fragment>
                        <Loader2 className="animate-spin" />
                        Rejecting
                      </React.Fragment>
                      :
                      <React.Fragment>
                        <X /> Reject</React.Fragment>}
                  </Button>
                </CardFooter>
              }
              {/* approved users */}
              {userStatus === 'approved' &&
                <div className="flex flex-row justify-start items-center w-full gap-3 ml-4"
                >
                  <div onClick={(e) => setUpdateUserProfile(items)}>
                    <UpdateUser
                      user={updateUserProfile}
                    />
                  </div>
                  <AlertDialogTrigger asChild>
                    <Button
                      onClick={() => {
                        onHide(items)
                        setOpen(false)
                      }}
                      disabled={discardLoading === items._id}
                      className="bg-zinc-700 text-white hover:bg-zinc-800 cursor-pointer active:green-300">
                      {discardLoading === items._id ?
                        <React.Fragment>
                          <Loader2 className="animate-spin" />
                          Rejecting
                        </React.Fragment>
                        :
                        <React.Fragment>
                          <X /> Reject approve</React.Fragment>}
                    </Button>
                  </AlertDialogTrigger>
                </div>}

              {userStatus === 'rejected' &&
                <CardFooter className={'flex flex-row-reverse justify-end items-center w-full gap-3'}>
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
                      onClick={() =>
                        setOpen(true)}
                      className="bg-zinc-700 text-white hover:bg-zinc-800 cursor-pointer active:green-300">
                      <React.Fragment>
                        <X /> Discard</React.Fragment>
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent open={isOpen}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the account
                        and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={discardLoading === items._id}
                        onClick={() => {
                          onDiscard(items)
                        }}>
                        {discardLoading === items._id ?
                          <React.Fragment>
                            <Loader2 className="animate-spin" />
                            Discarding
                          </React.Fragment>
                          :
                          'Continue'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </CardFooter>
              }

            </Card >
          </AlertDialog>
        )
      }
    </div >
  )
}
