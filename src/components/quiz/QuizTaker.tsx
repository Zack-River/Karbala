"use client";

import React, { useState, useEffect } from "react";
import type { QuizWithQuestions } from "@/types/database";
import { QUIZ_MOTIVATIONAL_MESSAGES } from "@/constants";
import { submitQuizAttempt } from "@/lib/actions/quiz-submit";

interface QuizTakerProps {
  quiz: QuizWithQuestions;
}

function getMotivationalMessage(score: number, total: number, custom?: string | null) {
  if (custom) return custom;
  const percentage = (score / total) * 100;
  const msg = QUIZ_MOTIVATIONAL_MESSAGES.find(
    (m) => percentage >= m.min && percentage <= m.max
  );
  return msg?.message ?? "";
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function QuizTaker({ quiz }: QuizTakerProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [starting, setStarting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>({});
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((score / totalQuestions) * 100) || 0;

  const submitAttempt = async (currentAnswers: Record<string, string> = answers) => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setErrorMsg(null);
    
    const result = await submitQuizAttempt(quiz.id, currentAnswers);
    
    if (result.success) {
      setScore(result.score!);
      setCorrectAnswers(result.correctAnswers!);
      setSubmitted(true);
    } else {
      setErrorMsg(result.error || "حدث خطأ أثناء تقديم الاختبار.");
    }
    
    setSubmitting(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    submitAttempt();
  };

  const handleStart = async () => {
    if (starting || hasStarted) return;

    setStarting(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: quiz.id }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setHasStarted(true);
        if (quiz.duration_minutes) {
          setTimeRemaining(quiz.duration_minutes * 60);
        }
      } else {
        setErrorMsg(result.error || "حدث خطأ أثناء بدء الاختبار.");
      }
    } catch {
      setErrorMsg("حدث خطأ في الاتصال. حاول مرة أخرى.");
    } finally {
      setStarting(false);
    }
  };

  // Timer tick logic
  useEffect(() => {
    if (hasStarted && !submitted && !submitting && timeRemaining !== null && timeRemaining > 0) {
      const timerId = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, submitted, submitting]); // Intentionally omitting timeRemaining so it doesn't reset the interval

  // Auto-submit logic when timer hits 0
  useEffect(() => {
    if (timeRemaining === 0 && !submitted && !submitting) {
      submitAttempt(answers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, submitted, submitting, answers]);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setAnimatedPercentage(percentage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [submitted, percentage]);

  if (submitted) {
    const message = getMotivationalMessage(score, totalQuestions, quiz.motivational_message);
    const dashArray = 283; // Circumference of a circle with r=45 (2 * pi * 45)
    const dashOffset = dashArray - (dashArray * animatedPercentage) / 100;

    return (
      <div className="space-y-10">
        {/* Results Summary */}
        <div className="card-base p-8 md:p-12 text-center max-w-3xl mx-auto relative overflow-hidden">
          {/* Background decorative glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-karbala-gold opacity-5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative w-36 h-36 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-[rgba(212,185,138,0.1)]" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className="text-karbala-gold drop-shadow-glow transition-all duration-1000 ease-out"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="font-cinzel text-4xl font-bold text-karbala-gold">{animatedPercentage}%</span>
              </div>
            </div>
            
            <h2 className="font-scheherazade text-4xl text-karbala-gold mb-4">
              إجاباتك الصحيحة: {score} من {totalQuestions}
            </h2>
            {message && (
              <p className="font-kufi text-body-lg text-karbala-secondary leading-relaxed bg-[rgba(212,185,138,0.05)] px-6 py-4 rounded-xl border border-[rgba(212,185,138,0.1)] inline-block">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Detailed Answers Review */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <h3 className="font-scheherazade text-3xl text-center text-karbala-white mb-8">مراجعة الإجابات</h3>
          
          {quiz.questions.map((question, index) => {
            const selectedAnswerId = answers[question.id];
            const correctId = correctAnswers[question.id];
            const wasAnswered = selectedAnswerId !== undefined;
            const isQuestionCorrect = wasAnswered && selectedAnswerId === correctId;

            return (
              <div key={question.id} className="card-base p-6 md:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-ambient">
                {/* Status border indicator */}
                <div className={`absolute top-0 right-0 w-1.5 h-full ${!wasAnswered ? 'bg-karbala-gray' : isQuestionCorrect ? 'bg-green-500' : 'bg-red-500'} opacity-80 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                
                <h4 className="font-scheherazade text-2xl text-karbala-gold-light mb-6 leading-relaxed flex items-start gap-3">
                  <span className="text-karbala-gold shrink-0 font-bold">{index + 1}.</span>
                  <span>{question.question}</span>
                </h4>

                <div className="space-y-3">
                  {question.answers.map((answer) => {
                    const isSelected = selectedAnswerId === answer.id;
                    const isCorrect = answer.id === correctId;
                    
                    let bgClass = "bg-[rgba(255,255,255,0.02)] border-[rgba(212,185,138,0.1)] text-karbala-gray";
                    let icon = null;

                    if (isSelected && isCorrect) {
                      bgClass = "bg-[rgba(34,197,94,0.1)] border-green-500/50 text-green-400";
                      icon = <CheckIcon className="w-5 h-5 text-green-400" />;
                    } else if (isSelected && !isCorrect) {
                      bgClass = "bg-[rgba(239,68,68,0.1)] border-red-500/50 text-red-400";
                      icon = <XIcon className="w-5 h-5 text-red-400" />;
                    } else if (!isSelected && isCorrect) {
                      bgClass = "bg-[rgba(34,197,94,0.05)] border-green-500/30 text-green-300";
                      icon = <CheckIcon className="w-5 h-5 text-green-400 opacity-70" />;
                    }

                    return (
                      <div
                        key={answer.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${bgClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? (isCorrect ? 'border-green-500 bg-green-500/20' : 'border-red-500 bg-red-500/20') : 'border-current opacity-50'}`}>
                            {isSelected && <div className={`w-2 h-2 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />}
                          </div>
                          <span className="font-kufi">{answer.answer_text}</span>
                        </div>
                        {icon && <div className="shrink-0 mr-4">{icon}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="card-base p-8 md:p-12 text-center max-w-2xl mx-auto">
        <h3 className="font-scheherazade text-3xl text-karbala-gold mb-4">هل أنت مستعد؟</h3>
        <p className="font-kufi text-karbala-gray mb-8 leading-relaxed">
          يتكون هذا الاختبار من {totalQuestions} أسئلة. 
          {quiz.duration_minutes ? ` لديك ${quiz.duration_minutes} دقيقة للإجابة عليها.` : " خذ وقتك في قراءة الأسئلة والإجابة عليها."}
          <br /><br />
          عند نقرك على زر البدء، لن تتمكن من التراجع.
        </p>
        <button
          type="button"
          onClick={handleStart}
          disabled={starting}
          className="px-10 py-4 text-lg bg-karbala-gold text-karbala-black font-kufi font-bold rounded-pill shadow-glow hover:bg-karbala-gold-light hover:-translate-y-1 hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {starting ? "جاري تجهيز الاختبار..." : "ابدأ الاختبار الآن"}
        </button>
        {errorMsg && (
          <div className="mt-6 text-red-400 bg-red-500/10 border border-red-500/30 px-6 py-3 rounded-lg font-kufi inline-block">
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {hasStarted && !submitted && timeRemaining !== null && (
        <div className={`sticky top-20 z-50 mx-auto max-w-sm mb-8 card-base p-4 flex items-center justify-between transition-colors shadow-lg ${timeRemaining < 60 ? 'border-red-500 bg-red-500/10 text-red-500 shadow-red-500/20' : 'border-karbala-gold/50 bg-[rgba(212,185,138,0.05)] text-karbala-gold shadow-karbala-gold/10'}`}>
          <span className="font-kufi font-bold text-lg">الوقت المتبقي:</span>
          <span className="font-cinzel text-2xl font-bold tracking-wider">{formatTime(timeRemaining)}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
        {quiz.questions.map((question, index) => (
        <div key={question.id} className="card-base p-6 md:p-8 transition-all hover:shadow-ambient">
          <h3 className="font-scheherazade text-2xl text-karbala-gold-light mb-6 leading-relaxed flex items-start gap-3">
            <span className="text-karbala-gold shrink-0 font-bold">{index + 1}.</span>
            <span>{question.question}</span>
          </h3>
          <div className="space-y-3">
            {question.answers.map((answer) => (
              <label
                key={answer.id}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  answers[question.id] === answer.id
                    ? "border-karbala-gold bg-[rgba(212,185,138,0.1)] shadow-inner"
                    : "border-gold-subtle hover:border-gold-medium hover:bg-[rgba(212,185,138,0.02)]"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={answer.id}
                  checked={answers[question.id] === answer.id}
                  onChange={() =>
                    setAnswers((prev) => ({ ...prev, [question.id]: answer.id }))
                  }
                  disabled={submitting || submitted}
                  className="w-5 h-5 text-karbala-gold focus:ring-karbala-gold bg-transparent border-karbala-gold-light/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className={`font-kufi text-lg ${answers[question.id] === answer.id ? "text-karbala-gold-light" : "text-karbala-white"}`}>
                  {answer.answer_text}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center pt-8">
        {errorMsg && (
          <div className="mb-6 text-red-400 bg-red-500/10 border border-red-500/30 px-6 py-3 rounded-lg font-kufi inline-block">
            {errorMsg}
          </div>
        )}
        <button
          type="submit"
          disabled={Object.keys(answers).length < totalQuestions || submitting}
          className="px-10 py-4 text-lg bg-karbala-gold text-karbala-black font-kufi font-bold rounded-pill shadow-glow hover:bg-karbala-gold-light hover:-translate-y-1 hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {submitting ? "جاري التصحيح..." : "إرسال الإجابات"}
        </button>
      </div>
    </form>
    </div>
  );
}
