export {};

export type Bridge = {
  send: (channel: string, data?: any, id?: string) => void;
  on: (channel: string, func: (...args: any[]) => void) => () => void;
  offAll: (channel: string) => void;
};

declare global {
  interface Window {
    electron?: Bridge;
  }
}
