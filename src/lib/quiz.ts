import type { Quiz } from "@/types/database";

export type QuizStatus = 'upcoming' | 'open' | 'closed';

export function getQuizStatus(quiz: Pick<Quiz, 'opens_at' | 'closes_at'>): QuizStatus {
  const now = new Date().getTime();

  if (quiz.opens_at) {
    const opensAt = new Date(quiz.opens_at).getTime();
    if (now < opensAt) return 'upcoming';
  }

  if (quiz.closes_at) {
    const closesAt = new Date(quiz.closes_at).getTime();
    if (now > closesAt) return 'closed';
  }

  return 'open';
}
