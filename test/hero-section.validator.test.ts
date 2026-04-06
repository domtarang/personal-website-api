import test from 'node:test';
import assert from 'node:assert/strict';
import { validateHeroSectionBody } from '../src/validators/hero-section.validator';

const validPayload = {
  jobTitle: 'Backend Developer',
  company: 'Petnet',
  description: 'Builds reliable backend services.',
  supportingText: 'Get in touch.',
  heroButtons: [{ icon: 'mdi-linkedin', link: 'https://linkedin.com/in/example' }],
  heroImages: [{ url: '/hero-images/hero-1.png', alt: 'Hero image' }],
};

test('validateHeroSectionBody accepts a valid payload', () => {
  const result = validateHeroSectionBody(validPayload);

  assert.equal(result.valid, true);
  assert.equal(result.value.heroImages[0]?.displayOrder, 0);
});

test('validateHeroSectionBody requires at least one image', () => {
  const result = validateHeroSectionBody({
    ...validPayload,
    heroImages: [],
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.field === 'heroImages'));
});

test('validateHeroSectionBody rejects invalid button links', () => {
  const result = validateHeroSectionBody({
    ...validPayload,
    heroButtons: [{ icon: 'mdi-linkedin', link: 'javascript:alert(1)' }],
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.field === 'heroButtons[0].link'));
});
