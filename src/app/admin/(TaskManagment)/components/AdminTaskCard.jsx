"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { handleDownloadWithRef } from "@/lib/handleDownloadWithName";
import { _crafterStatus, formatCentsToDollars, formatDateTime } from "@/lib/utils";
import useAllUsers from "@/store/allUsers";
import axios from "axios";
import { Files, Loader2, TriangleAlert } from "lucide-react";
import { forwardRef, useRef, useState } from "react";
import { toast } from "sonner";

const AdminTaskCard = forwardRef(
  (
    {
      crafterUsername = "bilal",
      time = "12hr dummy",
      crafterEmail = "b",
      file = [],
      role,
      orderName,
      planName,
      planPrice,
      item,
      crafterId,
      jokes,
      ordererName,
      ordererEmail,
      songGenre,
      backgroundStory,
      penaltyCount,
      crafterComments,
      userStatus = 'pending',
      tab = 'allCrafters'
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const downloadRefs = useRef([]);
    const { setIsUpdate } = useAllUsers();

    const onApprove = async (item) => {
      let nextRole = "";
      if (item.submittedCrafter.role === "lyricist") {
        nextRole = "singer";
      } else if (item.submittedCrafter.role === "singer") {
        nextRole = "engineer";
      } else if (item.submittedCrafter.role === "engineer") {
        nextRole = "engineer";
      }

      try {
        setIsLoading(true);
        const res = await axios.patch("/api/admin/crafter-approve", {
          orderId: item._id,
          role: nextRole,
          prevRole: item.submittedCrafter.role,
        });
        if (res.status === 200) {
          setIsUpdate(true);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.error(error.response?.data?.error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDownload = async (fileUrl, fileName, index) => {
      setLoadingStates((prev) => ({ ...prev, [index]: true }));

      try {
        const linkRef = { current: downloadRefs.current[index] };
        await handleDownloadWithRef(fileUrl, fileName, linkRef);
      } finally {
        setLoadingStates((prev) => ({ ...prev, [index]: false }));
      }
    };

    return (
      <Card className="w-full" ref={ref}>
        <CardHeader className="w-full">
          <CardTitle className="grid grid-cols-2 gap-12 justify-between items-center w-full">
            {/* Order Template */}
            <div className="flex flex-col gap-2">
              <h2 className="capitalize italic font-light text-zinc-400">
                # {crafterId}
              </h2>
              <h2 className="capitalize text-3xl max-sm:text-xl max-xs:text-sm">
                {orderName}
              </h2>
              <h2 className="capitalize text-lg font-inter italic text-neutral-400 max-sm:text-xl max-xs:text-sm">
                {songGenre}
              </h2>
              <Accordion type="single" collapsible
                className="max-xs:w-full max-sm:w-full w-2xl"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className={'font-medium font-inter text-sm cursor-pointer'}>Order Detail</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4 font-inter">
                      <div className="flex flex-col">
                        <h2 className="capitalize text-zinc-200 font-medium
                      text-xl max-sm:text-lg max-xs:text-sm max-xs:font-bold">
                          {ordererName}
                        </h2>
                        <a href={`mailto:${ordererEmail}`}
                          className="hover:underline text-zinc-400 font-normal">
                          {ordererEmail}
                        </a>
                      </div>
                      <div className="flex flex-col text-zinc-300">
                        <p className="font-semibold">Special Memories or Inside Jokes:</p>
                        <p className="italic text-zinc-400 ml-4 font-normal max-h-22 overflow-y-auto custom-scrollbar">
                          {jokes}
                        </p>
                      </div>
                      <div className="flex flex-col text-zinc-300">
                        <p className="font-semibold">Background Story:</p>
                        <p className="italic text-zinc-400 ml-4 font-normal max-h-22 overflow-y-auto custom-scrollbar">
                          {backgroundStory}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="flex flex-col justify-end items-end gap-3">
              <Badge className={`capitalize font-semibold text-sm max-xs:text-xs ${_crafterStatus(userStatus)?.colorClass}`}>
                {_crafterStatus(userStatus)?.label}
              </Badge>
              <Badge className="capitalize font-semibold text-sm max-xs:text-xs text-primary bg-primary/20">
                {role}
              </Badge>
              <div className="flex flex-col justify-end items-end gap-3">
                <p className="text-primary font-semibold max-sm:text-sm">
                  {planName}
                </p>
                <p className="max-xs:text-sm">
                  ${formatCentsToDollars(planPrice)}
                </p>
              </div>
            </div>
          </CardTitle>
          <Separator className="my-4" />
          <CardDescription className="grid grid-cols-2 justify-between items-center">
            {/* order details */}
            <Accordion type="single" collapsible
              className="max-xs:w-full max-sm:w-full w-2xl"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className={'font-medium font-inter text-sm cursor-pointer'}>Crafter Detail</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1">
                    <h2 className="capitalize text-zinc-200 font-medium text-xl max-sm:text-lg max-xs:text-sm max-xs:font-bold">
                      {crafterUsername}
                    </h2>
                    <a href={`mailto:${crafterEmail}`} className="hover:underline">
                      {crafterEmail}
                    </a>
                  </div>                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="max-xs:text-xs cursor-pointer">
                  View Submission Links
                </AccordionTrigger>
                <AccordionContent>
                  <div className="w-full">
                    <div className="flex flex-col gap-2 justify-start items-start w-full">
                      {file.map((items, index) => (
                        <div
                          key={index}
                          className="flex flex-row gap-4 justify-center items-center bg-zinc-600/20 p-3 rounded-lg w-full"
                        >
                          <div className="flex flex-row gap-4 justify-start items-center w-full">
                            <Files
                              size={30}
                              className="text-red-400 bg-primary/20 p-1 rounded-md"
                            />
                            <p className="text-zinc-400 flex-shrink-0 whitespace-nowrap truncate max-w-3xl">
                              {items.fileName}
                            </p>
                          </div>
                          <Button
                            variant="link"
                            className="cursor-pointer"
                            disabled={loadingStates[index]}
                            onClick={() =>
                              handleDownload(items.fileUrl, items.fileName, index)
                            }
                          >
                            {loadingStates[index] ? (
                              <>
                                <Loader2 className="animate-spin w-full" />
                                Downloading
                              </>
                            ) : (
                              "Download File"
                            )}
                          </Button>
                          {/* Hidden anchor element for each file */}
                          <a
                            ref={(el) => (downloadRefs.current[index] = el)}
                            style={{ display: "none" }}
                            aria-hidden="true"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {/* date */}
            <div className="flex flex-col justify-end items-end gap-2">

              {penaltyCount > 0 && <Tooltip>
                <TooltipTrigger>
                  <div className="flex flex-row gap-2 justify-end items-end">
                    <TriangleAlert size={18}
                      className="text-primary" /> 0{penaltyCount}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>No of Plenties</p>
                </TooltipContent>
              </Tooltip>}
              <div className="flex flex-col justify-end items-end">
                <p>{formatDateTime(time).date}</p>
                <p>{formatDateTime(time).time}</p>
              </div>
            </div>
            {/* penaltyCount */}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-row-reverse max-sm:flex-col-reverse justify-between items-center gap-3">
          {!tab === 'allCrafters' && <Button
            className="max-sm:w-full cursor-pointer"
            onClick={() => onApprove(item)}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Loading
              </>
            ) : (
              "Approve"
            )}
          </Button>}

          {crafterComments && <Accordion type="single" collapsible>
            <AccordionItem value="item-4">
              <AccordionTrigger>Crafter Comments</AccordionTrigger>
              <AccordionContent>
                {crafterComments}
              </AccordionContent>
            </AccordionItem>
          </Accordion>}
        </CardContent>
        <CardFooter />
      </Card>
    );
  }
);

export default AdminTaskCard;
