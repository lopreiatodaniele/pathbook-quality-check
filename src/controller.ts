import { booking, decodeReceipt, BookingInputError, type Booking, type Receipt } from "./model";
export type Sender = (value: Booking, signal: AbortSignal) => Promise<unknown>;
export type Phase = { status: "idle" | "pending" | "success" | "error" | "cancelled"; message: string; receipt?: Receipt; submitted?: Booking; fieldError?: "title" | "seats" };
export function createSubmitter(send: Sender, publish: (phase: Phase) => void) {
  let intent = 0, pending = false, controller: AbortController | null = null;
  return {
    async submit(title: string, seats: number) {
      if (pending) return false;
      let submitted: Booking;
      try { submitted = booking(title, seats); } catch (error) { publish({ status: "error", message: (error as Error).message, ...(error instanceof BookingInputError ? { fieldError: error.field } : {}) }); return false; }
      const token = ++intent; pending = true; controller = new AbortController();
      publish({ status: "pending", message: "Waiting for the receiver…" });
      try {
        const receipt = decodeReceipt(await send(submitted, controller.signal));
        if (token !== intent) return false;
        publish({ status: "success", message: `Accepted ${receipt.seats} seats for ${receipt.title}.`, receipt, submitted }); return true;
      } catch (error) {
        if (token !== intent) return false;
        publish({ status: "error", message: error instanceof Error ? error.message : "Request failed. Keep the draft and retry." }); return false;
      } finally { if (token === intent) { pending = false; controller = null; } }
    },
    cancel() { ++intent; pending = false; controller?.abort(); controller = null; publish({ status: "cancelled", message: "Stopped waiting locally. The receiver might still accept the request." }); },
    dispose() { ++intent; pending = false; controller?.abort(); controller = null; },
  };
}
