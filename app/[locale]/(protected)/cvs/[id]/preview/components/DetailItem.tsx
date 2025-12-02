import type { DetailItemProps } from "../types";

export function DetailItem({ label, children }: DetailItemProps): JSX.Element {
  return (
    <div>
      <p className="font-bold">{label}</p>
      <div className="mt-1 text-white/90">{children}</div>
    </div>
  );
}
