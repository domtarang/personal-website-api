import type { HeroSectionInput } from '../types/hero-section';
import type { ValidationError, ValidationResult } from '../types/validation';

const MAX_TEXT_LENGTH = 5000;
const MAX_ITEMS = 8;
const ICON_PATTERN = /^[a-z0-9:-]+$/i;

const isAbsoluteUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const isValidLink = (value: string): boolean => {
  if (!value) {
    return false;
  }

  if (value.startsWith('/')) {
    return true;
  }

  if (value.startsWith('mailto:') || value.startsWith('tel:')) {
    return true;
  }

  return isAbsoluteUrl(value);
};

const createValidationResult = <T>(value: T, errors: ValidationError[]): ValidationResult<T> => ({
  valid: errors.length === 0,
  value,
  errors,
});

export const normalizeHeroSection = (source: unknown = {}): HeroSectionInput => {
  const payload = source as Partial<HeroSectionInput>;
  const heroButtons = Array.isArray(payload.heroButtons) ? payload.heroButtons : [];
  const heroImages = Array.isArray(payload.heroImages) ? payload.heroImages : [];

  return {
    jobTitle: String(payload.jobTitle ?? '').trim(),
    company: String(payload.company ?? '').trim(),
    description: String(payload.description ?? '').trim(),
    supportingText: String(payload.supportingText ?? '').trim(),
    heroButtons: heroButtons.map((button, index) => ({
      id: String(button?.id ?? `hero-button-${index + 1}`).trim(),
      icon: String(button?.icon ?? '').trim(),
      link: String(button?.link ?? '').trim(),
      displayOrder: index,
    })),
    heroImages: heroImages.map((image, index) => ({
      id: String(image?.id ?? `hero-${index + 1}`).trim(),
      url: String(image?.url ?? '').trim(),
      alt: String(image?.alt ?? `Hero image ${index + 1}`).trim(),
      displayOrder: index,
    })),
  };
};

export const validateHeroSectionBody = (
  source: unknown = {},
): ValidationResult<HeroSectionInput> => {
  const value = normalizeHeroSection(source);
  const errors: ValidationError[] = [];

  const requiredFields: Array<keyof Pick<HeroSectionInput, 'jobTitle' | 'company' | 'description' | 'supportingText'>> = [
    'jobTitle',
    'company',
    'description',
    'supportingText',
  ];

  for (const field of requiredFields) {
    if (!value[field]) {
      errors.push({ field, message: `${field} is required.` });
      continue;
    }

    if (value[field].length > MAX_TEXT_LENGTH) {
      errors.push({
        field,
        message: `${field} must be ${MAX_TEXT_LENGTH} characters or fewer.`,
      });
    }
  }

  if (value.heroImages.length === 0) {
    errors.push({ field: 'heroImages', message: 'At least one hero image is required.' });
  }

  if (value.heroImages.length > MAX_ITEMS) {
    errors.push({
      field: 'heroImages',
      message: `A maximum of ${MAX_ITEMS} hero images is allowed.`,
    });
  }

  if (value.heroButtons.length > MAX_ITEMS) {
    errors.push({
      field: 'heroButtons',
      message: `A maximum of ${MAX_ITEMS} hero buttons is allowed.`,
    });
  }

  value.heroImages.forEach((image, index) => {
    if (!image.url) {
      errors.push({ field: `heroImages[${index}].url`, message: 'Image URL is required.' });
    } else if (!isValidLink(image.url)) {
      errors.push({
        field: `heroImages[${index}].url`,
        message: 'Image URL must be a valid absolute URL or root-relative path.',
      });
    }

    if (image.alt.length > 255) {
      errors.push({
        field: `heroImages[${index}].alt`,
        message: 'Image alt text must be 255 characters or fewer.',
      });
    }
  });

  value.heroButtons.forEach((button, index) => {
    if (!button.icon) {
      errors.push({ field: `heroButtons[${index}].icon`, message: 'Button icon is required.' });
    } else if (!ICON_PATTERN.test(button.icon)) {
      errors.push({
        field: `heroButtons[${index}].icon`,
        message: 'Button icon contains invalid characters.',
      });
    }

    if (!button.link) {
      errors.push({ field: `heroButtons[${index}].link`, message: 'Button link is required.' });
    } else if (!isValidLink(button.link)) {
      errors.push({
        field: `heroButtons[${index}].link`,
        message: 'Button link must be a valid URL, mailto, tel, or root-relative path.',
      });
    }
  });

  return createValidationResult(value, errors);
};
