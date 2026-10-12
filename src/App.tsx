import { useMemo, useState } from "react";
import BookingForm from "./BookingForm";
import { senderFor } from "./api";
export default function App() {
  const [fixture, setFixture] = useState("success"), send = useMemo(() => senderFor(fixture), [fixture]);
  return <main><h1>Workshop booking desk</h1><p>Independent testing laboratory. Fictional requests only; no accounts, payments, analytics or external services. Reload clears this page's acknowledgement list.</p>
    <label htmlFor="fixture">Receiver fixture</label><select id="fixture" value={fixture} onChange={event => setFixture(event.target.value)}><option value="success">Successful response</option><option value="reject">503 rejection</option><option value="malformed">Malformed receipt</option></select>
    <p>Changing this diagnostic fixture disposes the previous request owner and resets its form. It is not a production setting.</p><BookingForm key={fixture} send={send} />
  </main>;
}
