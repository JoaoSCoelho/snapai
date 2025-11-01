export class SimulationLogger {
  public constructor(private readonly useConsole: boolean = true) {}

  public log(message: string, ...args: any[]): void {
    if (this.useConsole) console.log(message);
  }
}
