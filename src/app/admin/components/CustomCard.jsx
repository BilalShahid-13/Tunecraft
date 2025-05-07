import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

export default function CustomCard({ name, Icon }) {
  return (
    <>
      <Card className={'flex flex-col items-start justify-start w-[250px]'}>
        <CardContent className={'flex gap-2 justify-center items-center'}>
          <Icon color={'#ff7e6e'} size={30} />
          <CardTitle className={'font-light font-inter text-sm'}>{name}</CardTitle>
        </CardContent>
      </Card>

    </>
  )
}
