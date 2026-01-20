import { z } from 'zod';

export const SopSchema = z.object({
  id: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
  // Tools that should be highlighted/available in the sidebar for this SOP
  required_tools: z.array(z.enum(['calculator', 'admin-panel', 'telegram', 'script-copy'])).optional(),
  difficulty: z.enum(['trainee', 'junior', 'senior']),
  last_updated: z.date(),
  ai_actionable: z.boolean().default(false),
});

export const TrainingModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  estimated_minutes: z.number(),
});

export type Sop = z.infer<typeof SopSchema>;
export type TrainingModule = z.infer<typeof TrainingModuleSchema>;
