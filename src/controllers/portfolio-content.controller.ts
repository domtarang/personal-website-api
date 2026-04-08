import type { RequestHandler } from 'express';
import * as portfolioContentService from '../services/portfolio-content.service';
import type { PortfolioContentInput } from '../types/portfolio-content';

export const getPortfolioContent: RequestHandler = async (_req, res) => {
  const portfolioContent = await portfolioContentService.getPortfolioContent();

  res.status(200).json({
    data: portfolioContent,
  });
};

export const updatePortfolioContent: RequestHandler = async (req, res) => {
  const savedPortfolioContent = await portfolioContentService.savePortfolioContent(
    req.body as PortfolioContentInput,
  );

  res.status(200).json({
    message: 'Portfolio content updated successfully.',
    data: savedPortfolioContent,
  });
};
