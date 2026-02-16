import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import { motion } from 'framer-motion';
import { Brain, Target, Calendar, Clock, ArrowRight } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();
    const handleGetStarted = () => {
        navigate('/goal-setup');
    };
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50">
      <Navbar />
      <section className="py-8 mx-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Text Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="mb-4 text-3xl font-bold leading-none tracking-tighter md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600">
                Plan with Purpose. Achieve with AI.
              </h1>
              <p className="max-w-2xl text-zinc-600 text-base md:text-lg">
                An intelligent goal planner that creates personalized daily schedules, helping you stay focused, consistent, and one step closer to success every day
              </p>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <button 
                  onClick={handleGetStarted}
                  className="group inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-white hover:bg-zinc-900/90 h-10 rounded-md px-6 w-full md:w-auto cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              
              {/* Feature Icons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Target className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Smart Planning</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Flexible Schedule</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Time Management</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">AI-Powered</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Illustration */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[400px]">
                {/* Main Illustration Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl">
                  {/* Floating Elements */}
                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-1/4 left-1/4 w-12 h-12 bg-primary/10 rounded-full"
                  />
                  <motion.div
                    animate={{
                      y: [0, 20, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-primary/10 rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-1/3 right-1/3 w-16 h-16 bg-primary/10 rounded-full"
                  />
                  
                  {/* Center Brain Icon */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Brain className="h-24 w-24 text-primary" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero