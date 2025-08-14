"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import FeatureCards from "@/components/data/landingPage";
import HowItWorksCards from "@/components/data/howItworks"; 
import { SignInButton } from "@clerk/nextjs";
import { useState } from "react";


function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <section className="hero bg-gradient-to-br from-blue-50 via-white to-gray-50 py-32 pt-28">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-5xl md:text-8xl font-bold mb-6 text-gray-900 leading-tight">
            Manage your <span className="text-blue-600">Expenses</span>
          </h1>
          <p className="text-xl md:text-4xl mb-8 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your wallet's very own smart assistant
          </p>
            <div className="flex justify-center mb-8">
              <SignInButton forceRedirectUrl='/dashboard'>
                <Button  variant="outline" className="mr-4" >
                    Get Started
                </Button>   
              </SignInButton>
                <Button onClick={() => setIsOpen(true)}>
                    Watch Demo
                </Button>
            </div>

             {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50"
          onClick={() => setIsOpen(false)} // click outside closes
        >
          <div
            className="bg-white rounded-lg overflow-hidden shadow-lg max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()} // stop outside click
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-1 right-1 text-white text-2xl font-bold hover:text-red-500"
            >
              X
            </button>
            <video src="/videos/MoneyPalDemo.mp4" controls autoPlay className="w-full" />
          </div>
          <p className="text-white">Click anywhere to exit</p>
        </div>
      )}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl blur-2xl opacity-20"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 p-6">
            
              <Image
                src="/moneypal_main.png"                
                alt="Hero Image"
                width={1000}
                height={500}
                priority
                className="mx-auto rounded-xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`  
        .hero {
          background-size: cover;
          background-position: center;
        }
      `}</style>
      <FeatureCards />
      <HowItWorksCards />
    </>

  )
}

export default HeroSection