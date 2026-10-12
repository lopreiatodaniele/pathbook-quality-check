import { expect, it, vi } from "vitest";
import { scheduleHint } from "../src/debounce";
it("runs at the declared boundary, not before", async () => { vi.useFakeTimers(); const callback = vi.fn(); scheduleHint(callback); await vi.advanceTimersByTimeAsync(249); expect(callback).not.toHaveBeenCalled(); await vi.advanceTimersByTimeAsync(1); expect(callback).toHaveBeenCalledTimes(1); });
it("cancels owned work before it can run", async () => { vi.useFakeTimers(); const callback = vi.fn(), cancel = scheduleHint(callback); cancel(); await vi.advanceTimersByTimeAsync(250); expect(callback).not.toHaveBeenCalled(); });
