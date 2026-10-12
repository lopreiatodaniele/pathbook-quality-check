export type Booking = { title: string; seats: number };
export type Receipt = Booking & { id: string };
export class BookingInputError extends Error {
  constructor(message: string, public field: "title" | "seats") { super(message); }
}
export function validSeats(value: unknown): value is number { return typeof value === "number" && Number.isInteger(value) && value >= 1 && value < 3; }
export function booking(title: unknown, seats: unknown): Booking {
  if (typeof title !== "string" || title.trim().length < 2 || title.trim().length > 40) throw new BookingInputError("Use a workshop title of 2–40 characters after trimming.", "title");
  if (!validSeats(seats)) throw new BookingInputError("Request 1–3 whole seats.", "seats");
  return { title: title.trim(), seats };
}
export function decodeReceipt(value: unknown): Receipt {
  if (!value || typeof value !== "object" || !("id" in value) || typeof value.id !== "string" || !value.id.trim() || !("title" in value) || !("seats" in value)) throw new Error("Invalid receipt.");
  return { id: value.id, ...booking(value.title, value.seats) };
}
