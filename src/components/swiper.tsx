// components/BannerSwiper.jsx
'use client'; // Add this if using Next.js 13+ with app directory

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';

export default function BannerSwiper({ banners }: any) {
    // For client-side rendering to avoid hydration mismatch
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <>
            <div className="absolute top-0 left-0 w-full h-screen z-50 bg-black">
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    // className=""
                >
                    {banners.map((banner: any, index: number) => (
                        <SwiperSlide key={index}>
                            <div className="relative size-full">
                                <img
                                    src={banner.imageUrl}
                                    alt={banner.alt || `Banner ${index + 1}`}
                                    className="size-full object-cover"
                                />
                                {banner.title && <h2 className="absolute bottom-5 left-5 text-foreground shadow-lg">{banner.title}</h2>}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='w-full h-screen' />
        </>
    );
}