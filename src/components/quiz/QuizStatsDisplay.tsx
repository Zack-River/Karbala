import React from "react";
import type { QuizStats } from "@/types/database";

interface QuizStatsDisplayProps {
  stats: QuizStats;
}

export function QuizStatsDisplay({ stats }: QuizStatsDisplayProps) {
  if (!stats || stats.total_attempts === 0) {
    return null; // Don't show anything if there are no attempts yet
  }

  return (
    <div className="mt-12 pt-12 border-t border-[rgba(212,185,138,0.1)]">
      <h3 className="text-2xl font-scheherazade text-karbala-gold text-center mb-8">
        إحصائيات الاختبار
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
        <div className="card-base p-6 text-center bg-[rgba(212,185,138,0.02)]">
          <div className="text-3xl font-bold text-karbala-gold-light mb-2">
            {stats.total_attempts}
          </div>
          <div className="text-sm font-kufi text-karbala-secondary">
            إجمالي المشاركات
          </div>
        </div>

        <div className="card-base p-6 text-center bg-[rgba(212,185,138,0.02)]">
          <div className="text-3xl font-bold text-karbala-gold-light mb-2">
            {stats.pass_rate}%
          </div>
          <div className="text-sm font-kufi text-karbala-secondary">
            نسبة النجاح (50%+)
          </div>
        </div>

        <div className="card-base p-6 text-center bg-[rgba(212,185,138,0.02)]">
          <div className="text-3xl font-bold text-karbala-gold-light mb-2">
            {stats.average_score}%
          </div>
          <div className="text-sm font-kufi text-karbala-secondary">
            متوسط الدرجات
          </div>
        </div>

        <div className="card-base p-6 text-center bg-[rgba(212,185,138,0.02)]">
          <div className="text-3xl font-bold text-karbala-gold-light mb-2">
            {stats.perfect_score_count}
          </div>
          <div className="text-sm font-kufi text-karbala-secondary">
            علامة كاملة
          </div>
        </div>
      </div>
    </div>
  );
}
