import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  service: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  sourcePage: z.string().optional(),
});

export const trackOrderSchema = z.object({
  orderNumber: z.string().min(3, 'Please enter a valid order number (e.g. EGX-1001)'),
});

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  candidateName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone number is required'),
  coverLetter: z.string().optional(),
  portfolioUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  linkedInUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  gitHubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  experienceYears: z.string().optional(),
  resumeText: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const serviceSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  shortDesc: z.string().min(5, 'Short description is required'),
  fullDesc: z.string().min(10, 'Full description is required'),
  category: z.string().default('Engineering'),
  icon: z.string().default('Code'),
  featuresJson: z.string().or(z.array(z.string())).optional(),
  techStackJson: z.string().or(z.array(z.string())).optional(),
  processJson: z.string().or(z.array(z.string())).optional(),
  faqsJson: z.string().optional(),
  order: z.number().default(0),
  isFeatured: z.boolean().default(false),
  status: z.string().default('PUBLISHED'),
});

export const solutionSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  tagline: z.string().optional(),
  shortDesc: z.string().min(5, 'Short description is required'),
  fullDesc: z.string().min(10, 'Full description is required'),
  featuresJson: z.string().or(z.array(z.string())).optional(),
  techStackJson: z.string().or(z.array(z.string())).optional(),
  pricingModel: z.string().optional(),
  status: z.string().default('PUBLISHED'),
});

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  clientName: z.string().min(2, 'Client name is required'),
  industry: z.string().min(2, 'Industry is required'),
  shortDesc: z.string().min(5, 'Short description is required'),
  challenge: z.string().min(5, 'Challenge description is required'),
  solution: z.string().min(5, 'Solution description is required'),
  resultsJson: z.string().or(z.array(z.string())).optional(),
  techStackJson: z.string().or(z.array(z.string())).optional(),
  status: z.string().default('PUBLISHED'),
});
