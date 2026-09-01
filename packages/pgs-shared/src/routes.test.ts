import { describe, expect, it } from "vitest";
import { cmsStudentHref, opsHref, opsPortalLink, staffPortalLink, stripMonolithPrefix } from "./routes";

describe("stripMonolithPrefix", () => {
  it("strips /ops when deployed as ops surface", () => {
    expect(
      stripMonolithPrefix("ops", "/ops/students", {
        NEXT_PUBLIC_PGS_SURFACE: "ops",
      }),
    ).toBe("/students");
  });

  it("keeps monolith paths when surface unset", () => {
    expect(stripMonolithPrefix("ops", "/ops/students", {})).toBe("/ops/students");
  });
});

describe("opsHref", () => {
  it("maps scoreboard to root on split deploy", () => {
    expect(opsHref("/ops", { NEXT_PUBLIC_PGS_SURFACE: "ops" })).toBe("/");
  });
});

describe("opsPortalLink", () => {
  it("uses ops host when linking from admin", () => {
    expect(
      opsPortalLink("/ops/students", {
        NEXT_PUBLIC_PGS_SURFACE: "admin",
        NEXT_PUBLIC_OPS_SITE_URL: "http://localhost:3001",
      }),
    ).toBe("http://localhost:3001/students");
  });
});

describe("cmsStudentHref", () => {
  it("maps dash editor path on cms surface", () => {
    expect(
      cmsStudentHref("abc", { NEXT_PUBLIC_PGS_SURFACE: "cms" }),
    ).toBe("/abc");
  });

  it("uses cms host from ops", () => {
    expect(
      cmsStudentHref("abc", {
        NEXT_PUBLIC_PGS_SURFACE: "ops",
        NEXT_PUBLIC_CMS_SITE_URL: "http://localhost:3003",
      }),
    ).toBe("http://localhost:3003/abc");
  });
});

describe("staffPortalLink", () => {
  it("uses cross-surface URL on split deploy", () => {
    expect(
      staffPortalLink("admin", "/", {
        NEXT_PUBLIC_PGS_SURFACE: "ops",
        NEXT_PUBLIC_ADMIN_SITE_URL: "https://admin.purpleguide.study",
      }),
    ).toBe("https://admin.purpleguide.study/");
  });

  it("uses monolith path on single deploy", () => {
    expect(staffPortalLink("cms", "/")).toBe("/dash");
  });
});
