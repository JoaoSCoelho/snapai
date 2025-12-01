import z from "zod";
import { CheckboxField } from "../layout/fields/CheckboxField";
import { Line } from "../layout/Line";
import { NumberPairField } from "../layout/fields/NumberPairField";
import { TextField } from "../layout/fields/TextField";
import { Subsection } from "../layout/Subsection";
import { Section } from "../layout/Section";
import { Layout } from "../layout/Layout";
import { ModelSection } from "../layout/ModelSection";
import { ModelType } from "@/simulator/utils/modelsUtils";

export const simulationConfigLayout = new Layout([
  Section.create({
    title: "Simulation Parameters",

    subsections: [
      new Subsection([
        new Line([
          TextField.create({
            name: "simulationName",
            label: "Simulation name",
            occupedColumns: 6,
            required: true,
            schema: z
              .string()
              .min(1)
              .max(255)
              .regex(/^[A-z_][A-z_-\d]*$/),
            info: {
              title: `The name of the simulation. This name can\'t have spaces or special characters.`,
            },
          }),
          CheckboxField.create({
            name: "isAsynchronous",
            label: "Asynchronous Simulation",
            occupedColumns: 6,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, the simulation will run in asynchronous mode.",
            },
          }),
        ]),
        new Line([
          NumberPairField.create({
            name: "dimX",
            label: "X Dimension",
            occupedColumns: 6,
            schema: z
              .tuple([z.number(), z.number()])
              .refine(([left, right]) => left <= right, {
                message:
                  "The minimum dimension must be less than or equal to the maximum dimension",
              }),
            required: true,
            isFloat: true,
            info: {
              title: "The X dimension of the simulation. (min, max)",
            },
          }),
          NumberPairField.create({
            name: "dimY",
            label: "Y Dimension",
            occupedColumns: 6,
            schema: z
              .tuple([z.number(), z.number()])
              .refine(([left, right]) => left <= right, {
                message:
                  "The minimum dimension must be less than or equal to the maximum dimension",
              }),
            required: true,
            isFloat: true,
            info: {
              title: "The Y dimension of the simulation. (min, max)",
            },
          }),
        ]),
        new Line([
          CheckboxField.create({
            name: "connectivityEnabled",
            label: "Connectivity enabled",
            occupedColumns: 4,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, the simulation will consider connectivity between nodes.",
            },
          }),
          CheckboxField.create({
            name: "interferenceEnabled",
            label: "Interference enabled",
            occupedColumns: 4,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, the simulation will consider interference when transmitting messages.",
            },
          }),
          CheckboxField.create({
            name: "interferenceIsAdditive",
            label: "Interference is additive",
            occupedColumns: 4,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, interference can only increase when new packets are added to the air. (Async mode only)",
              helpText: (
                <>
                  <p>
                    <b>Only in asynchronous mode</b>
                  </p>
                  <p>
                    If this option is disabled, interference may change whenever
                    packets are added or removed from the air.
                  </p>
                  <p>
                    If this option is enabled, interference can only increase
                    when new packets are added to the air.
                  </p>
                </>
              ),
            },
          }),
        ]),
        new Line([
          CheckboxField.create({
            name: "nackMessagesEnabled",
            label: "NACK messages enabled",
            occupedColumns: 4,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, the simulation will generate NACK messages.",
            },
          }),
          CheckboxField.create({
            name: "shouldSaveTrace",
            label: "Save trace",
            occupedColumns: 4,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, the simulation will save the positions of all nodes in all times (only in synchronous mode).",
            },
          }),
          CheckboxField.create({
            name: "registerStatisticsForEveryRound",
            label: "Register statistics for every round",
            occupedColumns: 4,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, the simulation will mantain in memory statistics for every round, otherwise it will only mantain statistics for the last round.",
            },
          }),
        ]),
      ]),
      new Subsection(
        [
          new Line([
            CheckboxField.create({
              name: "useConsole",
              info: {
                title:
                  "If this option is enabled, the simulation will print logs of the simulation logger module in the console.",
              },
              label: "Use console",
              occupedColumns: 6,
              schema: z.boolean(),
            }),
          ]),
        ],
        "Logger Options",
        "loggerOptions",
      ),
    ],
  }),
  new ModelSection(ModelType.MessageTransmission),
]);
