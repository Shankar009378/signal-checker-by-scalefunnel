/* ==============================================
   Signal Checker by Scale Funnel — Content Script
   ============================================== */

(() => {
  'use strict';

  /**
   * Extract profile data from the LinkedIn page DOM.
   * All selectors target known LinkedIn DOM patterns.
   * Returns null on failure.
   */
  function extractProfileData() {
    try {
      // ── Profile Name ────────────────────────────
      const nameEl = document.querySelector(
        'h1.text-heading-xlarge, ' +
        'h1.inline.t-24.v-align-middle.break-words, ' +
        '[data-anonymize="profile-name"], ' +
        '.profile-heading h1'
      );
      const name = nameEl ? nameEl.textContent.trim() : null;

      // ── Headline ────────────────────────────────
      const headlineEl = document.querySelector(
        '.text-body-medium.break-words, ' +
        '.profile-headline, ' +
        '[data-anonymize="headline"], ' +
        'h2.mt1.t-18.t-black.t-normal'
      );
      const headline = headlineEl ? headlineEl.textContent.trim() : null;

      // ── About Section ───────────────────────────
      let about = null;

      // Primary: find the #about heading and its sibling content div
      const aboutHeading = document.getElementById('about');
      if (aboutHeading && aboutHeading.parentElement) {
        const sibling = aboutHeading.parentElement.nextElementSibling;
        if (sibling) {
          const contentEl = sibling.querySelector('.display-flex, p, .about-description');
          if (contentEl) {
            about = contentEl.textContent.trim();
          }
        }
      }

      // Fallback 1: data-section attribute
      if (!about) {
        const sectionEl = document.querySelector('[data-section="about"] .display-flex');
        if (sectionEl) {
          about = sectionEl.textContent.trim();
        }
      }

      // Fallback 2: find about section by heading text
      if (!about) {
        const allSections = document.querySelectorAll('section');
        for (const section of allSections) {
          const heading = section.querySelector('h2, h3, .section-title');
          if (heading && heading.textContent.trim().toLowerCase().includes('about')) {
            const desc = section.querySelector('.display-flex, .pv-about__summary-text, [data-anonymize="about"], p');
            if (desc) {
              about = desc.textContent.trim();
            }
            break;
          }
        }
      }

      // Normalize: empty string or whitespace-only → null
      if (about === '') about = null;

      // ── Featured Section ────────────────────────
      let hasFeatured = false;
      const featuredHeading = document.getElementById('featured');
      if (featuredHeading && featuredHeading.parentElement) {
        const featuredContent = featuredHeading.parentElement.nextElementSibling;
        if (featuredContent) {
          const featuredItems = featuredContent.querySelectorAll('a, .feed-shared-update-v2, [data-anonymize="featured"]');
          hasFeatured = featuredItems.length > 0;
        }
      }

      // Fallback: data-section attribute
      if (!hasFeatured) {
        const sectionEl = document.querySelector('[data-section="featured"]');
        if (sectionEl) {
          const featuredItems = sectionEl.querySelectorAll('a, .feed-shared-update-v2');
          hasFeatured = featuredItems.length > 0;
        }
      }

      // ── Experience Section ──────────────────────
      const experiences = [];
      const expHeading = document.getElementById('experience');
      if (expHeading && expHeading.parentElement) {
        const expContent = expHeading.parentElement.nextElementSibling;
        if (expContent) {
          const expItems = expContent.querySelectorAll('li');
          expItems.forEach(item => {
            const descEl = item.querySelector('.display-flex, [data-anonymize="description"], p, .experience-item__description');
            const titleEl = item.querySelector('h3, .profile-entity__title, .experience-item__title, strong, .visually-hidden');
            const desc = descEl ? descEl.textContent.trim() : '';
            const title = titleEl ? titleEl.textContent.trim() : '';
            if (title || desc) {
              experiences.push({ title, description: desc });
            }
          });
        }
      }

      // Fallback: use data-section attribute
      if (experiences.length === 0) {
        const sectionEl = document.querySelector('[data-section="experience"]');
        if (sectionEl) {
          const expItems = sectionEl.querySelectorAll('li');
          expItems.forEach(item => {
            const descEl = item.querySelector('.display-flex, [data-anonymize="description"], p');
            const titleEl = item.querySelector('h3, .profile-entity__title, strong');
            const desc = descEl ? descEl.textContent.trim() : '';
            const title = titleEl ? titleEl.textContent.trim() : '';
            if (title || desc) {
              experiences.push({ title, description: desc });
            }
          });
        }
      }

      // ── Projects Section ────────────────────────
      let hasProjects = false;
      const projectsHeading = document.getElementById('projects');
      if (projectsHeading && projectsHeading.parentElement) {
        const projectsContent = projectsHeading.parentElement.nextElementSibling;
        if (projectsContent) {
          const projectItems = projectsContent.querySelectorAll('li, [data-anonymize="project"]');
          hasProjects = projectItems.length > 0;
        }
      }

      // Fallback: data-section attribute
      if (!hasProjects) {
        const sectionEl = document.querySelector('[data-section="projects"]');
        if (sectionEl) {
          const projectItems = sectionEl.querySelectorAll('li');
          hasProjects = projectItems.length > 0;
        }
      }

      // ── Profile Photo ───────────────────────────
      let hasPhoto = false;
      const photoEl = document.querySelector(
        'img.profile-photo-edit__preview, ' +
        'img.ivm-view-attr__img--centered, ' +
        'img.pv-top-card__photo, ' +
        '.profile-photo img, ' +
        'img[data-anonymize="profile-photo"]'
      );
      if (photoEl) {
        const src = photoEl.getAttribute('src') || '';
        hasPhoto = src.length > 0 && !src.includes('default');
      }

      return {
        name,
        headline,
        about,
        hasFeatured,
        experiences,
        hasProjects,
        hasPhoto
      };
    } catch (err) {
      console.error('Signal Checker: Error extracting profile data', err);
      return null;
    }
  }

  // ─── Message Listener ────────────────────────
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractProfile') {
      if (!window.location.pathname.includes('/in/')) {
        sendResponse({ success: false, error: 'Not a profile page' });
        return;
      }

      const data = extractProfileData();
      if (data) {
        sendResponse({ success: true, data });
      } else {
        sendResponse({ success: false, error: 'Extraction failed' });
      }
    }
  });
})();
