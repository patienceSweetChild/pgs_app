import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, created_at, crm_stage, preferred_study_country")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Users</h1>
      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Stage</th>
              <th>Preferred country</th>
              <th>Joined</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <tr key={u.id}>
                <td>{u.full_name || "—"}</td>
                <td>{u.crm_stage}</td>
                <td>{u.preferred_study_country || "—"}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  <Link href={`/admin/users/${u.id}`}>Open</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
