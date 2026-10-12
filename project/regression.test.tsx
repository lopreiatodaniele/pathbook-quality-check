import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import BookingForm from "../src/BookingForm";
import { validSeats } from "../src/model";
// Deliberately weak. Add independent behavioral assertions; do not change mutants.
it("one ordinary seat is accepted", () => { expect(validSeats(1)).toBe(true); });
it("the heading renders", () => { render(<BookingForm send={async () => ({ id: "a", title: "Workshop", seats: 1 })} />); expect(screen.getByRole("heading", { name: "Request workshop seats" })).toBeInTheDocument(); });
