"use client"

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from "next/image";
import { Pagination, Navigation } from 'swiper/modules';
const heroImages = [
  { imgUrl: '/assets/images/hero-1.svg', alt: 'smartwatch'},
  { imgUrl: '/assets/images/hero-2.svg', alt: 'bag'},
  { imgUrl: '/assets/images/hero-3.svg', alt: 'lamp'},
  { imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer'},
  { imgUrl: '/assets/images/hero-5.svg', alt: 'chair'},
]

const HeroCarousel = () => {
  return (
    <div className="hero-carousel">
    <Swiper
    slidesPerView={1}
    spaceBetween={30}
    loop={true}
    pagination={{
        clickable: true,
    }}
    navigation={true}
    modules={[Pagination, Navigation]}
    className="mySwiper"
    >
    {heroImages.map((image) => (
    <SwiperSlide>
    <Image 
            src={image.imgUrl}
            alt={image.alt}
            width={484}
            height={484}
            className="object-contain"
            key={image.alt}
        />
    </SwiperSlide>
        ))}
</Swiper>


    </div>
  )
}

export default HeroCarousel