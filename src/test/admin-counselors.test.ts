import { describe, expect, it } from "vitest";
import { counselorMetrics, percentage, type AdminCounselor } from "@/lib/admin-counselors";

const counselor: AdminCounselor = { id: "test", name: "Test", category: "Psikolog Ahli", expertise: "", pending: 2, acceptedWaiting: 1, ongoing: 1, completed: 4, rejected: 1, cancelled: 1 };

describe("Admin counselor analytics", () => {
  it("counts cancelled-after-acceptance requests as previously accepted without double-counting totals", () => {
    expect(counselorMetrics(counselor)).toEqual({ total: 10, accepted: 7, decided: 8 });
  });
  it("calculates status percentages against all requests", () => {
    expect(percentage(counselor.pending, counselorMetrics(counselor).total)).toBe(20);
  });
  it("calculates acceptance against decisions, excluding pending requests", () => {
    const metrics = counselorMetrics(counselor);
    expect(percentage(metrics.accepted, metrics.decided)).toBe(87.5);
  });
  it("calculates post-acceptance cancellations against accepted requests", () => {
    expect(percentage(counselor.cancelled, counselorMetrics(counselor).accepted)).toBe(14.3);
  });
  it("returns zero for a counselor without requests", () => {
    expect(percentage(0, 0)).toBe(0);
  });
});