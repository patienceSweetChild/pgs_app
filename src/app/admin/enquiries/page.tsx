import { EnquiriesClient } from "@/features/admin/EnquiriesClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminEnquiriesPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return <EnquiriesClient rows={data ?? []} />;
}
