import { z, ZodType } from "zod";

export class TesValidation {
  static readonly CREATE: ZodType = z.object({
    field1: z.string().min(1, { message: "Field1 wajib diisi" }),
    field2: z.number().optional(),
  });
}
