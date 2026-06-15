import React from "react";
import { CardsGrid } from "@/components/cards/CardsGrid";
import { getPublishedCards } from "@/lib/queries";

export const metadata = {
  title: "البطاقات والمقتطفات | وعيٌ يمرّ من كربلاء",
  description: "بطاقات، مقتطفات، وتأملات من ليالي وعي يمر من كربلاء",
};

export const dynamic = "force-dynamic";

export default async function CardsPage() {
  const cards = await getPublishedCards();

  return (
    <div className="pt-32 min-h-screen">
      <div className="section-container text-center mb-6xl">
        <h1 className="font-scheherazade text-display-h2 text-karbala-gold mb-4 leading-tight">
          البطاقات
        </h1>
        <p className="font-kufi text-body-lg text-karbala-secondary">
          مقتطفات، تأملات، وبطاقات مرئية للإلهام والمشاركة
        </p>
      </div>

      <CardsGrid initialCards={cards} />
    </div>
  );
}
