import { redirect } from "next/navigation";

export default async function OpsStudentWorkspaceRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/ops/students/${id}`);
}
