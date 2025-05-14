import GradientText from '@/components/GradientText';
import SubscriptionCard from '@/components/SubscriptionCard';
import { TunesItem } from '@/lib/Constant';


export default function Tunes() {

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <GradientText txt={'our tunes'}
        className={'heading-1 uppercase'}
      // className={'uppercase text-7xl font-medium mb-8 max-sm:text-4xl'}
      />
      <div className="grid grid-cols-2 max-md:grid-cols-1
       gap-12 max-sm:grid-cols-1 max-sm:gap-16
       max-lg:grid-cols-1">
        {TunesItem.map((items, key) => (
          // <CustomButton
          <SubscriptionCard
            key={key}
            gradientColor={items.gradientColor}
            heading={items.heading}
            des={items.des}
            price={items.price}
            list={items.points}
          />
        ))}
      </div>
    </div>

  )
}
