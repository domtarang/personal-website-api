import type { RequestHandler } from 'express';
import * as heroSectionService from '../services/hero-section.service';
import type { HeroSectionInput } from '../types/hero-section';

export const getHeroSection: RequestHandler = async (_req, res) => {
  const heroSection = await heroSectionService.getHeroSection();

  res.status(200).json({
    data: heroSection,
  });
};

export const updateHeroSection: RequestHandler = async (req, res) => {
  const savedHeroSection = await heroSectionService.updateHeroSection(req.body as HeroSectionInput);

  res.status(200).json({
    message: 'Hero section updated successfully.',
    data: savedHeroSection,
  });
};
