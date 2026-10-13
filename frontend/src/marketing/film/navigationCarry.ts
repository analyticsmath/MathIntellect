import type { ModelId } from "./filmMedia";
export interface CarrySnapshot {
  id: ModelId;
  src: string;
  position: string;
  filter: string;
  rect: { left: number; top: number; width: number; height: number };
  imageRect: { left: number; top: number; width: number; height: number };
  time: number;
}
let carry: CarrySnapshot | null = null;
export function setCarry(snapshot: CarrySnapshot | null) {
  carry = snapshot;
}
export function takeCarry() {
  const snapshot = carry;
  carry = null;
  return snapshot;
}
