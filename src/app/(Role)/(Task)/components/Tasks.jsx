"use client"
import AllSubmittedFiles from "@/app/(Role)/(Task)/components/AllSubmittedFiles"
import CustomFileInput from "@/components/CustomFileInput"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { defaultTime } from "@/lib/Constant"
import useCrafterTask from "@/store/crafterTask"
import useTabValue from "@/store/tabValue"
import { GetServerLoading } from "@/utils/GetServerLoading"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ArrowUpLeft, LoaderCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import TaskCard from "./TaskCard"
import useTasks from "@/store/tasks"

const acceptedTypes = ["application/pdf", "audio/mpeg", "audio/wav", "application/msword"]

const taskSubmission = z.object({
  file: z.array(z.instanceof(File)).min(1, "At least one file required"),
  comments: z.string().optional(),
})

export default function Tasks() {
  const taskForm = useForm({
    defaultValues: {
      comments: "",
      file: [], // This matches your schema field name
    },
    resolver: zodResolver(taskSubmission),
  })

  const { data: session, status } = useSession();
  const { crafterTask, userStatus } = useCrafterTask();
  // const { crafterTask } = tasks;
  const { setTabValue } = useTabValue();
  const { setFetchedTasks } = useTasks();
  const [onFileReset, setOnFileReset] = useState(false);
  const [timeUp, setTimeUp] = useState(false)
  const isTaskEmpty =
    !crafterTask ||
    !crafterTask.title ||
    !crafterTask.des ||
    !crafterTask.requirements ||
    !crafterTask.clientName ||
    !crafterTask.dueDate;


  console.log('crafterTask', crafterTask)

  if (isTaskEmpty) {
    const tabHandler = () => {
      setTabValue({ value: "Dashboard" })
    }
    return (
      <div className="flex flex-col gap-4 justify-center items-center text-zinc-400 h-[50vh]">
        <Button className={"text-white cursor-pointer"} onClick={tabHandler}>
          <ArrowUpLeft /> Go to Dashboard to pick one of them
        </Button>
      </div>
    )
  }


  const handleSubmit = async (data) => {
    const formData = new FormData()

    // Handle multiple files properly
    if (data.file && data.file.length > 0) {
      data.file.forEach((file) => {
        formData.append(`submissionFile`, file)
      })
      formData.append("fileCount", data.file.length.toString())
    }
    formData.append("comment", data.comments)
    formData.append("role", session.user.role)
    formData.append("orderId", crafterTask.orderId)
    formData.append("projectName", crafterTask.title)
    formData.append("planId", crafterTask.plan._id)
    formData.append("crafterId", session.user.id)

    try {
      const res = await axios.post("/api/taskSubmission", formData)
      if (res.status === 200) {
        setOnFileReset(true);
        taskForm.reset();
        toast.success(res.data.message);
        setFetchedTasks(true);
        setTabValue({ value: 'Dashboard' })
      }
    } catch (error) {
      console.error(error.response?.data?.error)
      toast.error(error.response?.data?.error)
    }
  }

  if (isTaskEmpty) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center text-zinc-400 h-[50vh]">
        <Button className={"text-white cursor-pointer"} onClick={tabHandler}>
          <ArrowUpLeft /> Go to Dashboard to pick one of them
        </Button>
      </div>
    );
  }
  if (status === "loading") {
    return <GetServerLoading session={session} />
  }
  return (
    <>
      <div className={`flex flex-col gap-12`}>
        <TaskCard
          title={crafterTask.title}
          des={crafterTask.des}
          dueDate={crafterTask.dueDate}
          userStatus={crafterTask.userStatus}
          timeAgo={`${defaultTime} hr`}
          requirements={crafterTask.requirements}
          client={crafterTask.clientName}
        />
        <div
          className="flex w-full max-xs:max-w-md">
          {!crafterTask.adminFeedback && crafterTask?.submittedFileUrls?.length > 0 && <AllSubmittedFiles files={crafterTask.submittedFileUrls} />}
          {crafterTask.adminFeedback && <div
            className='bg-[#111111] flex w-full
          flex-col gap-2 p-4 rounded-lg max-sm:max-w-sm'>
            <h3 className='text-xl font-semibold font-inter'>Admin Feedback</h3>
            <p className='text-zinc-400 max-xs:text-sm max-md:text-sm
               max-h-48 overflow-auto break-words whitespace-normal italic
            capitalize p-2'>
              {crafterTask.adminFeedback}
            </p>
          </div>}
        </div>
        <form onSubmit={taskForm.handleSubmit(handleSubmit)}>
          <div className="bg-[#111111] flex flex-col gap-8 p-4
                rounded-lg max-xs:max-w-full max-sm:max-w-full w-full
                  max-md:gap-5">
            <h1 className="text-2xl font-bold font-inter max-sm:text-xl">Your Submission</h1>
            <div className="
                justify-center items-center flex flex-col
                  ">
              <div className="space-y-3 max-xs:max-w-xs max-xl:w-full w-full">
                <p className="text-zinc-400">Upload your work</p>
                <CustomFileInput
                  signupForm={taskForm}
                  acceptedTypes={acceptedTypes}
                  multiple={true}
                  onReset={onFileReset}
                  fieldName="file"
                  maxFiles={6}
                  disabled={userStatus === "pending"}
                  className={`h-[300px] border-2 border-dashed bg-zinc-900
                         border-neutral-600 text-center rounded-lg
                        ${userStatus === "pending" ? 'hover:cursor-not-allowed' : 'hover:cursor-pointer'}`}
                />
                {taskForm.formState.errors.file && (
                  <p className="input-error">{taskForm.formState.errors.file.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 space-y-1 w-full max-md:mt-4">
              <Label htmlFor="comment"
                className={"text-zinc-300 font-inter "}>
                Comments (Optional)
              </Label>
              <Textarea
                {...taskForm.register("comments")}
                className={"max-h-[20vh] min-h-[15vh] max-sm:h-[10vh] placeholder:max-xs:text-xs placeholder:max-md:text-sm"}
                placeholder="Add any notes or comments about your submission..."
                id="comment"
                disabled={crafterTask.crafterFeedback || crafterTask.userStatus === "pending"}
              />
              {taskForm.formState.errors.comments && (
                <p className="input-error">{taskForm.formState.errors.comments.message}</p>
              )}
            </div>
            <Button
              type={"submit"}
              disabled={taskForm.formState.isSubmitting || crafterTask.userStatus === "pending" || timeUp}
              className={"bg-primary text-white w-fit cursor-pointer max-xs:w-full"}
            >
              {taskForm.formState.isSubmitting ? (
                <>
                  <p>Submitting Work</p> <LoaderCircle className="animate-spin" />
                </>
              ) : (crafterTask.userStatus === "pending" ? (
                "Submission Pending Review"
              ) : (
                // ← normal case
                "Submit Work"))}
            </Button>
          </div>
        </form>
      </div >
    </>
  )
}
