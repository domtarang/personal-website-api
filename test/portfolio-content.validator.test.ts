import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePortfolioContentBody } from '../src/validators/portfolio-content.validator';

const validPayload = {
  hero: {
    jobTitle: 'Backend Developer',
    company: 'Petnet',
    description: 'Builds reliable backend services.',
    supportingText: 'Get in touch.',
    heroButtons: [{ icon: 'mdi-linkedin', link: 'https://linkedin.com/in/example' }],
    heroImages: [{ url: '/hero-images/hero-1.png', alt: 'Hero image' }],
  },
  about: {
    paragraphs: ['First', 'Second', 'Third'],
    images: [{ url: '/about-images/about-1.jpg', alt: 'About image' }],
  },
  skills: {
    certifications: [{ title: 'Cert', href: 'https://example.com/cert', date: '2024' }],
    categories: [{ name: 'Backend', mdi: 'mdi-server-outline', content: 'Node.js, Express.js' }],
  },
  projects: {
    items: [{
      photo: '/project-images/project-1.png',
      projectName: 'Project One',
      shortDescription: 'Short description',
      spaStatus: 'live',
      apiStatus: 'down',
      primaryButton: { label: 'Open', link: 'https://example.com' },
      secondaryButtonEnabled: false,
      secondaryButton: { label: '', link: '' },
      modalContent: 'More details here.',
    }],
  },
  experience: {
    photo: { url: '/experience-images/experience.jpg', alt: 'Experience photo' },
    items: [{
      experienceTitle: 'Professional Experience',
      jobTitle: 'Backend Developer',
      company: 'Petnet',
      tags: [{ mdi: 'mdi-calendar-range', text: '2025 - Present' }],
      shortDescription: 'Leading backend work.',
      responsibilities: [{ title: 'Build features', description: 'Ship new features.' }],
    }],
  },
  education: {
    collegePhoto: { url: '/education-images/college.jpg', alt: 'College' },
    seniorHighPhoto: { url: '/education-images/shs.jpg', alt: 'SHS' },
  },
  contact: {
    items: [{ mdi: 'mdi-email-outline', text: 'me@example.com', link: 'mailto:me@example.com' }],
  },
};

test('validatePortfolioContentBody accepts a valid payload', () => {
  const result = validatePortfolioContentBody(validPayload);

  assert.equal(result.valid, true);
  assert.equal(result.value.about.paragraphs.length, 3);
  assert.equal(result.value.hero.heroImages[0]?.displayOrder, 0);
});

test('validatePortfolioContentBody requires three about paragraphs', () => {
  const result = validatePortfolioContentBody({
    ...validPayload,
    about: {
      ...validPayload.about,
      paragraphs: ['Only one'],
    },
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.field === 'about.paragraphs[1]'));
});

test('validatePortfolioContentBody rejects invalid project primary button links', () => {
  const result = validatePortfolioContentBody({
    ...validPayload,
    projects: {
      items: [{
        ...validPayload.projects.items[0],
        primaryButton: { label: 'Open', link: 'javascript:alert(1)' },
      }],
    },
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.field === 'projects.items[0].primaryButton.link'));
});
