import z from "zod";
import { TextField } from "../layout/fields/TextField";
import { Layout } from "../layout/Layout";
import { Section } from "../layout/Section";
import { Subsection } from "../layout/Subsection";
import { Line } from "../layout/Line";

export const SimulatorConfigLayout = new Layout([
  new Section("Simulator Parameters", [
    new Subsection([
      new Line([
        TextField.create({
          name: "projectsPath",
          label: "Projects Path",
          occupedColumns: 4,
          required: true,
          schema: z.string(),
          info: { title: "Path where is located your projects" },
        }),
        TextField.create({
          name: "defaultsPath",
          label: "Defaults Path",
          occupedColumns: 4,
          required: true,
          schema: z.string(),
          info: {
            title:
              "Path where is located the default implementations of models and nodes",
          },
        }),
        TextField.create({
          name: "modelsPath",
          label: "Models Path",
          occupedColumns: 4,
          required: true,
          schema: z.string(),
          info: {
            title:
              "Path where is located the abstractions of models, nodes, ...",
          },
        }),
      ]),
    ]),
  ]),
]);
