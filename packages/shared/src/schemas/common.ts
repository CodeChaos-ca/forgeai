import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

export const sortSchema = z.object({
  sortBy: z.string().max(100).optional(),
  sortDirection: z.enum(['asc', 'desc']).default('desc')
});

export const filterSchema = z.record(
  z.union([
    z.string().max(1000),
    z.number(),
    z.boolean(),
    z.array(z.string().max(1000)).max(100)
  ])
).optional();

export const dateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date()
}).refine(data => data.to >= data.from, {
  message: "End date must be after or equal to start date",
  path: ["to"]
});
