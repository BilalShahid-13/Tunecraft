"use client";

import { useEffect, useRef, useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { MoveLeft, MoveRight } from 'lucide-react';
import { Button } from './ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Testimonals } from '@/lib/Constant';
import Image from 'next/image';
import Rating from './Rating';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function Carousel() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  // hook
  const isMobile = useIsMobile()
  const isTablet = useMediaQuery({ query: '(min-width: 769px) and (max-width: 1024px)' }); // Define tablet view
  console.log('ismobile', isMobile)

  useEffect(() => {
    if (
      swiperInstance &&
      swiperInstance.params &&
      swiperInstance.params.navigation
    ) {
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
    if (isMobile)
      return 1
    else if (isTablet)
      return 2
    else
      return 3
  }
  return (
    <>
      {/* Navigation Buttons */}
      <div className='w-full flex justify-end items-center gap-2 mb-4 max-sm:mr-5'>
        <Button
          ref={prevRef}
          variant="ghost"
          size="icon"
          disabled={activeIndex === 0}
        >
          <MoveLeft className={`${activeIndex === 0 ? 'text-[#FCC6C0]' : 'text-[#FF6467]'}`} />
        </Button>

        <Button
          ref={nextRef}
          variant="ghost"
          size="icon"
          disabled={isEnd}
        >
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
        className="w-[98%]"
      >
        {Testimonals.map((item, index) => (
          <SwiperSlide key={index} className=''>
            <Card className="w-full h-64 max-w-lg mx-auto border border-[#6A7777] p-4 ">
              <CardHeader className="flex items-start gap-4">
                <Image
                  src={item.picture}
                  width={40}
                  height={40}
                  alt={item.name}
                  className="rounded-full object-cover"
                />
                <div>
                  <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Rating value={item.stars} />
                {item.des}
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper >

      <div className="custom-pagination flex justify-center gap-2
       mt-6 mb-9  text-red-600" />

    </>
  );
}
