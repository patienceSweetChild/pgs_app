import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLeadsPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("lead_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Leads / Modal submissions</h1>
      <div className="pgs-admin__table-wrap">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row) => (
              <tr key={row.id}>
                <td>{row.modal_type}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>{row.phone}</td>
                <td>{row.source_page}</td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
