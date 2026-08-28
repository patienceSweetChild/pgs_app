import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SavedPage } from "@/features/saved/SavedPage";
import { listUserSavedCards } from "@/features/saved/save-actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Saved",
};

export default async function Page() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      redirect("/login?next=/saved");
    }
  }

  const items = await listUserSavedCards();
  return <SavedPage items={items} />;
}
