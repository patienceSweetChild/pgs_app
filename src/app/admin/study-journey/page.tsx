import { ReadOnlyTable } from "@/features/admin/ReadOnlyTable";

export default function Page() {
  return (
    <ReadOnlyTable
      title="Study abroad journey"
      table="study_journey_enquiries"
      columns={["name", "email", "phone", "pathway", "message", "replied", "created_at"]}
    />
  );
}
