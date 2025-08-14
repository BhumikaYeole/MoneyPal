import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Footer from "@/components/Footer"

const montserrat = Montserrat({subsets : ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']})

export const metadata = {
  title: "MoneyPal",
  description: "Your day-to-day expense app",
  icons: {
    icon: '/final-final-logo.png', 
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body
        className={`${montserrat.className} antialiased bg-[#F8F8FF]`}
      >
      <Header/>
       <main className="min-h-screen">{children}</main> 
       <Toaster richColors/>
       <footer className="bg-red-50 h-20">
         <Footer/>
       </footer>
      </body>
    </html>
    </ClerkProvider>
    
  );
}
