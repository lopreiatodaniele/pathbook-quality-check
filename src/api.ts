import type { Sender } from "./controller";
export function senderFor(fixture: string): Sender {
  return async (value, signal) => {
    const response = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...value, fixture }), signal });
    if (!response.ok) throw new Error(`Receiver rejected the request (${response.status}). Keep the draft and retry.`);
    return response.json();
  };
}
