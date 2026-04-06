export interface HeroButton {
  id: string;
  icon: string;
  link: string;
  displayOrder: number;
}

export interface HeroImage {
  id: string;
  url: string;
  alt: string;
  displayOrder: number;
}

export interface HeroSection {
  jobTitle: string;
  company: string;
  description: string;
  supportingText: string;
  heroButtons: HeroButton[];
  heroImages: HeroImage[];
  updatedAt?: string;
}

export type HeroSectionInput = Omit<HeroSection, 'updatedAt'>;

export interface HeroSectionRow {
  id: number;
  job_title: string;
  company: string;
  description: string;
  supporting_text: string;
  updated_at: string | Date;
}

export interface HeroSectionImageRow {
  id: number;
  image_url: string;
  alt_text: string | null;
  display_order: number;
}

export interface HeroSectionButtonRow {
  id: number;
  icon: string;
  link: string;
  display_order: number;
}
