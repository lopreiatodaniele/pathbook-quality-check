import { expect, it, vi } from "vitest";
import { createSubmitter, type Phase } from "../src/controller";
export function deferred<T>() { let resolve!: (value: T) => void, reject!: (reason: unknown) => void; const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; }
it("does not submit invalid values or overlapping intent", async () => {
  const pending = deferred<unknown>(), send = vi.fn(() => pending.promise), phases: Phase[] = [], owner = createSubmitter(send, phase => phases.push(phase));
  expect(await owner.submit("Workshop", 0)).toBe(false); expect(send).not.toHaveBeenCalled();
  const first = owner.submit("Workshop", 1); expect(await owner.submit("Workshop", 1)).toBe(false); expect(send).toHaveBeenCalledTimes(1);
  pending.resolve({ id: "a", title: "Workshop", seats: 1 }); expect(await first).toBe(true); expect(phases.at(-1)?.status).toBe("success");
});
it("obsolete success and finally cannot publish or unlock newer work", async () => {
  const old = deferred<unknown>(), fresh = deferred<unknown>(), send = vi.fn().mockReturnValueOnce(old.promise).mockReturnValueOnce(fresh.promise), phases: Phase[] = [], owner = createSubmitter(send, phase => phases.push(phase));
  const first = owner.submit("Old workshop", 1); owner.cancel(); const second = owner.submit("New workshop", 2);
  old.resolve({ id: "old", title: "Old workshop", seats: 1 }); await first;
  expect(phases.at(-1)?.status).toBe("pending"); expect(await owner.submit("Third workshop", 1)).toBe(false);
  fresh.resolve({ id: "new", title: "New workshop", seats: 2 }); expect(await second).toBe(true); expect(phases.at(-1)?.receipt?.title).toBe("New workshop");
});
it("obsolete rejection and disposal do not announce new errors", async () => {
  const pending = deferred<unknown>(), phases: Phase[] = [], owner = createSubmitter(() => pending.promise, phase => phases.push(phase));
  const attempt = owner.submit("Workshop", 1); owner.dispose(); pending.reject(new Error("Old rejection")); await attempt; expect(phases).toHaveLength(1);
});
