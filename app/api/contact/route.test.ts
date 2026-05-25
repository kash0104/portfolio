import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.mock is hoisted above all imports — use vi.hoisted so the factory
// can see the mock at hoist time. Plain top-level consts would not exist yet.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return { emails: { send: sendMock } };
  }),
}));

import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => { sendMock.mockReset(); sendMock.mockResolvedValue({ data: { id: "x" }, error: null }); process.env.RESEND_API_KEY = "test"; process.env.CONTACT_TO_EMAIL = "to@example.com"; });

  it("400s when fields are missing", async () => {
    const res = await POST(req({ name: "", email: "", message: "" }));
    expect(res.status).toBe(400);
  });

  it("400s on invalid email", async () => {
    const res = await POST(req({ name: "A", email: "not-an-email", message: "hi" }));
    expect(res.status).toBe(400);
  });

  it("sends the email and returns 200 on valid input", async () => {
    const res = await POST(req({ name: "A", email: "a@b.com", message: "hello world" }));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledOnce();
  });
});
