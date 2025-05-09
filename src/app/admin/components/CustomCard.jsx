import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import useSidebarWidth from "@/store/sidebarWidth"

export default function CustomCard({ name, Icon }) {
  const { width } = useSidebarWidth()
  return (
    <>
      <Card className={`flex flex-col items-start
        justify-start w-[250px] max-sm:w-full
         ${width ? 'max-lg:w-[350px] max-xl:w-full' : 'max-lg:w-full'} `}>
        <CardContent className={'flex gap-2 justify-center items-center'}>
          <Icon color={'#ff7e6e'} size={30} />
          <CardTitle className={'font-light font-inter text-sm'}>{name}</CardTitle>
        </CardContent>
      </Card>

    </>
  )
}
