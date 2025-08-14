import React, { useEffect, useRef } from 'react';
import { CreditCard, BarChart3, PieChart } from 'lucide-react';
import styled from 'styled-components';

const howItWorksData = [
  {
    icon: <CreditCard size={32} color="#1e3a8a" />,
    title: "1. Create Your Account",
    description: "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 size={32} color="#1e3a8a" />,
    title: "2. Track Your Spending",
    description: "Automatically categorize and track your transactions in real-time",
  },
  {
    icon: <PieChart size={32} color="#1e3a8a" />,
    title: "3. Get Insights",
    description: "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

export default function HowItWorksCards() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <TimelineWrapper>
      <h2>How It Works?</h2>
      <div className="timeline">
        {howItWorksData.map((step, index) => (
          <div
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
          >
            <div className="content">
              <div className="icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            <div className="circle">{index + 1}</div>
          </div>
        ))}
      </div>
    </TimelineWrapper>
  );
}

const TimelineWrapper = styled.div`
  padding: 4rem 1rem;
  text-align: center;
  background: linear-gradient(to bottom, #fff 0%, #dbeafe 100%);
  color: #1e293b;

  h2 {
    font-size: 30px;
    margin-bottom: 3rem;
    color: #0f172a;
    font-weight: 700;
  color: black;
  animation: floatColor 3s ease-in-out infinite;

  
@keyframes floatColor {
  0%, 100% {
    color: black;
    
  }
  25% {
    color: #dbeafe; 
  }
    50%
    {
    color: #3b82f6; 
    }
    75% {   
    color: #1e3a8a; 
}
}

  }

  .timeline {
    position: relative;
    margin: 0 auto;
    max-width: 1000px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 4px;
      background: #3b82f6;
      transform: translateX(-50%);
    }
  }

  .timeline-item {
    position: relative;
    width: 50%;
    padding: 1rem 2rem;
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.6s ease-out;

    &.fade-in {
      opacity: 1;
      transform: translateY(0);
    }

    .content {
      background: radial-gradient(
          at 88% 40%, oklch(80.9% 0.105 251.813) 0px, transparent 70%
        ),
        radial-gradient(at 49% 30%, oklch(80.9% 0.105 251.813)  0px, transparent 85%),
        radial-gradient(at 100% 99%, oklch(80.9% 0.105 251.813)  0px, transparent 85%);
      color: #0f172a;
      padding: 1.5rem;
      border-radius: 1rem;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
      text-align: left;

      h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0.5rem 0;
      }

      p {
        font-size: 1rem;
        color: #334155;
      }

      .icon {
        margin-bottom: 1rem;
      }
    }

    .circle {
      position: absolute;
      top: 1.5rem;
      width: 42px;
      height: 42px;
      background: #1d4ed8;
      border-radius: 50%;
      color: #fff;
      font-weight: bold;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      transition: all 0.6s ease-out;

    &.fade-in {
      opacity: 1;
      transform: translateY(0);
    }

    }
  }

  .timeline-item.left {
    left: 0;
    text-align: right;

    .content {
      margin-right: auto;
    }

    .circle {
      right: -21px;
    }
  }

  .timeline-item.right {
    left: 50%;
    text-align: left;

    .content {
      margin-left: auto;
    }

    .circle {
      left: -21px;
    }
  }

  @media (max-width: 768px) {
    .timeline-item,
    .timeline-item.left,
    .timeline-item.right {
      width: 100%;
      left: 0 !important;
      text-align: center;

      .content {
        margin: 0 auto;
      }

      .circle {
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .timeline::before {
      left: 20px;
    }
  }
`;
