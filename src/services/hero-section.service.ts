import { withTransaction } from '../config/database';
import HttpError from '../utils/http-error';
import * as heroRepository from '../repositories/hero-section.repository';
import type { HeroSection, HeroSectionInput } from '../types/hero-section';

export const getHeroSection = async (): Promise<HeroSection> => {
  const heroSection = await heroRepository.readHeroSection();

  if (!heroSection) {
    throw HttpError.notFound('Hero section not found. Run the schema seed first.');
  }

  return heroSection;
};

export const updateHeroSection = async (payload: HeroSectionInput): Promise<HeroSection | null> => {
  return withTransaction(async (client) => {
    const existingHeroSection = await heroRepository.findFirstHeroSectionRow(client, true);

    let heroSectionId = existingHeroSection?.id ?? null;

    if (heroSectionId) {
      await heroRepository.updateHeroSectionCore({ ...payload, heroSectionId }, client);
    } else {
      heroSectionId = await heroRepository.createHeroSection(payload, client);
    }

    await heroRepository.replaceHeroButtons(
      {
        heroSectionId,
        buttons: payload.heroButtons,
      },
      client,
    );

    await heroRepository.replaceHeroImages(
      {
        heroSectionId,
        images: payload.heroImages,
      },
      client,
    );

    return heroRepository.readHeroSection(client);
  });
};
