import { ReadOnlyTable } from "@/features/admin/ReadOnlyTable";

export default function Page() {
  return (
    <ReadOnlyTable
      title="Deadline Subscribers"
      table="deadline_subscriptions"
      columns={["email", "source_page", "created_at"]}
    />
  );
}
