import { useEffect, useMemo, useRef, useState } from "react";
import { createSubmitter, type Phase, type Sender } from "./controller";
import type { Receipt } from "./model";
import { scheduleHint } from "./debounce";
export default function BookingForm({ send }: { send: Sender }) {
  const [title, setTitle] = useState(""), [seats, setSeats] = useState(1), [phase, setPhase] = useState<Phase>({ status: "idle", message: "Ready to request seats." }), [receipts, setReceipts] = useState<Receipt[]>([]), [draftHint, setDraftHint] = useState("");
  const titleInput = useRef<HTMLInputElement>(null);
  const submitter = useMemo(() => createSubmitter(send, next => {
    setPhase(next);
    if (next.status === "error") { /* Preserve the rejected draft. */ }
    if (next.status === "success" && next.receipt && next.submitted) {
      const receipt = next.receipt, submitted = next.submitted;
      setReceipts(previous => [...previous, receipt]);
      setTitle(current => current.trim() === submitted.title ? "" : current);
      setSeats(current => current === submitted.seats ? 1 : current);
    }
  }), [send]);
  useEffect(() => () => submitter.dispose(), [submitter]);
  useEffect(() => scheduleHint(() => setDraftHint(title.trim() ? "Draft updated." : "")), [title]);
  return <section aria-labelledby="booking-heading">
    <h2 id="booking-heading">Request workshop seats</h2>
    <form onSubmit={event => { event.preventDefault(); void submitter.submit(title, seats); }} aria-describedby={phase.status === "error" ? "request-error" : "request-help"}>
      <p id="request-help">Fictional workshop titles: 2–40 characters after trimming. Request 1–3 whole seats. This fixture records acknowledgements, not durable bookings.</p>
      <label htmlFor="workshop-title">Workshop title</label><input ref={titleInput} id="workshop-title" value={title} aria-invalid={phase.fieldError === "title" || undefined} aria-describedby={phase.fieldError === "title" ? "request-error" : "request-help"} onChange={event => { setTitle(event.target.value); if (phase.fieldError === "title") setPhase({ status: "idle", message: "Review the changed draft and submit again." }); }} required minLength={2} maxLength={40} />
      <label htmlFor="seats">Seats</label><input id="seats" type="number" value={Number.isNaN(seats) ? "" : seats} aria-invalid={phase.fieldError === "seats" || undefined} aria-describedby={phase.fieldError === "seats" ? "request-error" : "request-help"} onChange={event => { setSeats(event.target.valueAsNumber); if (phase.fieldError === "seats") setPhase({ status: "idle", message: "Review the changed draft and submit again." }); }} required min={1} max={3} step={1} />
      <div className="actions"><button type="submit" disabled={phase.status === "pending"}>Request seats</button>{phase.status === "pending" && <button type="button" onClick={() => { submitter.cancel(); titleInput.current?.focus(); }}>Cancel waiting</button>}</div>
      {phase.status === "error" && <p role="alert" id="request-error">{phase.message}</p>}
      <p role="status" aria-label="Booking feedback">{phase.status === "error" ? "No successful receipt is available for this attempt." : phase.message}</p>
      <p role="status" aria-label="Draft feedback">{draftHint}</p>
    </form>
    <h3>Accepted acknowledgements in this page</h3><ul aria-label="Accepted acknowledgements">{receipts.map(receipt => <li key={receipt.id}>{receipt.title} · {receipt.seats} seats</li>)}</ul>
  </section>;
}
