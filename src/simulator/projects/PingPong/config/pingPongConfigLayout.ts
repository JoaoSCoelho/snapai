import { ColorField } from "@/simulator/configurations/layout/fields/ColorField";
import { Layout } from "@/simulator/configurations/layout/Layout";
import { Line } from "@/simulator/configurations/layout/Line";
import { Section } from "@/simulator/configurations/layout/Section";
import { Subsection } from "@/simulator/configurations/layout/Subsection";
import z from "zod";

export const pingPongConfigLayout = new Layout([
  Section.create({
    title: "Ping Pong Parameters",
    subsections: [
      new Subsection([
        new Line([
          ColorField.create({
            name: "initialColor",
            label: "Initial Color",
            occupedColumns: 12,
            info: {
              title: "Initial color of the nodes in the simulation",
            },
            required: true,
            schema: z.string(),
          }),
        ]),
      ]),
    ],
  }),
]);
