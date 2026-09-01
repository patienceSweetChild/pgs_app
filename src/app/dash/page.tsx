import type { Metadata } from "next";
import { DashCmsTable } from "@/features/dash-cms/DashCmsTable";

export const metadata: Metadata = {
  title: "Student dashboards",
};

export default function DashIndexPage() {
  return (
    <div className="pgs-admin__main">
      <DashCmsTable />
    </div>
  );
}
