import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

import { Check, Mail, Phone, Sliders, X } from 'lucide-react'
import { generateStrongPassword } from "@/utils/generateStrongPassword"

export default function UserCard(
  { allUsers, role = 'engineer',
    phone = '(+54)1111111111',
    username = 'bilal shahid',
    musicTemplate = 'friendship song',
    email = 'bilalwew@gmail.co',
    url = 'https://res.cloudinary.com/dbsxojyxy/raw/upload/v1746623381/Tunecraft/cv/ekqhg6uzdabvxlw07lep'
  }) {

  async function onApprove() {
    const password = generateStrongPassword()
    console.log('usercard', password)
  }

  const formatPhone = (phone) => {
    return phone.replace(/^(\(\+\d+\))/, ""); // Remove the country code in the format (+xx)
  };

  console.log(allUsers)

  return (
    <div className="flex flex-col gap-3">
      {allUsers.map((items, index) =>
        <AlertDialog key={index}>
          <Card key={index}>
            <CardHeader className={'flex flex-col gap-4'}>
              <CardTitle className={'flex justify-between items-center gap-3 text-lg font-inter capitalize w-full'}>
                <div className='flex flex-row justify-start items-center gap-3'>
                  <Sliders color={'#ff7e6e'} size={15} />
                  {items.role}
                </div>
                <p className='capitalize font-medium text-zinc-200'>{items.musicTemplate}</p>
              </CardTitle>
              <CardDescription className={'flex flex-col gap-2'}>
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
                      className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Download CV
                    </a>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>

            <CardFooter className={'flex flex-row-reverse justify-end items-center w-full gap-3'}>
              <Button className="bg-[#ff7e6e] hover:bg-red-400 cursor-pointer active:bg-red-400"
                onClick={onApprove}>
                <Check /> Approve
              </Button>
              <AlertDialogTrigger asChild>
                <Button className="bg-zinc-600 text-white hover:bg-zinc-700 cursor-pointer active:green-300">
                  <X /> Discard
                </Button>
              </AlertDialogTrigger>
            </CardFooter>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the application.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </Card >
        </AlertDialog>)}
    </div>
  )
}
