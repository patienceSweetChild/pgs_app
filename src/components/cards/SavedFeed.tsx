import { SavedCard } from "./SavedCard";
import { COL_CLASS, type SavedCardData } from "./types";
import "./cards.css";

type SavedFeedProps = {
  items: SavedCardData[];
  onToggleSave?: (id: string, saved: boolean) => void;
};

export function SavedFeed({ items, onToggleSave }: SavedFeedProps) {
  return (
    <div className="row align-items-start justify-content-md-start mobile-row-0">
      {items.map((item) => (
        <div
          className={
            item.type === "internship"
              ? "col-auto mb-4 pgs-feed-col--internship"
              : COL_CLASS[item.col]
          }
          key={item.id}
        >
          <SavedCard item={item} onToggleSave={onToggleSave} />
        </div>
      ))}
    </div>
  );
}
