"use client";
import useCrafterTask from '@/store/crafterTask';
import useNotificationStore from '@/store/notification';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CustomFileInput from './CustomFileInput';
import TaskCard from './TaskCard';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { GetServerLoading } from '@/utils/GetServerLoading';
import { toast } from 'sonner';
import { submissionStatusEnum } from '@/lib/Constant';

const acceptedTypes = [
  "application/pdf",
  "audio/mpeg",
  "audio/wav",
  "application/msword",
];

const taskSubmission = z.object({
  file: z.instanceof(File).optional(),
  comments: z.string().optional(),
})
export default function Tasks() {
  const taskForm = useForm({
    defaultValues: {
      comments: "",
      file: "",
    },
    resolver: zodResolver(taskSubmission)
  })
  const { data: session, status } = useSession()
  const { crafterTask } = useCrafterTask()
  const { setTabValue } = useNotificationStore()
  const isTaskEmpty = !crafterTask.title && !crafterTask.des && !crafterTask.requirements && !crafterTask.clientName && !crafterTask.dueData;
  const tabHandler = () => {
    setTabValue('Dashboard')
  }
  console.log(crafterTask.orderId)
  const handleSubmit = async (data) => {
    const formData = new FormData();

    if (data.file) {
      formData.append("submissionFile", data.file);
    }
    formData.append("comment", data.comments);
    formData.append("role", session.user.role);
    formData.append("orderId", crafterTask.orderId);
    formData.append("crafterId", session.user.id);
    console.log('submissionStatusEnum', submissionStatusEnum[3]);
    try {
      const res = await axios.post('/api/taskSubmission', formData)
      if (res.status === 200) {
        console.log(res.data)
        taskForm.reset();
        taskForm.setValue('file', '');

        toast.success(res.data.message)
      }
    } catch (error) {
      console.error(error.response.data.error);
      toast.error(error.response.data.error)
    }
  }

  console.log(taskForm.formState.isSubmitSuccessful)

  if (status === 'loading') {
    return (
      <GetServerLoading session={session} />
    )
  }

  return (
    <>
      {
        // isTaskEmpty ? <div className='flex flex-col gap-4 justify-center items-center text-zinc-400 h-[50vh]'>
        //   <Button className={'text-white cursor-pointer'}
        //     onClick={tabHandler}> <ArrowUpLeft /> Go to Dashboard to pick one of them</Button>
        // </div> :
        <div className='flex flex-col gap-12'>
          <TaskCard title={crafterTask.title}
            des={crafterTask.des}
            dueDate={crafterTask.dueData}
            timeAgo={'03 hr'}
            requirements={crafterTask.requirements}
            client={crafterTask.clientName} />

          <form onSubmit={taskForm.handleSubmit(handleSubmit)}>
            <div className='bg-[#111111] flex flex-col gap-8 p-4 rounded-lg'>
              <h1 className="text-2xl font-bold font-inter">Your Subission</h1>
              <div className='space-y-3'>
                <p className='text-zinc-400'>Upload your work</p>
                <CustomFileInput
                  signupForm={taskForm}
                  acceptedTypes={acceptedTypes}
                  onReset={taskForm.formState.isSubmitSuccessful}
                  className={`h-[40vh] border-2 border-dashed
                   bg-zinc-900 border-neutral-600
                    rounded-lg`} />
                {taskForm.formState.errors.file && (
                  <p className="input-error">{taskForm.formState.errors.file.message}</p>
                )}
              </div>

              <div className="grid w-full gap-1.5 space-y-1">
                <Label htmlFor="comment"
                  className={'text-zinc-300 font-inter'}>Comments (Optional)</Label>
                <Textarea
                  {...taskForm.register('comments')}
                  className={'h-[20vh]'}
                  placeholder="Add any notes or
               comments about your submission..."
                  id="comment" />
                {taskForm.formState.errors.comments && <p className="input-error">{taskForm.formState.errors.comments.message}</p>}
              </div>
              <Button type={'submit'}
                disabled={taskForm.formState.isSubmitting}
                className={'bg-primary text-white w-fit cursor-pointer'}>
                {taskForm.formState.isSubmitting ? (
                  <>
                    <p>Submiting Work</p> <LoaderCircle className="animate-spin" />
                  </>
                ) : "Submit Work"}
              </Button>
            </div>
          </form>
        </div>}

    </>
  )
}
