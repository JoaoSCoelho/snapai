import z from "zod";

export const pingPongConfigSchema = z.object({
  initialColor: z.string(),
});

export type PingPongConfigSchema = z.infer<typeof pingPongConfigSchema>;
