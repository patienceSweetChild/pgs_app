import { redirect } from "next/navigation";
import { opsPortalLink } from "@pgs/shared";

export default function AdminStaffPage() {
  redirect(opsPortalLink("/ops/team"));
}
