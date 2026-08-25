import { InternshipCard } from "./InternshipCard";
import { ProgramCard } from "./ProgramCard";
import { PromoCard } from "./PromoCard";
import type { SavedCardData } from "./types";

type SavedCardProps = {
  item: SavedCardData;
  onToggleSave?: (id: string, saved: boolean) => void;
};

export function SavedCard({ item, onToggleSave }: SavedCardProps) {
  const handleToggle = onToggleSave
    ? (saved: boolean) => onToggleSave(item.id, saved)
    : undefined;

  switch (item.type) {
    case "program":
      return <ProgramCard data={item} onToggleSave={handleToggle} />;
    case "promo":
      return <PromoCard data={item} onToggleSave={handleToggle} />;
    case "internship":
      return <InternshipCard data={item} onToggleSave={handleToggle} />;
    default: {
      const _exhaustive: never = item;
      return _exhaustive;
    }
  }
}
