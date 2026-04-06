import { query } from '../config/database';
import type {
  HeroSection,
  HeroSectionButtonRow,
  HeroSectionImageRow,
  HeroSectionInput,
  HeroSectionRow,
} from '../types/hero-section';
import type { QueryRunner } from '../types/database';

const defaultRunner: QueryRunner = { query };

interface UpdateHeroSectionCorePayload extends HeroSectionInput {
  heroSectionId: number;
}

interface ReplaceHeroImagesPayload {
  heroSectionId: number;
  images: HeroSectionInput['heroImages'];
}

interface ReplaceHeroButtonsPayload {
  heroSectionId: number;
  buttons: HeroSectionInput['heroButtons'];
}

const toIsoString = (value: string | Date): string =>
  value instanceof Date ? value.toISOString() : new Date(value).toISOString();

const mapHeroSection = (
  heroRow: HeroSectionRow,
  imageRows: HeroSectionImageRow[],
  buttonRows: HeroSectionButtonRow[],
): HeroSection => ({
  jobTitle: heroRow.job_title,
  company: heroRow.company,
  description: heroRow.description,
  supportingText: heroRow.supporting_text,
  heroButtons: buttonRows.map((buttonRow, index) => ({
    id: `hero-button-${buttonRow.id ?? index + 1}`,
    icon: buttonRow.icon,
    link: buttonRow.link,
    displayOrder: Number(buttonRow.display_order ?? index),
  })),
  heroImages: imageRows.map((imageRow, index) => ({
    id: `hero-${imageRow.id ?? index + 1}`,
    url: imageRow.image_url,
    alt: imageRow.alt_text ?? `Hero image ${index + 1}`,
    displayOrder: Number(imageRow.display_order ?? index),
  })),
  updatedAt: toIsoString(heroRow.updated_at),
});

export const findFirstHeroSectionRow = async (
  runner: QueryRunner = defaultRunner,
  forUpdate = false,
): Promise<HeroSectionRow | null> => {
  const result = await runner.query<HeroSectionRow>(
    `SELECT id, job_title, company, description, supporting_text, updated_at
     FROM hero_sections
     ORDER BY id ASC
     LIMIT 1${forUpdate ? ' FOR UPDATE' : ''}`,
  );

  return result.rows[0] ?? null;
};

export const readHeroSection = async (
  runner: QueryRunner = defaultRunner,
): Promise<HeroSection | null> => {
  const heroRow = await findFirstHeroSectionRow(runner);

  if (!heroRow) {
    return null;
  }

  const imageResult = await runner.query<HeroSectionImageRow>(
    `SELECT id, image_url, alt_text, display_order
     FROM hero_section_images
     WHERE hero_section_id = $1
     ORDER BY display_order ASC, id ASC`,
    [heroRow.id],
  );

  const buttonResult = await runner.query<HeroSectionButtonRow>(
    `SELECT id, icon, link, display_order
     FROM hero_section_buttons
     WHERE hero_section_id = $1
     ORDER BY display_order ASC, id ASC`,
    [heroRow.id],
  );

  return mapHeroSection(heroRow, imageResult.rows, buttonResult.rows);
};

export const createHeroSection = async (
  payload: HeroSectionInput,
  runner: QueryRunner = defaultRunner,
): Promise<number> => {
  const result = await runner.query<{ id: number }>(
    `INSERT INTO hero_sections (job_title, company, description, supporting_text)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [payload.jobTitle, payload.company, payload.description, payload.supportingText],
  );

  return result.rows[0]!.id;
};

export const updateHeroSectionCore = async (
  payload: UpdateHeroSectionCorePayload,
  runner: QueryRunner = defaultRunner,
): Promise<void> => {
  await runner.query(
    `UPDATE hero_sections
     SET job_title = $1,
         company = $2,
         description = $3,
         supporting_text = $4,
         updated_at = NOW()
     WHERE id = $5`,
    [
      payload.jobTitle,
      payload.company,
      payload.description,
      payload.supportingText,
      payload.heroSectionId,
    ],
  );
};

export const replaceHeroImages = async (
  payload: ReplaceHeroImagesPayload,
  runner: QueryRunner = defaultRunner,
): Promise<void> => {
  await runner.query('DELETE FROM hero_section_images WHERE hero_section_id = $1', [payload.heroSectionId]);

  for (const [index, image] of payload.images.entries()) {
    await runner.query(
      `INSERT INTO hero_section_images (hero_section_id, image_url, alt_text, display_order)
       VALUES ($1, $2, $3, $4)`,
      [payload.heroSectionId, image.url, image.alt, index],
    );
  }
};

export const replaceHeroButtons = async (
  payload: ReplaceHeroButtonsPayload,
  runner: QueryRunner = defaultRunner,
): Promise<void> => {
  await runner.query('DELETE FROM hero_section_buttons WHERE hero_section_id = $1', [payload.heroSectionId]);

  for (const [index, button] of payload.buttons.entries()) {
    await runner.query(
      `INSERT INTO hero_section_buttons (hero_section_id, icon, link, display_order)
       VALUES ($1, $2, $3, $4)`,
      [payload.heroSectionId, button.icon, button.link, index],
    );
  }
};
