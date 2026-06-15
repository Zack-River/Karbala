"use client";

import React, { useState } from "react";
import { renderCard } from "@/components/cards/ContentCards";
import { SectionDivider } from "@/components/ui/SectionDivider";
import type { Card } from "@/types/database";
import Link from "next/link";
import { CARD_TYPE_LABELS } from "@/constants";

interface CardsGridProps {
  initialCards: Card[];
}

export function CardsGrid({ initialCards }: CardsGridProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredCards = initialCards.filter(
    (card) => filter === "all" || card.type === filter
  );

  return (
    <div className="section-container pb-8xl">
      <div className="flex flex-wrap items-center justify-center gap-4 mb-4xl">
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2 rounded-pill font-kufi text-sm transition-all duration-300 ${
            filter === "all"
              ? "bg-[rgba(212,185,138,0.2)] border border-karbala-gold text-karbala-gold"
              : "border border-[rgba(212,185,138,0.3)] text-karbala-secondary hover:border-[rgba(212,185,138,0.6)] hover:text-karbala-gold"
          }`}
        >
          الكل
        </button>
        {Object.entries(CARD_TYPE_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-6 py-2 rounded-pill font-kufi text-sm transition-all duration-300 ${
              filter === key
                ? "bg-[rgba(212,185,138,0.2)] border border-karbala-gold text-karbala-gold"
                : "border border-[rgba(212,185,138,0.3)] text-karbala-secondary hover:border-[rgba(212,185,138,0.6)] hover:text-karbala-gold"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <SectionDivider />

      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl mt-4xl">
          {filteredCards.map((card) => (
            <Link
              key={card.id}
              href={`/karbala/cards/${card.slug}`}
              className="block h-full transition-transform hover:-translate-y-1"
            >
              {renderCard(card)}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center mt-6xl">
          <p className="font-kufi text-karbala-secondary">
            لا توجد بطاقات متاحة في هذا القسم حالياً.
          </p>
        </div>
      )}
    </div>
  );
}
