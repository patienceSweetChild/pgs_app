import { redirect } from "next/navigation";
import { opsStudentHref } from "@pgs/shared";

export default async function OpsStudentWorkspaceRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(opsStudentHref(id));
}
