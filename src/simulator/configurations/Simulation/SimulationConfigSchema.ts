import { Simulator } from "@/simulator/Simulator";
import { ModelType } from "@/simulator/utils/modelsUtils";
import { SearchEngine } from "@/simulator/utils/SearchEngine";
import z from "zod";

export const loggerOptionsSchema = z.object({
  useConsole: z.boolean(),
});

export type LoggerOptionsSchema = z.infer<typeof loggerOptionsSchema>;

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
  dimZ: z
    .tuple([z.number(), z.number()])
    .refine(([left, right]) => left <= right, {
      message:
        "The minimum dimension must be less than or equal to the maximum dimension",
    }),
  loggerOptions: loggerOptionsSchema,
  isAsynchronous: z.boolean(),
  shouldSaveTrace: z.boolean(),
  registerStatisticsForEveryRound: z.boolean(),
  nackMessagesEnabled: z.boolean(),
  connectivityEnabled: z.boolean(),
  mobilityEnabled: z.boolean(),
  interferenceEnabled: z.boolean(),
  connectOnAddNodes: z.boolean(),
  interferenceIsAdditive: z.boolean(),
  maxConnectionRadius: z.number().min(0).optional(),
  messageTransmissionModel: z.string().refine(
    (value) => {
      return Simulator.inited
        ? SearchEngine.getPrefixedModelsNames(
            ModelType.MessageTransmission,
          ).includes(value)
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
