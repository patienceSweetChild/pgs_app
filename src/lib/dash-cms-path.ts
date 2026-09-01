/** Staff dashboard CMS (`/dash`, `/dash/[id]`). Not the public student feed (`/dashboard`). */
export function isDashCmsPath(pathname: string) {
  return pathname === "/dash" || pathname.startsWith("/dash/");
}
