import React from "react";
import { Badge } from "@/components/ui/Badge";
import type { Card as CardType } from "@/types/database";
import { CARD_TYPE_LABELS } from "@/constants";

interface CardProps {
  card: CardType;
}

function CardImage({ card }: { card: CardType }) {
  if (!card.image) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={card.image}
      alt={card.title}
      className="w-full h-auto rounded-lg object-cover"
    />
  );
}

export function QuoteCard({ card }: CardProps) {
  return (
    <div className="card-base relative p-xl h-full min-h-[180px] flex flex-col justify-between overflow-hidden group">
      <div className="absolute top-2 rtl:left-2 ltr:right-2 text-[6rem] font-scheherazade text-karbala-gold opacity-10 leading-none select-none pointer-events-none group-hover:scale-110 group-hover:text-[rgba(212,185,138,0.2)] transition-all duration-500">
        &quot;
      </div>

      {card.image && card.image_position === "background" && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${card.image})` }}
        />
      )}

      {card.image && card.image_position === "top" && (
        <div className="mb-4 relative z-10">
          <CardImage card={card} />
        </div>
      )}

      <div className="relative z-10">
        <p className="font-scheherazade text-[1.2rem] text-karbala-gold-light italic leading-[1.6] mb-6">
          {card.content}
        </p>
      </div>

      {card.image && card.image_position === "bottom" && (
        <div className="mb-4 relative z-10">
          <CardImage card={card} />
        </div>
      )}

      <div className="relative z-10 flex items-end justify-between mt-auto">
        <Badge variant="muted">{card.title}</Badge>
        {card.seo_description && (
          <span className="font-kufi text-[0.875rem] text-karbala-gold">
            — {card.seo_description}
          </span>
        )}
      </div>
    </div>
  );
}

export function ReflectionCard({ card }: CardProps) {
  return (
    <div className="card-base relative p-xl h-full flex flex-col group rtl:pr-6 ltr:pl-6">
      <div className="absolute top-0 bottom-0 rtl:right-0 ltr:left-0 w-[3px] bg-karbala-gold rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />

      {card.image && card.image_position === "top" && (
        <div className="mb-4">
          <CardImage card={card} />
        </div>
      )}

      <h3 className="font-scheherazade text-[1.1rem] text-karbala-gold mb-3">
        {card.title}
      </h3>

      <p className="font-kufi text-[0.95rem] text-karbala-secondary leading-[1.7] mb-6 line-clamp-4">
        {card.content}
      </p>

      {card.image && card.image_position === "bottom" && (
        <div className="mb-4">
          <CardImage card={card} />
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        <Badge variant="gold">تأملات</Badge>
      </div>
    </div>
  );
}

export function VisualCard({ card }: CardProps) {
  return (
    <div className="card-base relative p-xl h-full flex flex-col overflow-hidden group">
      {card.image && (
        <div className="mb-4 -mx-2 -mt-2">
          <CardImage card={card} />
        </div>
      )}
      <h3 className="font-scheherazade text-[1.1rem] text-karbala-gold mb-3">
        {card.title}
      </h3>
      {card.content && (
        <p className="font-kufi text-[0.95rem] text-karbala-secondary leading-[1.7]">
          {card.content}
        </p>
      )}
    </div>
  );
}

export function GenericContentCard({ card }: CardProps) {
  const typeLabel = CARD_TYPE_LABELS[card.type] ?? card.type;
  const isHorizontal = card.image && (card.image_position === "left" || card.image_position === "right");

  return (
    <div className={`card-base relative p-xl h-full flex ${isHorizontal ? "flex-row gap-4" : "flex-col"} group`}>
      {card.image && card.image_position === "top" && (
        <div className="mb-4">
          <CardImage card={card} />
        </div>
      )}

      {card.image && card.image_position === "right" && (
        <div className="shrink-0 w-1/3">
          <CardImage card={card} />
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <h3 className="font-scheherazade text-[1.1rem] text-karbala-gold mb-3">
          {card.title}
        </h3>
        {card.content && (
          <p className="font-kufi text-[0.95rem] text-karbala-secondary leading-[1.7] mb-4 flex-1">
            {card.content}
          </p>
        )}
        <Badge variant="gold">{typeLabel}</Badge>
      </div>

      {card.image && card.image_position === "left" && (
        <div className="shrink-0 w-1/3">
          <CardImage card={card} />
        </div>
      )}

      {card.image && card.image_position === "bottom" && (
        <div className="mt-4">
          <CardImage card={card} />
        </div>
      )}
    </div>
  );
}

export function renderCard(card: CardType) {
  switch (card.type) {
    case "quote":
      return <QuoteCard card={card} />;
    case "reflection":
      return <ReflectionCard card={card} />;
    case "visual":
      return <VisualCard card={card} />;
    default:
      return <GenericContentCard card={card} />;
  }
}
