"use client";

import { useEffect, useRef, useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { MoveLeft, MoveRight } from 'lucide-react';
import { Button } from './ui/button';
import { Testimonals } from '@/lib/Constant';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import useSidebarWidth from '@/store/sidebarWidth';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Rating from './Rating';
import Image from 'next/image';
import TaskCard from '@/app/(Dashboard)/components/TaskCard';

function ReviewCard({ item }) {
  return (
    <Card className="w-full h-64 max-w-lg mx-auto border border-[#6A7777] p-4">
      <CardHeader className="flex items-start gap-4">
        <Image
          src={item?.picture}
          width={40}
          height={40}
          alt={item?.name}
          className="rounded-full object-cover"
        />
        <div>
          <CardTitle className="text-lg font-semibold">{item?.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Rating value={item?.stars} />
        {item?.des}
      </CardContent>
    </Card>
  );
}

export default function Carousel({
  Component,
  data = false,
  steps = true
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const { width } = useSidebarWidth();

  const isMobile = useIsMobile();
  const isTablet = useMediaQuery({ query: '(min-width: 769px) and (max-width: 1024px)' });

  useEffect(() => {
    if (swiperInstance?.params?.navigation) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();

      swiperInstance.on('slideChange', () => {
        setActiveIndex(swiperInstance.activeIndex);
        setIsEnd(swiperInstance.isEnd);
      });
    }
  }, [swiperInstance]);

  function SlideView() {
    if (!data) {
      if (isMobile) return 1;
      if (isTablet) return 2;
      return width ? 3 : 2;
    } else {
      if (isMobile) return 1;
      if (isTablet) return 2;
      return width ? 3 : 2;
    }
  }

  return (
    <>
      {/* Navigation Buttons */}
      <div className={`w-full flex justify-end
      ${data ? 'absolute top-0' : 'mb-4'}
         items-center gap-2  max-sm:mr-5 overflow-x-hidden`}>
        <Button ref={prevRef} variant="ghost"
          className={'cursor-pointer'}
          size="icon" disabled={activeIndex === 0}>
          <MoveLeft className={`${activeIndex === 0 ? 'text-[#FCC6C0]' : 'text-[#FF6467]'}`} />
        </Button>
        <Button ref={nextRef}
          variant="ghost"
          className={'cursor-pointer'}
          size="icon" disabled={isEnd}>
          <MoveRight className={`${isEnd ? 'text-[#FCC6C0]' : 'text-[#FF7E6E]'}`} />
        </Button>
      </div>

      {/* Swiper Carousel */}
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true, el: '.custom-pagination' }}
        onSwiper={setSwiperInstance}
        spaceBetween={30}
        slidesPerView={SlideView()}
        className={`w-full mx-auto ${width ? 'max-w-[86rem]' : 'max-w-[66rem]'
          }  transition-all duration-300 ease-in-out`}
      >

        {!data ? (
          Testimonals.map((item, index) => (
            <SwiperSlide key={index}>
              <ReviewCard item={item} />
            </SwiperSlide>
          ))
        ) : (
          <>
            {data?.map((item, index) =>
              <SwiperSlide key={index}>
                <TaskCard index={index}
                  title={item.musicTemplate}
                  des={item.jokes}
                  plan={item.plan}
                  songGenre={item.songGenre}
                  bgStory={item.backgroundStory}
                  currentStage={item.currentStage} />
              </SwiperSlide>
            )}
          </>
        )}
      </Swiper>

      {steps && <div className="custom-pagination flex justify-center gap-2 mt-6 mb-9 text-red-600" />}
    </>
  );
}