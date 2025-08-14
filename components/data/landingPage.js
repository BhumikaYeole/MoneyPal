// FeatureCards.tsx or .jsx
import React, { useState, useEffect } from 'react';
import { BarChart3, Receipt, PieChart, CreditCard, Globe, Zap } from 'lucide-react';

const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Advanced Analytics",
    description: "Get detailed insights into your spending patterns with AI-powered analytics",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Receipt Scanner",
    description: "Extract data automatically from receipts using advanced AI technology",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Budget Planning",
    description: "Create and manage budgets with intelligent recommendations",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Account Support",
    description: "Manage multiple accounts and credit cards in one place",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Multi-Currency",
    description: "Support for multiple currencies with real-time conversion",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Insights",
    description: "Get automated financial insights and recommendations",
  },
];

const FeatureCard = ({ icon, title, description, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`
        group relative bg-white border border-blue-100 rounded-xl p-6 shadow-sm transition-all duration-500
        hover:shadow-2xl hover:border-blue-300 transform-gpu hover:-translate-y-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        animate-fade-in
      `}
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: 'forwards',
      }}
    >
      <div
        className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 mx-auto
                   transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
      >
        <div className="transition-transform duration-300 group-hover:animate-bounce-slow">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 text-center text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default function FeatureCards() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen py-12 px-4">
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.2); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .floating-title {
          animation: float 4s ease-in-out infinite;
        }

        .animate-fade-in {
          opacity: 0;
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .group-hover\\:animate-bounce-slow:hover .group-hover\\:animate-bounce-slow {
          animation: bounceSlow 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 floating-title">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{
            opacity: 0,
            animation: 'fadeInUp 1s ease-out 0.5s both'
          }}>
            Discover the comprehensive tools that make financial management effortless and intelligent
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
 