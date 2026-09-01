import {
  staffStudentScopeLabel,
  type StaffSurfaceAccess,
} from "@/lib/operations/staff-access";

export function StaffAccessSummary({
  access,
  heading = "Effective access",
}: {
  access: StaffSurfaceAccess;
  heading?: string;
}) {
  const rows = [
    ["Operations", access.operations],
    ["Student scope", access.studentScope || staffStudentScopeLabel("viewer")],
    ["CMS", access.cms],
    ["Audit", access.audit],
    ["Staff management", access.staffManagement],
    ["AI", access.ai],
  ] as const;

  return (
    <section className="pgs-ops__detail-panel" aria-label={heading}>
      <h2>{heading}</h2>
      <dl className="pgs-ops__facts">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
