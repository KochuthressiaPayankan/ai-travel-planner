import { z } from "zod";

export const TripSchema = z.object({
    destination: z.string(),
    summary: z.string(),
    currency: z.string(),
    days: z.array(
        z.object({
            day: z.number(),
            theme: z.string(),
            activities: z.array(
                z.object({
                    time: z.string(),
                    name: z.string(),
                    description: z.string(),
                    estimatedCost: z.number(),
                })
            ),
            restaurants: z.array(
                z.object({
                    name: z.string(),
                    cuisine: z.string(),
                    mealType: z.string(),
                    estimatedCost: z.number(),
                })
            ),
        })
    ),
});

export type Trip = z.infer<typeof TripSchema>;