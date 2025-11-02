import z from "zod";

export const pingPongConfigSchema = z.object({});

export type PingPongConfigSchema = z.infer<typeof pingPongConfigSchema>;
