"use client";

import LoginForm from '@/components/loginForm';
import SignUpForm from '@/components/signUpForm';
import { ChartAreaspline, ChartTimelineVariant, Robot2Fill } from '@/utils/icon';
import { Card, CardBody } from '@heroui/card';
import { Modal, ModalContent, useDisclosure } from '@heroui/modal';
import { Tab, Tabs } from '@heroui/tabs';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { status } = useSession();
  const router = useRouter()
  const { scrollYProgress } = useScroll();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // Parallax and opacity transformations
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  const features = [
    {
      title: "Real-Time Market Analysis",
      description: "Cutting-edge algorithms providing instant market insights and trends.",
      icon: <ChartTimelineVariant className='text-background' />
    },
    {
      title: "Advanced Trading Tools",
      description: "Comprehensive suite of trading indicators and predictive models.",
      icon: <ChartAreaspline className='text-background' />
    },
    {
      title: "AI-Powered",
      description: "AI Intelligent for risk assessment and portfolio optimization strategies.",
      icon: <Robot2Fill className='text-background' />
    }
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden overflow-y-clip">
      {/* Hero Section with Video Background */}
      <motion.div
        className=" relative h-[calc(100vh-4rem)] w-full overflow-hidden scrollbar-hide"
        style={{ opacity: opacity1, scale }}
      >
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover opacity-50"
        >
          <source src="/stock_market.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-2xl px-4">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-6 text-white"
            >
              Unleash Your Trading Potential
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl mb-8 text-primary"
            >
              Powerful analytics, real-time insights, and advanced trading strategies at your fingertips.
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(status != "authenticated") ? onOpen : ()=>router.push("/dashboard")}
              className="bg-primary opacity-95 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary transition"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="px-6 py-16 bg-gradient-to-b from-black to-gray-900"
        style={{ opacity: opacity2 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800/50 backdrop-blur-lg border border-white/10"
            >
              <CardBody>
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-primary">
                  {feature.title}
                </h3>
                <p className="text-white/80">
                  {feature.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Additional Information Section */}
      <motion.div
        className="px-6 py-16 bg-black"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-pribg-primary">
              Transform Your Trading Experience
            </h2>
            <p className="text-lg text-white/80 mb-6">
              Our platform combines cutting-edge technology with intuitive design,
              empowering traders of all levels to make informed decisions and
              maximize their potential in the financial markets.
            </p>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-center">
                <span className="mr-3 text-primary">✓</span>
                Advanced AI-Powered Insights
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-primary">✓</span>
                Comprehensive Market Analysis
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-primary">✓</span>
                Personalized Trading Strategies
              </li>
            </ul>
          </div>
          {/* <div className="relative">
            <Image 
              src="/trading-dashboard.png" 
              alt="Trading Dashboard" 
              width={600} 
              height={400} 
              className="rounded-xl shadow-2xl"
            />
          </div> */}
        </div>
      </motion.div>

      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <Tabs
                aria-label="Dynamic tabs"
                fullWidth
                size="lg"
                variant="light"
              >
                <Tab key={0} title={"Login"} className="text-lg font-bold">
                  <LoginForm onClose={onClose} />
                </Tab>

                <Tab key={1} title={"Register"} className="text-lg font-bold">
                  <SignUpForm onClose={onClose} />
                </Tab>
              </Tabs>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
