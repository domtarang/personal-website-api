import { query } from '../config/database';
import type { QueryRunner } from '../types/database';
import type { PortfolioContent, PortfolioContentInput, PortfolioContentRow } from '../types/portfolio-content';

const defaultRunner: QueryRunner = { query };

const toIsoString = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

const mapPortfolioContent = (row: PortfolioContentRow): PortfolioContent => ({
  ...row.content,
  updatedAt: toIsoString(row.updated_at),
});

export const findFirstPortfolioContentRow = async (
  runner: QueryRunner = defaultRunner,
  forUpdate = false,
): Promise<PortfolioContentRow | null> => {
  const result = await runner.query<PortfolioContentRow>(
    `SELECT id, content, updated_at
     FROM portfolio_contents
     ORDER BY id ASC
     LIMIT 1${forUpdate ? ' FOR UPDATE' : ''}`,
  );

  return result.rows[0] ?? null;
};

export const readPortfolioContent = async (
  runner: QueryRunner = defaultRunner,
): Promise<PortfolioContent | null> => {
  const row = await findFirstPortfolioContentRow(runner);

  if (!row) {
    return null;
  }

  return mapPortfolioContent(row);
};

export const createPortfolioContent = async (
  payload: PortfolioContentInput,
  runner: QueryRunner = defaultRunner,
): Promise<number> => {
  const result = await runner.query<{ id: number }>(
    `INSERT INTO portfolio_contents (content)
     VALUES ($1::jsonb)
     RETURNING id`,
    [JSON.stringify(payload)],
  );

  return result.rows[0]!.id;
};

export const updatePortfolioContent = async (
  portfolioContentId: number,
  payload: PortfolioContentInput,
  runner: QueryRunner = defaultRunner,
): Promise<void> => {
  await runner.query(
    `UPDATE portfolio_contents
     SET content = $1::jsonb,
         updated_at = NOW()
     WHERE id = $2`,
    [JSON.stringify(payload), portfolioContentId],
  );
};
