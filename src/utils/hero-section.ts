import { normalizeHeroSection, validateHeroSectionBody } from '../validators/hero-section.validator';

export const validateHeroSection = (source: unknown): string => {
  const result = validateHeroSectionBody(source);
  return result.valid ? '' : result.errors[0]?.message ?? 'Validation failed.';
};

export { normalizeHeroSection, validateHeroSectionBody };
