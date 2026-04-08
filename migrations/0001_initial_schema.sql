CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_salt TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ NULL
);

CREATE TABLE admin_sessions (
  id BIGSERIAL PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE portfolio_contents (
  id BIGSERIAL PRIMARY KEY,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX admin_sessions_expires_at_idx ON admin_sessions (expires_at);
CREATE INDEX admin_users_is_active_idx ON admin_users (is_active);

INSERT INTO portfolio_contents (content)
VALUES (
  jsonb_build_object(
    'hero', jsonb_build_object(
      'jobTitle', 'Backend Developer',
      'company', 'Petnet Inc.',
      'description', 'Backend Developer with hands-on frontend experience, skilled in building and maintaining reliable, high-performing, and user-friendly systems.',
      'supportingText', 'Feel free to explore my website to learn more about me and get in touch!',
      'heroButtons', $heroButtons$[
        {"id":"hero-button-1","icon":"mdi-email-outline","link":"mailto:dominictarang@gmail.com","displayOrder":0},
        {"id":"hero-button-2","icon":"mdi-phone-outline","link":"tel:+639369407862","displayOrder":1},
        {"id":"hero-button-3","icon":"mdi-linkedin","link":"https://www.linkedin.com/in/mark-dominic-tarang-3b6031328","displayOrder":2},
        {"id":"hero-button-4","icon":"mdi-facebook","link":"https://www.facebook.com/mark.dominic.tarang/","displayOrder":3}
      ]$heroButtons$::jsonb,
      'heroImages', $heroImages$[
        {"id":"hero-1","url":"/hero-images/hero-1.png","alt":"Hero portrait of Mark Dominic Tarang","displayOrder":0},
        {"id":"hero-2","url":"/hero-images/hero-2.png","alt":"Alternate hero portrait of Mark Dominic Tarang","displayOrder":1},
        {"id":"hero-3","url":"/hero-images/hero-3.png","alt":"Alternate hero portrait of Mark Dominic Tarang","displayOrder":2},
        {"id":"hero-4","url":"/hero-images/hero-4.png","alt":"Alternate hero portrait of Mark Dominic Tarang","displayOrder":3}
      ]$heroImages$::jsonb
    ),
    'about', $about$
    {
      "paragraphs": [
        "Hello and welcome! I’m Mark Dominic Tarang, though most people call me Dom. I’m from Mendez, Cavite, and I’m glad you’re here taking the time to learn a bit more about me. I’m someone who’s naturally curious, driven, and always eager to keep learning, improving, and building things with purpose.",
        "Java was the first language that gave structure to my curiosity about technology. What started with exploring software and learning how things work gradually led me into programming, and over time, shaped my path as a software engineer who enjoys building dependable, user-focused applications.",
        "Outside of tech, I stay active through cycling, running, and strength training. I’m especially drawn to endurance sports because they reflect the same values I bring to software development: consistency, discipline, resilience, and steady progress. I’ve also joined several Audax Randonneur Philippines events, which continue to strengthen my long-term mindset in both life and career."
      ],
      "images": [
        {"id":"about-1","url":"/about-images/cycling-1.jpg","alt":"Cycling photo of Mark Dominic Tarang","displayOrder":0},
        {"id":"about-2","url":"/about-images/cycling-2.jpg","alt":"Cycling photo of Mark Dominic Tarang","displayOrder":1},
        {"id":"about-3","url":"/about-images/formal-attire.jpg","alt":"Formal portrait of Mark Dominic Tarang","displayOrder":2},
        {"id":"about-4","url":"/about-images/beach.jpg","alt":"Beach photo of Mark Dominic Tarang","displayOrder":3},
        {"id":"about-5","url":"/about-images/family.jpg","alt":"Family photo of Mark Dominic Tarang","displayOrder":4}
      ]
    }
    $about$::jsonb,
    'skills', $skills$
    {
      "certifications": [
        {"id":"certification-1","title":"Udemy: The Complete 2024 Web Development Bootcamp","href":"https://udemy-certificate.s3.amazonaws.com/image/UC-b3143bd2-ac9d-45d1-8990-aeb63455583f.jpg","date":"July 31, 2024","displayOrder":0},
        {"id":"certification-2","title":"Udemy: Laravel From Scratch","href":"https://udemy-certificate.s3.amazonaws.com/image/UC-0ad25400-4584-4715-9dc5-731ba4bb2b24.jpg","date":"November 17, 2024","displayOrder":1},
        {"id":"certification-3","title":"Udemy: Vue 3 in Action","href":"https://udemy-certificate.s3.amazonaws.com/image/UC-57f7dbb6-82a2-4622-8c8e-0551806f690f.jpg","date":"November 25, 2024","displayOrder":2}
      ],
      "categories": [
        {"id":"skill-category-1","name":"Front-end","mdi":"mdi-monitor-cellphone-star","content":"Vue.js · React · TypeScript · JavaScript · Vuetify · MUI · Tailwind CSS · CSS · HTML","displayOrder":0},
        {"id":"skill-category-2","name":"Back-end","mdi":"mdi-server-outline","content":"Java · Spring Boot · Node.js · Express.js · NestJS · TypeScript · Laravel","displayOrder":1},
        {"id":"skill-category-3","name":"DevOps","mdi":"mdi-cloud-outline","content":"Git · GitHub · GitLab · Docker · Kubernetes · Render · Hostinger","displayOrder":2},
        {"id":"skill-category-4","name":"Testing","mdi":"mdi-flask-outline","content":"Vitest · Playwright · Postman · Burp Suite","displayOrder":3},
        {"id":"skill-category-5","name":"Design","mdi":"mdi-palette-outline","content":"Figma · Whimsical · Draw.io · Adobe Photoshop · Adobe Illustrator · Adobe Premiere Pro","displayOrder":4},
        {"id":"skill-category-6","name":"Data","mdi":"mdi-database-outline","content":"SQL · PostgreSQL","displayOrder":5}
      ]
    }
    $skills$::jsonb,
    'projects', $projects$
    {
      "items": [
        {
          "id":"project-1",
          "photo":"/project-images/joson-perey.png",
          "projectName":"Joson-Perey Clinic",
          "shortDescription":"My Academic Capstone Project - Appointment System",
          "spaStatus":"live",
          "apiStatus":"down",
          "primaryButton":{"label":"Open Client Website","link":"https://joson-perey.domtarang.com/"},
          "secondaryButtonEnabled":true,
          "secondaryButton":{"label":"Open Admin Portal","link":"https://joson-perey.domtarang.com/admin"},
          "modalContent":"Joson-Perey Dental Clinic is an appointment scheduling platform developed as our academic capstone project to make dental bookings more convenient for patients and easier to manage for clinic staff.\n\nThe system was designed to improve the overall appointment workflow by giving patients a simple way to book, review, and manage their appointments online. For the clinic team, it provides an admin dashboard for organizing schedules, monitoring patient information, and keeping daily operations more streamlined. SMS reminder support was also integrated to help reduce missed appointments and improve communication.\n\nCore features:\n• Online appointment booking for patients\n• Schedule viewing and appointment management\n• Admin dashboard for monitoring schedules and patient information\n• Streamlined workflow for handling daily clinic appointments\n• SMS/Email reminder support for appointment updates",
          "displayOrder":0
        },
        {
          "id":"project-2",
          "photo":"/project-images/privarase.png",
          "projectName":"Privarase",
          "shortDescription":"My Internship Project - Cybersecurity and Data Privacy Platform",
          "spaStatus":"live",
          "apiStatus":"live",
          "primaryButton":{"label":"Open Website","link":"https://www.privarase.com/"},
          "secondaryButtonEnabled":false,
          "secondaryButton":{"label":"","link":""},
          "modalContent":"Privarase is a cybersecurity and data privacy platform created during my internship to make online safety more practical, approachable, and easier for everyday users to understand.\n\nThe platform brings together educational content that helps readers explore topics like account protection, social media safety, privacy tools, and current cybersecurity concerns without overwhelming technical language. Its structure was built to keep learning organized and engaging through articles, guides, categorized resources, newsletter content, and video-based materials.\n\nCore features:\n• Educational articles, guides, and security tips\n• Resources focused on privacy, account safety, and social media protection\n• Categorized content for easier topic discovery\n• Newsletter content and awareness-driven updates\n• Video guides that make cybersecurity learning more engaging",
          "displayOrder":1
        }
      ]
    }
    $projects$::jsonb,
    'experience', $experience$
    {
      "photo": {"url":"/experience-images/petnet-genmeet.jpg","alt":"Team photo from my professional experience"},
      "items": [
        {
          "id":"experience-1",
          "experienceTitle":"Professional Experience",
          "jobTitle":"Backend Developer",
          "company":"Petnet Inc.",
          "tags": [
            {"id":"experience-1-tag-1","mdi":"mdi-calendar-range","text":"February 2025 - Present","displayOrder":0},
            {"id":"experience-1-tag-2","mdi":"mdi-account-group-outline","text":"Unified Service Portal (USP) Team","displayOrder":1},
            {"id":"experience-1-tag-3","mdi":"mdi-storefront-outline","text":"Supporting 186 Pera Hub branches nationwide","displayOrder":2}
          ],
          "shortDescription":"Currently assigned to the Unified Service Portal (USP) team, supporting a core internal platform used by tellers and front line associates across 186 Pera Hub branches nationwide.",
          "responsibilities": [
            {"id":"experience-1-responsibility-1","title":"Enhance and maintain the USP system","description":"Keep the platform stable, efficient, and reliable for day-to-day branch operations across the network.","displayOrder":0},
            {"id":"experience-1-responsibility-2","title":"Build features and improve workflows","description":"Develop new features, improve existing workflows, and resolve bugs to support better usability and performance.","displayOrder":1},
            {"id":"experience-1-responsibility-3","title":"Support modernization efforts","description":"Help drive website migration efforts to the latest tech stack while ensuring business continuity and system quality.","displayOrder":2},
            {"id":"experience-1-responsibility-4","title":"Deliver maintainable production-ready solutions","description":"Work closely with teammates in delivering solutions that balance maintainability, functionality, and user needs.","displayOrder":3}
          ],
          "displayOrder":0
        },
        {
          "id":"experience-2",
          "experienceTitle":"Internship Experience",
          "jobTitle":"IT Intern Team Leader",
          "company":"The Interns Hub",
          "tags": [
            {"id":"experience-2-tag-1","mdi":"mdi-calendar-range","text":"February 2024 - June 2024","displayOrder":0},
            {"id":"experience-2-tag-2","mdi":"mdi-account-supervisor-outline","text":"Team Leadership","displayOrder":1},
            {"id":"experience-2-tag-3","mdi":"mdi-clipboard-text-clock-outline","text":"Scrums, reporting, QA, and creative support","displayOrder":2}
          ],
          "shortDescription":"Completed my internship as an IT Intern Team Leader, guiding fellow interns while contributing to website development, testing, and creative deliverables across multiple tasks.",
          "responsibilities": [
            {"id":"experience-2-responsibility-1","title":"Led the intern team and facilitated daily scrums","description":"Coordinated the team’s daily workflow and provided weekly progress reports to my supervisor to keep deliverables on track.","displayOrder":0},
            {"id":"experience-2-responsibility-2","title":"Tracked progress and monitored output","description":"Used ClickUp to organize tasks, monitor team progress, and maintain visibility over ongoing work.","displayOrder":1},
            {"id":"experience-2-responsibility-3","title":"Contributed to a cybersecurity and data privacy website","description":"Supported development efforts and performed quality assurance testing to help ensure functionality and usability.","displayOrder":2},
            {"id":"experience-2-responsibility-4","title":"Supported creative deliverables","description":"Contributed to graphic design and video editing projects as part of the team’s broader output.","displayOrder":3}
          ],
          "displayOrder":1
        }
      ]
    }
    $experience$::jsonb,
    'education', $education$
    {
      "collegePhoto": {"url":"/education-images/college-graduation.jpg","alt":"College graduation photo of Mark Dominic Tarang"},
      "seniorHighPhoto": {"url":"/education-images/shs-graduation.png","alt":"Senior high school photo of Mark Dominic Tarang"}
    }
    $education$::jsonb,
    'contact', $contact$
    {
      "items": [
        {"id":"contact-1","mdi":"mdi-email-outline","text":"dominictarang@gmail.com","link":"mailto:dominictarang@gmail.com","displayOrder":0},
        {"id":"contact-2","mdi":"mdi-phone-outline","text":"+63 936 940 7862","link":"tel:+639369407862","displayOrder":1},
        {"id":"contact-3","mdi":"mdi-linkedin","text":"www.linkedin.com/in/mark-dominic-tarang-3b6031328","link":"https://www.linkedin.com/in/mark-dominic-tarang-3b6031328","displayOrder":2},
        {"id":"contact-4","mdi":"mdi-facebook","text":"https://www.facebook.com/mark.dominic.tarang/","link":"https://www.facebook.com/mark.dominic.tarang/","displayOrder":3}
      ]
    }
    $contact$::jsonb
  )
);
