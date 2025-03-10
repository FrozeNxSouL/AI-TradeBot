import BannerSwiper from "@/components/swiper";
import Image from "next/image";
import Dashboard from "./dashboard/page";

export default function Home() {
  const banners = [
    // {
    //   imageUrl: "https://gratisography.com/wp-content/uploads/2025/01/gratisography-dog-vacation-800x525.jpg",
    //   alt: 'Banner 1',
    //   title: 'Welcome to our website'
    // },
    // {
    //   imageUrl: "https://preview.redd.it/hooker-valley-track-new-zealand-kodak-aerochrome-1443-c41-v0-xdu3xchht48c1.jpeg?auto=webp&s=b215a8f5782bd6b7f18c22c757eec03aa0f708ce",
    //   alt: 'Banner 2',
    //   title: 'Discover our products'
    // },
    {
      imageUrl: '/banner3.jpg',
      alt: 'Banner 3',
      title: 'Image1'
    },
    {
      imageUrl: '/banner4.jpg',
      alt: 'Banner 4',
      title: 'Image2'
    }
  ];
  return (
    <>
      {/* <div className=" grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start"> */}
      {/* <p className="text-5xl text-foreground">Nothing in this page</p> */}
      <BannerSwiper banners={banners} />
      <div className="flex flex-col w-full justify-center px-40">
        <Dashboard />
      </div>
      {/* </main>
      </div> */}
    </>
  );
}
