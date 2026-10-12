import { expect, it } from "vitest";
import { booking, validSeats, decodeReceipt } from "../src/model";
it.each([1, 2, 3])("accepts %i whole seats including the upper boundary", seats => { expect(validSeats(seats)).toBe(true); });
it.each([0, 4, -1, 1.5, NaN, Infinity, "2", null])("rejects invalid seat value %s", seats => { expect(validSeats(seats)).toBe(false); });
it("trims titles without changing the supplied data", () => { expect(booking("  CSS grids  ", 3)).toEqual({ title: "CSS grids", seats: 3 }); });
it("covers both title boundaries and their adjacent values", () => { expect(booking("ab", 1).title).toBe("ab"); expect(booking("x".repeat(40), 1).title).toHaveLength(40); for (const title of ["", " ", "a", "x".repeat(41)]) expect(() => booking(title, 1)).toThrow(); });
it("rejects malformed receipts rather than accepting a static cast", () => { expect(() => decodeReceipt({ id: "ok", title: "HTML forms", seats: "3" })).toThrow(); expect(() => decodeReceipt({ title: "HTML forms", seats: 3 })).toThrow(); });
it("keeps a valid title as literal data", () => { expect(decodeReceipt({ id: "a", title: "<b>Workshop</b>", seats: 1 })).toEqual({ id: "a", title: "<b>Workshop</b>", seats: 1 }); });
