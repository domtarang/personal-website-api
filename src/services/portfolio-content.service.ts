import { withTransaction } from '../config/database';
import HttpError from '../utils/http-error';
import * as portfolioRepository from '../repositories/portfolio-content.repository';
import type { PortfolioContent, PortfolioContentInput } from '../types/portfolio-content';

export const getPortfolioContent = async (): Promise<PortfolioContent> => {
  const portfolioContent = await portfolioRepository.readPortfolioContent();

  if (!portfolioContent) {
    throw HttpError.notFound('Portfolio content not found. Run the schema seed first.');
  }

  return portfolioContent;
};

export const savePortfolioContent = async (
  payload: PortfolioContentInput,
): Promise<PortfolioContent | null> => {
  return withTransaction(async (client) => {
    const existingPortfolioContent = await portfolioRepository.findFirstPortfolioContentRow(client, true);

    if (existingPortfolioContent?.id) {
      await portfolioRepository.updatePortfolioContent(existingPortfolioContent.id, payload, client);
    } else {
      await portfolioRepository.createPortfolioContent(payload, client);
    }

    return portfolioRepository.readPortfolioContent(client);
  });
};
