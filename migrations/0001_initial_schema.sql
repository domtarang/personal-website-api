CREATE TABLE IF NOT EXISTS hero_sections (
  id BIGSERIAL PRIMARY KEY,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  supporting_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hero_section_images (
  id BIGSERIAL PRIMARY KEY,
  hero_section_id BIGINT NOT NULL REFERENCES hero_sections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hero_section_buttons (
  id BIGSERIAL PRIMARY KEY,
  hero_section_id BIGINT NOT NULL REFERENCES hero_sections(id) ON DELETE CASCADE,
  icon TEXT NOT NULL,
  link TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id BIGSERIAL PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS hero_section_images_display_order_idx
  ON hero_section_images (hero_section_id, display_order);
CREATE INDEX IF NOT EXISTS hero_section_buttons_display_order_idx
  ON hero_section_buttons (hero_section_id, display_order);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions (expires_at);
CREATE INDEX IF NOT EXISTS admin_users_is_active_idx ON admin_users (is_active);

INSERT INTO hero_sections (
  job_title,
  company,
  description,
  supporting_text
)
SELECT
  'Backend Developer',
  'Petnet Inc.',
  'Backend Developer with hands-on frontend experience, skilled in building and maintaining reliable, high-performing, and user-friendly systems.',
  'Feel free to explore my website to learn more about me and get in touch!'
WHERE NOT EXISTS (SELECT 1 FROM hero_sections);

INSERT INTO hero_section_images (hero_section_id, image_url, alt_text, display_order)
SELECT hs.id, seed.image_url, seed.alt_text, seed.display_order
FROM (SELECT id FROM hero_sections ORDER BY id ASC LIMIT 1) hs
CROSS JOIN (
  VALUES
    ('/hero-images/hero-1.png', 'Hero portrait of Mark Dominic Tarang', 0),
    ('/hero-images/hero-2.png', 'Alternate hero portrait of Mark Dominic Tarang', 1),
    ('/hero-images/hero-3.png', 'Alternate hero portrait of Mark Dominic Tarang', 2),
    ('/hero-images/hero-4.png', 'Alternate hero portrait of Mark Dominic Tarang', 3)
) AS seed(image_url, alt_text, display_order)
WHERE NOT EXISTS (SELECT 1 FROM hero_section_images);

INSERT INTO hero_section_buttons (hero_section_id, icon, link, display_order)
SELECT hs.id, seed.icon, seed.link, seed.display_order
FROM (SELECT id FROM hero_sections ORDER BY id ASC LIMIT 1) hs
CROSS JOIN (
  VALUES
    ('mdi-email-outline', 'mailto:dominictarang@gmail.com', 0),
    ('mdi-phone-outline', 'tel:+639369407862', 1),
    ('mdi-linkedin', 'https://www.linkedin.com/in/mark-dominic-tarang-3b6031328', 2),
    ('mdi-facebook', 'https://www.facebook.com/mark.dominic.tarang/', 3)
) AS seed(icon, link, display_order)
WHERE NOT EXISTS (SELECT 1 FROM hero_section_buttons);
