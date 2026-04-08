export interface OrderedItem {
  id: string;
  displayOrder: number;
}

export interface PortfolioImage extends OrderedItem {
  url: string;
  alt: string;
}

export interface HeroButton extends OrderedItem {
  icon: string;
  link: string;
}

export interface AboutSection {
  paragraphs: [string, string, string];
  images: PortfolioImage[];
}

export interface SkillCertification extends OrderedItem {
  title: string;
  href: string;
  date: string;
}

export interface SkillCategory extends OrderedItem {
  name: string;
  mdi: string;
  content: string;
}

export interface SkillsSection {
  certifications: SkillCertification[];
  categories: SkillCategory[];
}

export type ProjectStatus = 'live' | 'down';

export interface ProjectButton {
  label: string;
  link: string;
}

export interface ProjectItem extends OrderedItem {
  photo: string;
  projectName: string;
  shortDescription: string;
  spaStatus: ProjectStatus;
  apiStatus: ProjectStatus;
  primaryButton: ProjectButton;
  secondaryButtonEnabled: boolean;
  secondaryButton: ProjectButton;
  modalContent: string;
}

export interface ExperienceTag extends OrderedItem {
  mdi: string;
  text: string;
}

export interface ExperienceResponsibility extends OrderedItem {
  title: string;
  description: string;
}

export interface ExperienceItem extends OrderedItem {
  experienceTitle: string;
  jobTitle: string;
  company: string;
  tags: ExperienceTag[];
  shortDescription: string;
  responsibilities: ExperienceResponsibility[];
}

export interface ExperienceSection {
  photo: {
    url: string;
    alt: string;
  };
  items: ExperienceItem[];
}

export interface EducationSection {
  collegePhoto: {
    url: string;
    alt: string;
  };
  seniorHighPhoto: {
    url: string;
    alt: string;
  };
}

export interface ContactItem extends OrderedItem {
  mdi: string;
  text: string;
  link: string;
}

export interface HeroSection {
  jobTitle: string;
  company: string;
  description: string;
  supportingText: string;
  heroButtons: HeroButton[];
  heroImages: PortfolioImage[];
}

export interface PortfolioContent {
  hero: HeroSection;
  about: AboutSection;
  skills: SkillsSection;
  projects: {
    items: ProjectItem[];
  };
  experience: ExperienceSection;
  education: EducationSection;
  contact: {
    items: ContactItem[];
  };
  updatedAt?: string;
}

export type PortfolioContentInput = Omit<PortfolioContent, 'updatedAt'>;

export interface PortfolioContentRow {
  id: number;
  content: PortfolioContentInput;
  updated_at: string | Date;
}
