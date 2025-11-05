import { Simulator } from "@/simulator";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
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
  registerStatisticsForEveryRound: z.boolean(),
  nackMessagesEnabled: z.boolean(),
  connectivityEnabled: z.boolean(),
  interferenceEnabled: z.boolean(),
  messageTransmissionModel: z.string().refine(
    (value) => {
      return Simulator.inited
        ? SearchEngine.getPrefixedModelsNames("message_transmission").includes(
            value,
          )
        : true;
    },
    {
      error: (value) => ({
        message: "Invalid message transmission model:" + value.input,
      }),
    },
  ),
  messageTransmissionModelParameters: z.record(z.string(), z.any()),
});

export type SimulationConfigSchema = z.infer<typeof simulationConfigSchema>;
