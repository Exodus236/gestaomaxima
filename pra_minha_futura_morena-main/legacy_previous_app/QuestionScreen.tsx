import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FloatingNoButton } from './FloatingNoButton';
import { sounds } from '../utils/soundEffects';

export type StepType = 1 | 2 | 3 | 4;

interface QuestionScreenProps {
  step: StepType;
  onNext: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({ step, onNext }) => {
  // Step 1 timed reveals:
  const [stage, setStage] = useState<number>(0);
  const [signature, setSignature] = useState<string>('');
  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    // Reset stage on step change
    setStage(0);
    setInputError(false);

    if (step === 1) {
      // Step 1 timing: after 1.5s show second line, after 2.5s total show question & buttons
      const timer1 = setTimeout(() => {
        setStage(1);
      }, 1500);

      const timer2 = setTimeout(() => {
        setStage(2);
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      // Step 2, 3 and 4: show question & buttons after 800ms
      const timer1 = setTimeout(() => {
        setStage(1);
      }, 800);

      return () => clearTimeout(timer1);
    }
  }, [step]);

  const handleYes = () => {
    // Prevent accidental trigger from touch events landing on "Sim" right after "Não" dodges
    const lastDodge = (window as any).__lastDodgeTimestamp || 0;
    if (Date.now() - lastDodge < 450) {
      return;
    }

    // STEP 4 MANDATORY SIGNATURE VALIDATION
    if (step === 4 && !signature.trim()) {
      setInputError(true);
      sounds.playDodge();
      return;
    }

    sounds.playSuccess();

    // Trigger sweet confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#ec4899', '#fb7185', '#ffffff', '#fbbf24'],
      });
    } catch {
      // Fallback if canvas-confetti error
    }

    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-3 sm:px-4 text-center z-10 w-full max-w-xl mx-auto animate-pop-in">
      {/* Decorative top icon */}
      <div className="mb-4 sm:mb-6 text-4xl sm:text-5xl animate-float-bounce select-none">
        {step === 1 && "💍"}
        {step === 2 && "🍣"}
        {step === 3 && "🎎"}
        {step === 4 && "📜"}
      </div>

      <div className="space-y-4 mb-6 sm:mb-8 w-full">
        {/* STEP 1 CONTENT */}
        {step === 1 && (
          <>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-rose-900 tracking-tight transition-all duration-500">
              Oi, Luana ❤️
            </h2>

            {stage >= 1 && (
              <p className="text-lg sm:text-2xl font-bold text-rose-700 animate-pop-in">
                Tenho uma pergunta pra tu.
              </p>
            )}

            {stage >= 2 && (
              <p className="text-xl sm:text-3xl font-extrabold text-rose-800 animate-pop-in pt-1 sm:pt-2">
                Quer ser minha propriedade? 💍
              </p>
            )}
          </>
        )}

        {/* STEP 2 CONTENT */}
        {step === 2 && (
          <>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-rose-900 tracking-tight">
              Boa escolha ❤️
            </h2>

            {stage >= 1 && (
              <p className="text-xl sm:text-3xl font-extrabold text-rose-800 animate-pop-in pt-1 sm:pt-2">
                Quer sair comigo? 🍣
              </p>
            )}
          </>
        )}

        {/* STEP 3 CONTENT */}
        {step === 3 && (
          <>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-rose-900 tracking-tight">
              Quase lá...
            </h2>

            {stage >= 1 && (
              <p className="text-xl sm:text-3xl font-extrabold text-rose-800 animate-pop-in pt-1 sm:pt-2">
                Posso ir vestido de sushi? 🍣
              </p>
            )}
          </>
        )}

        {/* STEP 4 CONTENT */}
        {step === 4 && (
          <>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-rose-900 tracking-tight leading-snug px-2">
              Já que você quer mesmo, assina rapidinho e printa sua assinatura ✍️
            </h2>

            {stage >= 1 && (
              <div className="pt-3 sm:pt-4 flex flex-col items-center gap-2.5 w-full max-w-sm sm:max-w-md mx-auto animate-pop-in">
                <label className="text-xs sm:text-sm font-bold text-rose-700 select-none">
                  Digite sua assinatura abaixo:
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => {
                    setSignature(e.target.value);
                    if (inputError && e.target.value.trim()) setInputError(false);
                  }}
                  placeholder="Sugestão: eu quero"
                  className={`w-full px-4 py-3.5 bg-white border-2 ${
                    inputError
                      ? 'border-rose-600 ring-4 ring-rose-300 animate-pulse'
                      : 'border-rose-400 focus:border-rose-600 focus:ring-4 focus:ring-rose-200'
                  } rounded-2xl text-rose-900 font-extrabold text-lg sm:text-xl text-center shadow-md focus:outline-none transition-all select-text placeholder:text-rose-300 placeholder:font-normal`}
                />
                {inputError && (
                  <p className="text-xs sm:text-sm font-black text-rose-600 animate-pop-in pt-1">
                    ⚠️ Escreva sua assinatura na caixinha antes de continuar! ❤️
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Buttons section */}
      {(step === 1 ? stage >= 2 : stage >= 1) && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full animate-pop-in px-2">
          {/* YES / CONFIRM BUTTON */}
          <button
            onClick={handleYes}
            className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-base sm:text-xl rounded-2xl shadow-lg shadow-rose-300/60 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border-2 border-rose-300"
          >
            {step === 1 && "❤️ Sim"}
            {step === 2 && "🍣 Sim"}
            {step === 3 && "😂 Pode"}
            {step === 4 && "✍️ Confirmar Assinatura"}
          </button>

          {/* NO BUTTON (EVASIVE) */}
          <FloatingNoButton label="🙈 Não" />
        </div>
      )}
    </div>
  );
};
