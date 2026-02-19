import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .any()
    .optional()
    .refine((file) => !file || file.size < 5 * 1024 * 1024, {
      message: "Image must be less than 5MB",
    }),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
