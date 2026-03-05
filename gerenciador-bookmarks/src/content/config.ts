import { defineCollection, z } from 'astro:content';

const links = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    link: z.string().url(),
    description: z.string().optional().default(''),
    createdAt: z.string().datetime(),
    tags: z.array(z.string()).default([]),
    favicon: z.string().optional().default(''),
    ogthumb: z.string().optional().default(''),
    creator: z.string().default('admin'),
    favorite: z.boolean().default(false),
    bundles: z.array(z.string()).default([]),
  }),
});

export const collections = { links };
