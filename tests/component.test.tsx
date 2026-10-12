import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import BookingForm from "../src/BookingForm";
import { deferred } from "./helpers";
it("preserves rejected input and offers usable retry", async () => {
  const user = userEvent.setup(), send = vi.fn().mockRejectedValueOnce(new Error("Receiver unavailable")).mockResolvedValueOnce({ id: "ok", title: "CSS grids", seats: 1 }); render(<BookingForm send={send} />);
  await user.type(screen.getByRole("textbox", { name: "Workshop title" }), "CSS grids"); await user.click(screen.getByRole("button", { name: "Request seats" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Receiver unavailable"); expect(screen.getByRole("textbox", { name: "Workshop title" })).toHaveValue("CSS grids");
  expect(screen.getByRole("textbox", { name: "Workshop title" })).not.toHaveAttribute("aria-invalid", "true");
  await user.click(screen.getByRole("button", { name: "Request seats" })); expect(await screen.findByText("CSS grids · 1 seats")).toBeInTheDocument();
});
it("associates a local trimmed-title error without contacting the receiver", async () => {
  const user = userEvent.setup(), send = vi.fn(); render(<BookingForm send={send} />);
  const input = screen.getByRole("textbox", { name: "Workshop title" }); await user.type(input, "  "); await user.click(screen.getByRole("button", { name: "Request seats" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("after trimming"); expect(input).toHaveAttribute("aria-invalid", "true"); expect(input).toHaveAttribute("aria-describedby", "request-error"); expect(send).not.toHaveBeenCalled();
  await user.clear(input); await user.type(input, "HTML forms"); expect(input).not.toHaveAttribute("aria-invalid", "true");
});
it("does not delete a newer draft after accepting the submitted snapshot", async () => {
  const user = userEvent.setup(), pending = deferred<unknown>(); render(<BookingForm send={() => pending.promise} />);
  const input = screen.getByRole("textbox", { name: "Workshop title" }); await user.type(input, "HTML forms"); await user.click(screen.getByRole("button", { name: "Request seats" }));
  await user.clear(input); await user.type(input, "New workshop"); await act(async () => pending.resolve({ id: "a", title: "HTML forms", seats: 1 })); expect(input).toHaveValue("New workshop");
});
it("Cancel returns focus and ignores a transport that ignores abort", async () => {
  const user = userEvent.setup(), pending = deferred<unknown>(); render(<BookingForm send={() => pending.promise} />);
  const input = screen.getByRole("textbox", { name: "Workshop title" }); await user.type(input, "HTML forms"); await user.click(screen.getByRole("button", { name: "Request seats" })); await user.click(screen.getByRole("button", { name: "Cancel waiting" }));
  expect(input).toHaveFocus(); await act(async () => pending.resolve({ id: "old", title: "HTML forms", seats: 1 })); expect(screen.queryByText("HTML forms · 1 seats")).not.toBeInTheDocument(); expect(input).toHaveValue("HTML forms");
});
