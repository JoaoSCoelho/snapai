import z from "zod";

export const testProjectConfigSchema = z.object({
  mobilityModel: z.string(),
  mobilityModelParameters: z.record(z.string(), z.any()),
  messageTransmissionModel: z.string(),
  messageTransmissionModelParameters: z.record(z.string(), z.any()),
});

export type TestProjectConfigSchema = z.infer<typeof testProjectConfigSchema>;
