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
import { NumberField } from "../layout/fields/NumberField";
import { DependentSection } from "../layout/DependentSection";

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
            occupedColumns: 4,
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
            occupedColumns: 4,
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
          NumberPairField.create({
            name: "dimZ",
            label: "Z Dimension",
            occupedColumns: 4,
            schema: z
              .tuple([z.number(), z.number()])
              .refine(([left, right]) => left <= right, {
                message:
                  "The minimum dimension must be less than or equal to the maximum dimension",
              }),
            required: true,
            isFloat: true,
            info: {
              title: "The Z dimension of the simulation. (min, max)",
            },
            disabled: true, // TODO: Add support for 3D
          }),
        ]),
        new Line([
          CheckboxField.create({
            name: "connectivityEnabled",
            label: "Connectivity enabled",
            occupedColumns: 3,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, the simulation will consider connectivity between nodes.",
            },
          }),
          CheckboxField.create({
            name: "interferenceEnabled",
            label: "Interference enabled",
            occupedColumns: 3,
            schema: z.boolean(),
            info: {
              title:
                "If this option is enabled, the simulation will consider interference when transmitting messages.",
            },
          }),
        ]),
        new Line([
          NumberField.create({
            name: "maxConnectionRadius",
            label: "Max connection radius",
            isFloat: true,
            min: 0,
            required: false,
            schema: z.number().min(0).optional(),
            occupedColumns: 4,
            info: {
              title:
                "The maximum distance between two nodes that the simulator will test for connectivity.",
            },
          }),
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
  DependentSection.create({
    subsections: [],
    dependencies: ["isAsynchronous"],
    builders: new Map([
      [
        "isAsynchronous",
        (value: boolean) => {
          if (value) {
            return [
              new Subsection(
                [
                  new Line([
                    CheckboxField.create({
                      name: "interferenceIsAdditive",
                      label: "Interference is additive",
                      occupedColumns: 4,
                      schema: z.boolean(),
                      info: {
                        title:
                          "If this option is enabled, interference can only increase when new packets are added to the air.",
                        helpText: (
                          <>
                            <p>
                              If this option is disabled, interference may
                              change whenever packets are added or removed from
                              the air.
                            </p>
                            <p>
                              If this option is enabled, interference can only
                              increase when new packets are added to the air.
                            </p>
                          </>
                        ),
                      },
                    }),
                    CheckboxField.create({
                      name: "connectOnAddNodes",
                      label: "Evaluate connections when nodes are added",
                      occupedColumns: 4,
                      schema: z.boolean(),
                      info: {
                        title:
                          "If this option is enabled, the simulation will evaluate connections when new nodes are added to the simulation.",
                      },
                    }),
                  ]),
                ],
                "Asynchronous Mode Options",
              ),
            ];
          } else {
            return [
              new Subsection(
                [
                  new Line([
                    CheckboxField.create({
                      name: "shouldSaveTrace",
                      label: "Save trace",
                      occupedColumns: 4,
                      schema: z.boolean(),
                      info: {
                        title:
                          "If this option is enabled, the simulation will save the positions of all nodes in every rounds.",
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
                    CheckboxField.create({
                      name: "mobilityEnabled",
                      label: "Mobility enabled",
                      occupedColumns: 4,
                      schema: z.boolean(),
                      info: {
                        title:
                          "If this option is enabled, the simulation will apply mobility to the nodes.",
                      },
                    }),
                  ]),
                ],
                "Synchronous Mode Options",
              ),
            ];
          }
        },
      ],
    ]),
  }),
  new ModelSection(ModelType.MessageTransmission),
]);
