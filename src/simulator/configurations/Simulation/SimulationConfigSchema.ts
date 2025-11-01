import { Api } from "@/api/Api";
import z from "zod";

export const simulationConfigSchema = z.object({
  simulationName: z
    .string()
    .min(1)
    .max(255)
    .regex(/^[A-z_][A-z_-\d]*$/),
  dimX: z
    .tuple([z.number(), z.number()])
    .refine(([left, right]) => left <= right, {
      message:
        "The minimum dimension must be less than or equal to the maximum dimension",
    }),
  dimY: z
    .tuple([z.number(), z.number()])
    .refine(([left, right]) => left <= right, {
      message:
        "The minimum dimension must be less than or equal to the maximum dimension",
    }),
  isAsynchronous: z.boolean(),
  shouldSaveTrace: z.boolean(),
  nackMessagesEnabled: z.boolean(),
  connectivityEnabled: z.boolean(),
  interferenceEnabled: z.boolean(),
  messageTransmissionModel: z.string().refine(
    (value) => {
      if (!Api.getInstance().cache.modelsNames.has("message_transmission"))
        throw new Error("Cache modelsNames not initialized");
      return Api.getInstance()
        .cache.modelsNames.get("message_transmission")!
        .has(value);
    },
    {
      error: "Should be a pre-created message transmission model",
    },
  ),
  messageTransmissionModelParameters: z.record(z.string(), z.any()),
});

export type SimulationConfigSchema = z.infer<typeof simulationConfigSchema>;
