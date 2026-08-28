"use client";

import { useCallback, useState } from "react";
import { LoginRequiredPopup } from "@/components/auth/LoginRequiredPopup";
import { useExperience } from "@/lib/auth/experience";
import { toggleSavedItem } from "@/features/saved/save-actions";

type SaveableCard = {
  id: string;
  entityType?: "course" | "event";
  entityId?: string;
};

export function useCardSave(initialSavedIds: string[] = []) {
  const { isLoggedIn } = useExperience();
  const [savedIds, setSavedIds] = useState(() => new Set(initialSavedIds));
  const [loginOpen, setLoginOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  const isSaved = useCallback(
    (cardId: string) => savedIds.has(cardId),
    [savedIds],
  );

  const handleToggleSave = useCallback(
    async (card: SaveableCard): Promise<boolean> => {
      if (!card.entityType || !card.entityId) return false;

      if (!isLoggedIn) {
        setLoginOpen(true);
        return false;
      }

      setPending(card.id);
      try {
        const result = await toggleSavedItem(card.entityType, card.entityId);
        setSavedIds((prev) => {
          const copy = new Set(prev);
          if (result.saved) copy.add(card.id);
          else copy.delete(card.id);
          return copy;
        });
        return result.saved;
      } catch (err) {
        console.error("toggleSavedItem", err);
        return isSaved(card.id);
      } finally {
        setPending(null);
      }
    },
    [isLoggedIn, isSaved],
  );

  const loginPopup = (
    <LoginRequiredPopup
      open={loginOpen}
      onClose={() => setLoginOpen(false)}
      message="Please login to save items to your list."
    />
  );

  return {
    isSaved,
    handleToggleSave,
    loginPopup,
    pending,
  };
}
