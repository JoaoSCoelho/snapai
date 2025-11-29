import { v4 as uuidv4 } from "uuid";
import { Bridge } from "@/types/global";

export class ApiTransaction {
  private readonly id: string;
  private readonly bridge: Bridge;

  public constructor(
    private readonly identifier: string,
    private readonly data?: any,
    bridge?: Bridge,
    private timeout: number = 5000,
  ) {
    this.id = uuidv4();
    if (!bridge) {
      if (window.electron) bridge = window.electron;
      else throw new Error("Bridge not found");
    }

    this.bridge = bridge;
  }

  public getIdentifier(): string {
    return this.identifier;
  }

  public getData(): any {
    return this.data;
  }

  public getTimeout(): number {
    return this.timeout;
  }

  public getBridge(): Bridge | undefined {
    return this.bridge;
  }

  public setTimeout(timeout: number): void {
    this.timeout = timeout;
  }

  public async exec(): Promise<any> {
    this.bridge.send("ping");
    return new Promise((resolve, reject) => {
      this.bridge.on(`RES OK ${this.identifier}:${this.id}`, (data: any) => {
        resolve(data);
      });

      this.bridge.on(`RES ERR ${this.identifier}:${this.id}`, (err: any) => {
        reject(err);
      });

      this.bridge.send(`REQ:${this.identifier}`, this.data, this.id);

      setTimeout(() => {
        reject(
          new Error(
            `Timeout: have passed the maximum time limit (${this.timeout / 1000} s) `,
          ),
        );
      }, this.timeout);
    });
  }
}
