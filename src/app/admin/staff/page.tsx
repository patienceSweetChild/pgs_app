import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminStaffPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("staff_profiles")
    .select("user_id, display_name, role_key, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Admins / Staff</h1>
      <p style={{ color: "#6b6280" }}>
        Promote a user by inserting into <code>staff_profiles</code> after they
        exist in Auth (see seed SQL in README).
      </p>
      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row) => (
              <tr key={row.user_id}>
                <td>{row.display_name || "—"}</td>
                <td>{row.role_key}</td>
                <td>{row.status}</td>
                <td>
                  <code>{row.user_id}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
