import { redirect } from "next/navigation";
import { opsHref } from "@pgs/shared";

export default function OpsWorkspaceRedirect() {
  redirect(opsHref("/ops/students"));
}
