import { booking } from "./src/model.ts";
export function startApi() {
  return Bun.serve({ hostname: "127.0.0.1", port: 4231, async fetch(request) {
    const url = new URL(request.url), headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
    if (url.pathname !== "/api/book") return new Response("Not found", { status: 404, headers });
    if (request.method !== "POST") return new Response("Use POST", { status: 405, headers: { ...headers, Allow: "POST" } });
    try {
      if (!request.headers.get("content-type")?.startsWith("application/json")) return new Response("Use JSON", { status: 415, headers });
      const text = await request.text(); if (text.length > 5000) return new Response("Fixture body too large", { status: 413, headers });
      const body = JSON.parse(text), value = booking(body?.title, body?.seats);
      if (body.fixture === "reject") return Response.json({ message: "Declared receiver refusal" }, { status: 503, headers });
      if (body.fixture === "malformed") return Response.json({ id: "invalid", title: value.title, seats: "three" }, { headers });
      return Response.json({ id: crypto.randomUUID(), ...value }, { status: 201, headers });
    } catch { return Response.json({ message: "Invalid fixture request" }, { status: 422, headers }); }
  } });
}
