import type {
  AboutSection,
  ContactItem,
  ExperienceItem,
  ExperienceResponsibility,
  ExperienceTag,
  HeroButton,
  HeroSection,
  PortfolioContentInput,
  PortfolioImage,
  ProjectButton,
  ProjectItem,
  SkillCategory,
  SkillCertification,
} from '../types/portfolio-content';
import type { ValidationError, ValidationResult } from '../types/validation';

const MAX_TEXT_LENGTH = 5000;
const MAX_SHORT_TEXT_LENGTH = 255;
const MAX_ITEMS = 24;
const MDI_PATTERN = /^mdi-[a-z0-9-]+$/i;

const createValidationResult = <T>(value: T, errors: ValidationError[]): ValidationResult<T> => ({
  valid: errors.length === 0,
  value,
  errors,
});

const normalizeText = (value: unknown): string => String(value ?? '').trim();
const normalizeLongText = (value: unknown): string => String(value ?? '').trim();
const normalizeBoolean = (value: unknown): boolean => Boolean(value);

const isAbsoluteUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const isImageUrl = (value: string): boolean => {
  if (!value) {
    return false;
  }

  return value.startsWith('/') || isAbsoluteUrl(value);
};

const isLink = (value: string): boolean => {
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

const normalizeImage = (source: unknown, index: number, prefix: string): PortfolioImage => {
  const image = (source ?? {}) as Partial<PortfolioImage>;

  return {
    id: normalizeText(image.id) || `${prefix}-${index + 1}`,
    url: normalizeText(image.url),
    alt: normalizeText(image.alt) || `${prefix} image ${index + 1}`,
    displayOrder: index,
  };
};

const normalizeHeroButton = (source: unknown, index: number): HeroButton => {
  const button = (source ?? {}) as Partial<HeroButton>;

  return {
    id: normalizeText(button.id) || `hero-button-${index + 1}`,
    icon: normalizeText(button.icon),
    link: normalizeText(button.link),
    displayOrder: index,
  };
};

const normalizeCertification = (source: unknown, index: number): SkillCertification => {
  const certification = (source ?? {}) as Partial<SkillCertification>;

  return {
    id: normalizeText(certification.id) || `certification-${index + 1}`,
    title: normalizeText(certification.title),
    href: normalizeText(certification.href),
    date: normalizeText(certification.date),
    displayOrder: index,
  };
};

const normalizeSkillCategory = (source: unknown, index: number): SkillCategory => {
  const category = (source ?? {}) as Partial<SkillCategory>;

  return {
    id: normalizeText(category.id) || `skill-category-${index + 1}`,
    name: normalizeText(category.name),
    mdi: normalizeText(category.mdi),
    content: normalizeLongText(category.content),
    displayOrder: index,
  };
};

const normalizeProjectButton = (source: unknown): ProjectButton => {
  const button = (source ?? {}) as Partial<ProjectButton>;

  return {
    label: normalizeText(button.label),
    link: normalizeText(button.link),
  };
};

const normalizeProjectItem = (source: unknown, index: number): ProjectItem => {
  const project = (source ?? {}) as Partial<ProjectItem>;

  return {
    id: normalizeText(project.id) || `project-${index + 1}`,
    photo: normalizeText(project.photo),
    projectName: normalizeText(project.projectName),
    shortDescription: normalizeLongText(project.shortDescription),
    spaStatus: project.spaStatus === 'down' ? 'down' : 'live',
    apiStatus: project.apiStatus === 'down' ? 'down' : 'live',
    primaryButton: normalizeProjectButton(project.primaryButton),
    secondaryButtonEnabled: normalizeBoolean(project.secondaryButtonEnabled),
    secondaryButton: normalizeProjectButton(project.secondaryButton),
    modalContent: normalizeLongText(project.modalContent),
    displayOrder: index,
  };
};

const normalizeExperienceTag = (source: unknown, index: number): ExperienceTag => {
  const tag = (source ?? {}) as Partial<ExperienceTag>;

  return {
    id: normalizeText(tag.id) || `experience-tag-${index + 1}`,
    mdi: normalizeText(tag.mdi),
    text: normalizeText(tag.text),
    displayOrder: index,
  };
};

const normalizeExperienceResponsibility = (
  source: unknown,
  index: number,
): ExperienceResponsibility => {
  const responsibility = (source ?? {}) as Partial<ExperienceResponsibility>;

  return {
    id: normalizeText(responsibility.id) || `responsibility-${index + 1}`,
    title: normalizeText(responsibility.title),
    description: normalizeLongText(responsibility.description),
    displayOrder: index,
  };
};

const normalizeExperienceItem = (source: unknown, index: number): ExperienceItem => {
  const item = (source ?? {}) as Partial<ExperienceItem> & {
    tags?: unknown[];
    responsibilities?: unknown[];
  };

  return {
    id: normalizeText(item.id) || `experience-${index + 1}`,
    experienceTitle: normalizeText(item.experienceTitle),
    jobTitle: normalizeText(item.jobTitle),
    company: normalizeText(item.company),
    tags: Array.isArray(item.tags) ? item.tags.map((tag, tagIndex) => normalizeExperienceTag(tag, tagIndex)) : [],
    shortDescription: normalizeLongText(item.shortDescription),
    responsibilities: Array.isArray(item.responsibilities)
      ? item.responsibilities.map((responsibility, responsibilityIndex) =>
          normalizeExperienceResponsibility(responsibility, responsibilityIndex),
        )
      : [],
    displayOrder: index,
  };
};

const normalizeContactItem = (source: unknown, index: number): ContactItem => {
  const item = (source ?? {}) as Partial<ContactItem>;

  return {
    id: normalizeText(item.id) || `contact-${index + 1}`,
    mdi: normalizeText(item.mdi),
    text: normalizeText(item.text),
    link: normalizeText(item.link),
    displayOrder: index,
  };
};

export const normalizePortfolioContent = (source: unknown = {}): PortfolioContentInput => {
  const payload = (source ?? {}) as Record<string, unknown>;
  const hero = (payload.hero ?? {}) as Partial<HeroSection> & { heroButtons?: unknown[]; heroImages?: unknown[] };
  const about = (payload.about ?? {}) as Partial<AboutSection> & { images?: unknown[]; paragraphs?: unknown[] };
  const skills = (payload.skills ?? {}) as { certifications?: unknown[]; categories?: unknown[] };
  const projects = (payload.projects ?? {}) as { items?: unknown[] };
  const experience = (payload.experience ?? {}) as {
    photo?: { url?: unknown; alt?: unknown };
    items?: unknown[];
  };
  const education = (payload.education ?? {}) as {
    collegePhoto?: { url?: unknown; alt?: unknown };
    seniorHighPhoto?: { url?: unknown; alt?: unknown };
  };
  const contact = (payload.contact ?? {}) as { items?: unknown[] };

  const normalizedParagraphs = Array.isArray(about.paragraphs)
    ? about.paragraphs.slice(0, 3).map((paragraph) => normalizeLongText(paragraph))
    : [];

  while (normalizedParagraphs.length < 3) {
    normalizedParagraphs.push('');
  }

  return {
    hero: {
      jobTitle: normalizeText(hero.jobTitle),
      company: normalizeText(hero.company),
      description: normalizeLongText(hero.description),
      supportingText: normalizeLongText(hero.supportingText),
      heroButtons: Array.isArray(hero.heroButtons)
        ? hero.heroButtons.map((button, index) => normalizeHeroButton(button, index))
        : [],
      heroImages: Array.isArray(hero.heroImages)
        ? hero.heroImages.map((image, index) => normalizeImage(image, index, 'hero'))
        : [],
    },
    about: {
      paragraphs: normalizedParagraphs as [string, string, string],
      images: Array.isArray(about.images)
        ? about.images.map((image, index) => normalizeImage(image, index, 'about'))
        : [],
    },
    skills: {
      certifications: Array.isArray(skills.certifications)
        ? skills.certifications.map((item, index) => normalizeCertification(item, index))
        : [],
      categories: Array.isArray(skills.categories)
        ? skills.categories.map((item, index) => normalizeSkillCategory(item, index))
        : [],
    },
    projects: {
      items: Array.isArray(projects.items)
        ? projects.items.map((item, index) => normalizeProjectItem(item, index))
        : [],
    },
    experience: {
      photo: {
        url: normalizeText(experience.photo?.url),
        alt: normalizeText(experience.photo?.alt) || 'Experience photo',
      },
      items: Array.isArray(experience.items)
        ? experience.items.map((item, index) => normalizeExperienceItem(item, index))
        : [],
    },
    education: {
      collegePhoto: {
        url: normalizeText(education.collegePhoto?.url),
        alt: normalizeText(education.collegePhoto?.alt) || 'College graduation photo',
      },
      seniorHighPhoto: {
        url: normalizeText(education.seniorHighPhoto?.url),
        alt: normalizeText(education.seniorHighPhoto?.alt) || 'Senior high school photo',
      },
    },
    contact: {
      items: Array.isArray(contact.items)
        ? contact.items.map((item, index) => normalizeContactItem(item, index))
        : [],
    },
  };
};

const ensureRequiredText = (
  errors: ValidationError[],
  field: string,
  value: string,
  maxLength = MAX_TEXT_LENGTH,
): void => {
  if (!value) {
    errors.push({ field, message: `${field} is required.` });
    return;
  }

  if (value.length > maxLength) {
    errors.push({ field, message: `${field} must be ${maxLength} characters or fewer.` });
  }
};

const ensureOptionalText = (
  errors: ValidationError[],
  field: string,
  value: string,
  maxLength = MAX_TEXT_LENGTH,
): void => {
  if (value && value.length > maxLength) {
    errors.push({ field, message: `${field} must be ${maxLength} characters or fewer.` });
  }
};

const validateMdi = (errors: ValidationError[], field: string, value: string): void => {
  if (!value) {
    errors.push({ field, message: `${field} is required.` });
    return;
  }

  if (!MDI_PATTERN.test(value)) {
    errors.push({ field, message: `${field} must be a valid mdi icon class such as mdi-email-outline.` });
  }
};

const validateImage = (errors: ValidationError[], field: string, image: PortfolioImage | { url: string; alt: string }): void => {
  if (!image.url) {
    errors.push({ field: `${field}.url`, message: 'Image URL is required.' });
  } else if (!isImageUrl(image.url)) {
    errors.push({ field: `${field}.url`, message: 'Image URL must be a valid absolute URL or root-relative path.' });
  }

  ensureOptionalText(errors, `${field}.alt`, image.alt, MAX_SHORT_TEXT_LENGTH);
};

const validateButton = (errors: ValidationError[], field: string, button: ProjectButton): void => {
  ensureRequiredText(errors, `${field}.label`, button.label, MAX_SHORT_TEXT_LENGTH);

  if (!button.link) {
    errors.push({ field: `${field}.link`, message: 'Link is required.' });
  } else if (!isLink(button.link)) {
    errors.push({ field: `${field}.link`, message: 'Link must be a valid URL, mailto, tel, or root-relative path.' });
  }
};

const validateHeroSection = (errors: ValidationError[], hero: HeroSection): void => {
  ensureRequiredText(errors, 'hero.jobTitle', hero.jobTitle, MAX_SHORT_TEXT_LENGTH);
  ensureRequiredText(errors, 'hero.company', hero.company, MAX_SHORT_TEXT_LENGTH);
  ensureRequiredText(errors, 'hero.description', hero.description);
  ensureRequiredText(errors, 'hero.supportingText', hero.supportingText);

  if (hero.heroImages.length === 0) {
    errors.push({ field: 'hero.heroImages', message: 'At least one hero image is required.' });
  }

  if (hero.heroImages.length > MAX_ITEMS) {
    errors.push({ field: 'hero.heroImages', message: `A maximum of ${MAX_ITEMS} hero images is allowed.` });
  }

  if (hero.heroButtons.length > MAX_ITEMS) {
    errors.push({ field: 'hero.heroButtons', message: `A maximum of ${MAX_ITEMS} hero buttons is allowed.` });
  }

  hero.heroImages.forEach((image, index) => validateImage(errors, `hero.heroImages[${index}]`, image));

  hero.heroButtons.forEach((button, index) => {
    validateMdi(errors, `hero.heroButtons[${index}].icon`, button.icon);

    if (!button.link) {
      errors.push({ field: `hero.heroButtons[${index}].link`, message: 'Link is required.' });
    } else if (!isLink(button.link)) {
      errors.push({
        field: `hero.heroButtons[${index}].link`,
        message: 'Link must be a valid URL, mailto, tel, or root-relative path.',
      });
    }
  });
};

const validateAboutSection = (errors: ValidationError[], about: AboutSection): void => {
  if (about.paragraphs.length !== 3) {
    errors.push({ field: 'about.paragraphs', message: 'Exactly three about paragraphs are required.' });
  }

  about.paragraphs.forEach((paragraph, index) => {
    ensureRequiredText(errors, `about.paragraphs[${index}]`, paragraph);
  });

  if (about.images.length === 0) {
    errors.push({ field: 'about.images', message: 'At least one about image is required.' });
  }

  if (about.images.length > MAX_ITEMS) {
    errors.push({ field: 'about.images', message: `A maximum of ${MAX_ITEMS} about images is allowed.` });
  }

  about.images.forEach((image, index) => validateImage(errors, `about.images[${index}]`, image));
};

const validateSkillsSection = (errors: ValidationError[], skills: PortfolioContentInput['skills']): void => {
  if (skills.certifications.length > MAX_ITEMS) {
    errors.push({ field: 'skills.certifications', message: `A maximum of ${MAX_ITEMS} certifications is allowed.` });
  }

  if (skills.categories.length > MAX_ITEMS) {
    errors.push({ field: 'skills.categories', message: `A maximum of ${MAX_ITEMS} skill categories is allowed.` });
  }

  skills.certifications.forEach((certification, index) => {
    ensureRequiredText(errors, `skills.certifications[${index}].title`, certification.title, MAX_SHORT_TEXT_LENGTH);
    ensureRequiredText(errors, `skills.certifications[${index}].date`, certification.date, MAX_SHORT_TEXT_LENGTH);

    if (!certification.href) {
      errors.push({ field: `skills.certifications[${index}].href`, message: 'Certification link is required.' });
    } else if (!isLink(certification.href)) {
      errors.push({
        field: `skills.certifications[${index}].href`,
        message: 'Certification link must be a valid URL, mailto, tel, or root-relative path.',
      });
    }
  });

  skills.categories.forEach((category, index) => {
    ensureRequiredText(errors, `skills.categories[${index}].name`, category.name, MAX_SHORT_TEXT_LENGTH);
    validateMdi(errors, `skills.categories[${index}].mdi`, category.mdi);
    ensureRequiredText(errors, `skills.categories[${index}].content`, category.content);
  });
};

const validateProjectsSection = (errors: ValidationError[], projects: PortfolioContentInput['projects']): void => {
  if (projects.items.length > MAX_ITEMS) {
    errors.push({ field: 'projects.items', message: `A maximum of ${MAX_ITEMS} projects is allowed.` });
  }

  projects.items.forEach((project, index) => {
    if (!project.photo) {
      errors.push({ field: `projects.items[${index}].photo`, message: 'Project photo is required.' });
    } else if (!isImageUrl(project.photo)) {
      errors.push({
        field: `projects.items[${index}].photo`,
        message: 'Project photo must be a valid absolute URL or root-relative path.',
      });
    }

    ensureRequiredText(errors, `projects.items[${index}].projectName`, project.projectName, MAX_SHORT_TEXT_LENGTH);
    ensureRequiredText(errors, `projects.items[${index}].shortDescription`, project.shortDescription);
    ensureRequiredText(errors, `projects.items[${index}].modalContent`, project.modalContent);
    validateButton(errors, `projects.items[${index}].primaryButton`, project.primaryButton);

    if (project.secondaryButtonEnabled) {
      validateButton(errors, `projects.items[${index}].secondaryButton`, project.secondaryButton);
    }
  });
};

const validateExperienceSection = (errors: ValidationError[], experience: PortfolioContentInput['experience']): void => {
  validateImage(errors, 'experience.photo', experience.photo);

  if (experience.items.length > MAX_ITEMS) {
    errors.push({ field: 'experience.items', message: `A maximum of ${MAX_ITEMS} experiences is allowed.` });
  }

  experience.items.forEach((item, index) => {
    ensureRequiredText(errors, `experience.items[${index}].experienceTitle`, item.experienceTitle, MAX_SHORT_TEXT_LENGTH);
    ensureRequiredText(errors, `experience.items[${index}].jobTitle`, item.jobTitle, MAX_SHORT_TEXT_LENGTH);
    ensureRequiredText(errors, `experience.items[${index}].company`, item.company, MAX_SHORT_TEXT_LENGTH);
    ensureRequiredText(errors, `experience.items[${index}].shortDescription`, item.shortDescription);

    if (item.tags.length > MAX_ITEMS) {
      errors.push({ field: `experience.items[${index}].tags`, message: `A maximum of ${MAX_ITEMS} tags is allowed.` });
    }

    item.tags.forEach((tag, tagIndex) => {
      validateMdi(errors, `experience.items[${index}].tags[${tagIndex}].mdi`, tag.mdi);
      ensureRequiredText(errors, `experience.items[${index}].tags[${tagIndex}].text`, tag.text, MAX_SHORT_TEXT_LENGTH);
    });

    if (item.responsibilities.length > MAX_ITEMS) {
      errors.push({
        field: `experience.items[${index}].responsibilities`,
        message: `A maximum of ${MAX_ITEMS} responsibilities is allowed.`,
      });
    }

    item.responsibilities.forEach((responsibility, responsibilityIndex) => {
      ensureRequiredText(
        errors,
        `experience.items[${index}].responsibilities[${responsibilityIndex}].title`,
        responsibility.title,
        MAX_SHORT_TEXT_LENGTH,
      );
      ensureRequiredText(
        errors,
        `experience.items[${index}].responsibilities[${responsibilityIndex}].description`,
        responsibility.description,
      );
    });
  });
};

const validateEducationSection = (errors: ValidationError[], education: PortfolioContentInput['education']): void => {
  validateImage(errors, 'education.collegePhoto', education.collegePhoto);
  validateImage(errors, 'education.seniorHighPhoto', education.seniorHighPhoto);
};

const validateContactSection = (errors: ValidationError[], contact: PortfolioContentInput['contact']): void => {
  if (contact.items.length > MAX_ITEMS) {
    errors.push({ field: 'contact.items', message: `A maximum of ${MAX_ITEMS} contacts is allowed.` });
  }

  contact.items.forEach((item, index) => {
    validateMdi(errors, `contact.items[${index}].mdi`, item.mdi);
    ensureRequiredText(errors, `contact.items[${index}].text`, item.text, MAX_SHORT_TEXT_LENGTH);

    if (!item.link) {
      errors.push({ field: `contact.items[${index}].link`, message: 'Contact link is required.' });
    } else if (!isLink(item.link)) {
      errors.push({
        field: `contact.items[${index}].link`,
        message: 'Contact link must be a valid URL, mailto, tel, or root-relative path.',
      });
    }
  });
};

export const validatePortfolioContentBody = (
  source: unknown = {},
): ValidationResult<PortfolioContentInput> => {
  const value = normalizePortfolioContent(source);
  const errors: ValidationError[] = [];

  validateHeroSection(errors, value.hero);
  validateAboutSection(errors, value.about);
  validateSkillsSection(errors, value.skills);
  validateProjectsSection(errors, value.projects);
  validateExperienceSection(errors, value.experience);
  validateEducationSection(errors, value.education);
  validateContactSection(errors, value.contact);

  return createValidationResult(value, errors);
};
