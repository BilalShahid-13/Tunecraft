"use client"
import CustomFileInput from "@/components/CustomFileInput"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import useCrafterTask from "@/store/crafterTask"
import useTabValue from "@/store/tabValue"
import { GetServerLoading } from "@/utils/GetServerLoading"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { ArrowUpLeft, LoaderCircle } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import TaskCard from "./TaskCard"
import AllSubmittedFiles from "@/app/(Role)/(Task)/components/AllSubmittedFiles"

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
  const { setTabValue } = useTabValue();
  const [onFileReset, setOnFileReset] = useState(false);

  const isTaskEmpty =
    !crafterTask.title &&
    !crafterTask.des &&
    !crafterTask.requirements &&
    !crafterTask.clientName &&
    !crafterTask.dueData

  const tabHandler = () => {
    setTabValue({ value: "Dashboard" })
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
    console.log('data.comments', data.comments)
    formData.append("comment", data.comments)
    formData.append("role", session.user.role)
    formData.append("orderId", crafterTask.orderId)
    formData.append("crafterId", session.user.id)
    try {
      const res = await axios.post("/api/taskSubmission", formData)
      if (res.status === 200) {
        setOnFileReset(true);
        taskForm.reset();
        toast.success(res.data.message)
        setTabValue({ value: 'Dashboard' })
      }
    } catch (error) {
      console.error(error.response?.data?.error)
      toast.error(error.response?.data?.error)
    }
  }

  if (status === "loading") {
    return <GetServerLoading session={session} />
  }

  console.log('crafterTask', crafterTask)

  return (
    <>
      {isTaskEmpty ? (
        <div className="flex flex-col gap-4 justify-center items-center text-zinc-400 h-[50vh]">
          <Button className={"text-white cursor-pointer"} onClick={tabHandler}>
            <ArrowUpLeft /> Go to Dashboard to pick one of them
          </Button>
        </div>
      ) : (
        <div className={`flex flex-col gap-12`}>
          <TaskCard
            title={crafterTask.title}
            des={crafterTask.des}
            dueDate={crafterTask.dueData}
            timeAgo={"03 hr"}
            requirements={crafterTask.requirements}
            client={crafterTask.clientName}
          />
          <div className="flex w-full max-xs:max-w-md">
            {crafterTask.submittedFileUrls && <AllSubmittedFiles files={crafterTask.submittedFileUrls} />}
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
                />
                {taskForm.formState.errors.comments && (
                  <p className="input-error">{taskForm.formState.errors.comments.message}</p>
                )}
              </div>
              <Button
                type={"submit"}
                disabled={taskForm.formState.isSubmitting || userStatus === "pending"}
                className={"bg-primary text-white w-fit cursor-pointer max-xs:w-full"}
              >
                {taskForm.formState.isSubmitting ? (
                  <>
                    <p>Submitting Work</p> <LoaderCircle className="animate-spin" />
                  </>
                ) : (userStatus === "pending" ? (
                  // ← when they’re already in “pending” state
                  "Submission Pending Review"
                ) : (
                  // ← normal case
                  "Submit Work"))}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
