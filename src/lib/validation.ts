import { z } from "zod";

export const ticketSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  status: z.enum(["open", "in_progress", "closed"] as const)
    .refine((val) => ["open", "in_progress", "closed"].includes(val), {
      message: "Status must be 'open', 'in_progress', or 'closed'",
    }),
  priority: z.enum(["low", "medium", "high"] as const)
    .refine((val) => ["low", "medium", "high"].includes(val), {
      message: "Priority must be 'low', 'medium', or 'high'",
    }),
  userId: z.string().min(1, "User ID is required"),
});

export type TicketFormData = z.infer<typeof ticketSchema>;

export type ValidationError = {
  [K in keyof TicketFormData]?: string[];
};

export const validateTicket = (data: Partial<TicketFormData>): ValidationError => {
  try {
    ticketSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationError = {};
      error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof TicketFormData;
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path]?.push(issue.message);
      });
      return errors;
    }
    return {};
  }
};