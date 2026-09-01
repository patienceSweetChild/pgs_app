import { describe, expect, it } from "vitest";
import { opsHref, staffPortalLink, stripMonolithPrefix } from "./routes";

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
