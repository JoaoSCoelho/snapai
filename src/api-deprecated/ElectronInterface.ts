import { BrowserWindow } from "electron";
import { ModulesSearchEngine } from "./systems/ModulesSearchEngine/ModulesSearchEngine";
import { Listener } from "./listeners/Listener";
import { GetProjectsNamesListener } from "./listeners/GetProjectsNamesListener";
import { GetModelsNamesListener } from "./listeners/GetModelsNamesListener";
import { FindGenericModelListener } from "./listeners/FindGenericModelListener";
import { AppendSimulationLogListener } from "./listeners/AppendSimulationLogListener";
import { SimulatorConfig } from "@/simulator/configurations/Simulator/SimulatorConfig";
SimulatorConfig;

export class ElectronInterface {
  private static instance: ElectronInterface;

  private constructor(
    private win: BrowserWindow,
    private ipcMain: Electron.IpcMain,
    private inited = false,
    private modulesSearchEngine = new ModulesSearchEngine(),
  ) {}

  /**
   * Gets the singleton instance of the ElectronInterface.
   * If the instance has not been initialized, it will create a new instance.
   * @returns The singleton instance of the ElectronInterface.
   */
  public static getInstance(): ElectronInterface {
    if (!this.instance) {
      this.instance = new ElectronInterface(undefined as any, undefined as any);
    }
    return this.instance;
  }

  /**
   * Initializes the ElectronInterface.
   * @param {BrowserWindow} win - The BrowserWindow to use for sending responses.
   * @param {Electron.IpcMain} ipcMain - The IPCMain to use for registering listeners.
   * @returns {ElectronInterface} - The initialized ElectronInterface.
   * @throws {Error} - If the ElectronInterface has already been initialized.
   */
  public init(win: BrowserWindow, ipcMain: Electron.IpcMain): this {
    if (this.inited) throw new Error("ElectronInterface already inited");

    this.win = win;
    this.ipcMain = ipcMain;
    this.inited = true;

    const listeners = this.instanceListeners();
    this.registerListeners(listeners);

    return this;
  }

  private instanceListeners(): Listener[] {
    return [
      new GetProjectsNamesListener(this.modulesSearchEngine),
      new GetModelsNamesListener(this.modulesSearchEngine),
      new FindGenericModelListener(this.modulesSearchEngine),
      new AppendSimulationLogListener(),
    ];
  }

  /**
   * Registers the given listeners to the IPCMain.
   * Each listener is registered with a 'REQ <listener.name>' event.
   * When the event is triggered, the listener's exec method is called with the given data and id.
   * If the exec method succeeds, the result is sent back to the renderer with a 'RES OK <listener.name>:<id>' event.
   * If the exec method fails, the error is sent back to the renderer with a 'RES ERR <listener.name>:<id>' event.
   * @param {Listener[]} listeners - The listeners to register.
   */
  private registerListeners(listeners: Listener[]) {
    for (const listener of listeners) {
      console.log(`-> Registered listener: ${listener.name}`);

      this.ipcMain.on(`REQ:${listener.name}`, async (_, id, data) => {
        console.log(`REQ:${listener.name}`, id, data);
        try {
          const result = await listener.exec(id, data);
          this.win.webContents.send(`RES OK ${listener.name}:${id}`, result);
        } catch (error) {
          this.win.webContents.send(`RES ERR ${listener.name}:${id}`, error);
        }
      });
    }
  }

  public setModulesSearchEngine(modulesSearchEngine: ModulesSearchEngine) {
    this.modulesSearchEngine = modulesSearchEngine;
  }
}
