import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminDashboardPage() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();

  const [
    users,
    pendingPremium,
    enquiries,
    coursesLive,
    eventsLive,
    programsLive,
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("premium_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("enquiries").select("id", { count: "exact", head: true }),
    supabase
      .from("courses")
      .select("id", { count: "exact", head: true })
      .eq("lifecycle_phase", "live"),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("lifecycle_phase", "live"),
    supabase
      .from("programs")
      .select("id", { count: "exact", head: true })
      .eq("lifecycle_phase", "live"),
  ]);

  const cards = [
    { label: "Total users", value: users.count ?? 0 },
    { label: "Pending premium", value: pendingPremium.count ?? 0 },
    { label: "Enquiries", value: enquiries.count ?? 0 },
    { label: "Live courses", value: coursesLive.count ?? 0 },
    { label: "Live events", value: eventsLive.count ?? 0 },
    { label: "Live programs", value: programsLive.count ?? 0 },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Welcome, Admin</h1>
      <p style={{ color: "#6b6280" }}>
        Monitor users, premium activity, catalog phases, and enquiries.
      </p>
      <div className="pgs-admin__grid" style={{ marginTop: "1rem" }}>
        {cards.map((c) => (
          <div key={c.label} className="pgs-admin__card">
            <h3>{c.value}</h3>
            <p>{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
