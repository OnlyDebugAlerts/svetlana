'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [clickedChamomiles, setClickedChamomiles] = useState<Set<number>>(new Set());
  const [showProposal, setShowProposal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [floatingChamomiles, setFloatingChamomiles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [backgroundElements, setBackgroundElements] = useState<Array<{ left: number; top: number; delay: number; duration: number }>>([]);
  const [isMounted, setIsMounted] = useState(false);

  const totalChamomiles = 7;

  useEffect(() => {
    setIsMounted(true);
    // Generate background elements only on client
    setBackgroundElements(
      Array.from({ length: 20 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 3 + Math.random() * 2,
      }))
    );
  }, []);

  useEffect(() => {
    if (clickedChamomiles.size === totalChamomiles) {
      setTimeout(() => setShowProposal(true), 500);
      setTimeout(() => setShowMessage(true), 1500);
    }
  }, [clickedChamomiles]);

  const handleChamomileClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clickedChamomiles.has(index) && clickedChamomiles.size < totalChamomiles) {
      setClickedChamomiles(prev => new Set([...prev, index]));
      
      // Create floating chamomile animation
      const rect = e.currentTarget.getBoundingClientRect();
      const newChamomile = {
        id: Date.now(),
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      setFloatingChamomiles(prev => [...prev, newChamomile]);
      
      setTimeout(() => {
        setFloatingChamomiles(prev => prev.filter(c => c.id !== newChamomile.id));
      }, 2000);
    }
  };

  const Chamomile = ({ onClick, clicked }: { onClick: (e: React.MouseEvent) => void; clicked: boolean }) => (
    <button
      onClick={onClick}
      className={`chamomile-button relative transition-all duration-500 ${
        clicked ? 'scale-0 rotate-180 opacity-0' : 'hover:scale-110 cursor-pointer'
      }`}
      disabled={clicked}
    >
      <div className="relative w-16 h-16">
        {/* Petals */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-8 bg-white rounded-full"
            style={{
              transform: `rotate(${i * 30}deg) translateY(-20px)`,
              transformOrigin: 'center bottom',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
        ))}
        {/* Center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-300 rounded-full border-2 border-yellow-400" />
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 overflow-hidden relative">
      {/* Animated background elements */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {backgroundElements.map((element, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
                animationDelay: `${element.delay}s`,
                animationDuration: `${element.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Floating chamomiles */}
      {floatingChamomiles.map(chamomile => (
        <div
          key={chamomile.id}
          className="fixed pointer-events-none z-50 animate-float-up"
          style={{
            left: `${chamomile.x}px`,
            top: `${chamomile.y}px`,
          }}
        >
          <div className="relative w-12 h-12">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-6 bg-white rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-12px)`,
                  transformOrigin: 'center bottom',
                }}
              />
            ))}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-300 rounded-full" />
          </div>
        </div>
      ))}

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4">
            Светлана
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            {clickedChamomiles.size === 0 && "Собери все ромашки, чтобы узнать секрет..."}
            {clickedChamomiles.size > 0 && clickedChamomiles.size < totalChamomiles && 
              `Ромашек собрано: ${clickedChamomiles.size} из ${totalChamomiles} 🌼`}
            {clickedChamomiles.size === totalChamomiles && "🎉 Все ромашки собраны! 🎉"}
          </p>
        </div>

        {/* Photo Section */}
        <div className="relative mb-12 animate-scale-in">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/50 transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/sveta.jpg"
              alt="Светлана"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent" />
          </div>
          
          {/* Decorative hearts */}
          <div className="absolute -top-4 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>💕</div>
          <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>💖</div>
        </div>

        {/* Chamomiles Grid */}
        {!showProposal && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-8 md:gap-12 mb-12 animate-fade-in-up">
            {[...Array(totalChamomiles)].map((_, i) => (
              <Chamomile
                key={i}
                onClick={(e) => handleChamomileClick(i, e)}
                clicked={clickedChamomiles.has(i)}
              />
            ))}
          </div>
        )}

        {/* Proposal Section */}
        {showProposal && (
          <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-pink-200">
              <h2 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text mb-6">
                Светлана, выйдешь за меня замуж? 💍
              </h2>
              
              {showMessage && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                    Я знаю, что ты любишь ромашки 🌼
                  </p>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                    И я собрал их все, чтобы удивить тебя!
                  </p>
                  <p className="text-xl md:text-2xl text-gray-700 font-semibold mt-6">
                    Будешь моей женой? 💕
                  </p>
                  
                  {/* Answer buttons */}
                  <div className="flex gap-4 justify-center mt-8">
                    <button
                      onClick={() => alert('🎉 УРА! Я самый счастливый человек на свете! 💍💕')}
                      className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg hover:scale-110 transform transition-all duration-300 hover:shadow-2xl"
                    >
                      ДА! 💖
                    </button>
                    <button
                      onClick={() => {
                        const messages = [
                          'Попробуй ещё раз! 😊',
                          'Уверена? 🤔',
                          'Ромашки расстроятся... 🌼',
                          'Последний шанс! 💕',
                          'Окей, окей... но подумай ещё раз! 😉'
                        ];
                        alert(messages[Math.floor(Math.random() * messages.length)]);
                      }}
                      className="px-8 py-4 bg-gray-200 text-gray-700 text-xl font-bold rounded-full shadow-lg hover:scale-110 transform transition-all duration-300"
                    >
                      Нет 😢
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer message */}
        <div className="mt-12 text-center text-gray-600 animate-fade-in">
          <p className="text-sm md:text-base">
            Сделано с любовью и ромашками 🌼💕
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
