import z from "zod";

export const simulatorConfigSchema = z.object({
  projectsPath: z.string(),
  defaultsPath: z.string(),
  modelsPath: z.string(),
});

export type SimulatorConfigSchema = z.infer<typeof simulatorConfigSchema>;
