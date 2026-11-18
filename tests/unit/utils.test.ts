import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime } from "@/lib/utils";

describe("Chinese date formatting", () => {
  it("uses Shanghai instead of the container UTC timezone", () => {
    const instant = new Date("2026-11-17T16:30:00.000Z");
    expect(formatDate(instant)).toBe("2026/11/18");
    expect(formatDateTime(instant)).toContain("2026/11/18");
    expect(formatDateTime(instant)).toContain("00:30");
  });
});
