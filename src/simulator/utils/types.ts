export enum AngleUnit {
  RAD = "rad",
  DEG = "deg",
}

export type EventMap<T> = Record<keyof T, any[]>;

export type DefaultEventMap = {
  [key: string]: any[];
};
