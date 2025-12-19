import { AngleField } from "@/simulator/configurations/layout/fields/AngleField";
import { AnglePairField } from "@/simulator/configurations/layout/fields/AnglePairField";
import { CheckboxField } from "@/simulator/configurations/layout/fields/CheckboxField";
import { ColorField } from "@/simulator/configurations/layout/fields/ColorField";
import { NumberPairField } from "@/simulator/configurations/layout/fields/NumberPairField";
import { TextField } from "@/simulator/configurations/layout/fields/TextField";
import { Line } from "@/simulator/configurations/layout/Line";
import { ParametersSubsection } from "@/simulator/configurations/layout/ParametersSubsection";
import { MessageTransmissionModel } from "@/simulator/models/MessageTransmissionModel";
import { Packet } from "@/simulator/models/Packet";
import { Simulation } from "@/simulator/models/Simulation";
import { AngleUnit } from "@/simulator/utils/types";
import z from "zod";

export type TestMessageTransmissionModelParameters = {
  name: string;
  numberPair: [number, number];
  checkbox: boolean;
  angle: number;
  color: string;
  anglePair: [number, number];
};

export class TestMessageTransmissionModel extends MessageTransmissionModel {
  public name = "Test Message Transmission";

  public constructor(
    public readonly parameters: TestMessageTransmissionModelParameters,
    protected readonly simulation: Simulation,
  ) {
    super(parameters, simulation);
  }

  public timeToReach(packet: Packet): number {
    return 1;
  }

  public static getParametersSubsection(): ParametersSubsection | undefined {
    return ParametersSubsection.create({
      lines: [
        new Line([
          TextField.create({
            name: "name",
            label: "Name",
            occupedColumns: 4,
            required: true,
            schema: z.string().min(15).max(20),
            minLength: 10,
            maxLength: 25,
            info: {
              title: "Name",
              helpText: "The name of the message transmission model.",
            },
          }),
          NumberPairField.create({
            name: "numberPair",
            label: "Number Pair",
            occupedColumns: 8,
            isFloat: true,
            required: true,
            schema: z.tuple([z.number().min(50000), z.number()]),
            info: { title: "Number Pair", helpText: "The number pair." },
          }),
        ]),
        new Line([
          CheckboxField.create({
            name: "checkbox",
            label: "Checkbox",
            occupedColumns: 3,
            schema: z.literal(true),
            info: { title: "Checkbox", helpText: "The checkbox." },
          }),
          AngleField.create({
            name: "angle",
            label: "Angle",
            occupedColumns: 3,
            required: true,
            isFloat: false,
            angleUnit: AngleUnit.RAD,
            info: { title: "Angle", helpText: "The angle." },
            schema: z
              .number()
              .min(0)
              .max(2 * Math.PI),
            min: -1.57,
            max: 3 * Math.PI,
          }),
          ColorField.create({
            name: "color",
            label: "Color",
            occupedColumns: 2,
            required: true,
            info: { title: "Color", helpText: "The color." },
            schema: z.string().min(7).max(7),
          }),
          AnglePairField.create({
            name: "anglePair",
            label: "Angle Pair",
            isFloat: true,
            angleUnit: AngleUnit.DEG,
            required: true,
            occupedColumns: 4,
            schema: z.tuple([
              z.number().min(-180).max(180),
              z.number().min(-180).max(180),
            ]),
            info: {
              title: "Angle Pair",
              helpText: (
                <>
                  The angle <span className="text-red-500">pair.</span>
                </>
              ),
            },
          }),
        ]),
      ],
    });
  }
}
