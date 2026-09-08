// ========================================
// Elisabeth Kollrack — site interactions
// Kept intentionally minimal: active nav
// highlighting + a subtle scroll reveal.
// Both respect prefers-reduced-motion.
// ========================================

document.addEventListener('DOMContentLoaded', function () {

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ----------------------------------------
     Active nav link on scroll
     Highlights the nav link for whichever
     section is currently in view.
  ---------------------------------------- */

  const navLinks = document.querySelectorAll('.nav-links a[href*="#"]');

  if (navLinks.length) {

    const sections = [];

    navLinks.forEach(function (link) {
      const id = link.getAttribute('href').split('#')[1];
      const section = id ? document.getElementById(id) : null;
      if (section) sections.push({ id: id, section: section, link: link });
    });

    if (sections.length && 'IntersectionObserver' in window) {

      const setActive = function (id) {
        navLinks.forEach(function (link) {
          const isMatch = link.getAttribute('href').split('#')[1] === id;
          link.classList.toggle('active', isMatch);
        });
      };

      const observer = new IntersectionObserver(function (entries) {

        // Pick the entry closest to the top of the viewport
        // among those currently intersecting.
        let topMost = null;

        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!topMost || entry.boundingClientRect.top < topMost.boundingClientRect.top) {
              topMost = entry;
            }
          }
        });

        if (topMost) {
          const match = sections.find(function (s) { return s.section === topMost.target; });
          if (match) setActive(match.id);
        }

      }, {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
      });

      sections.forEach(function (s) { observer.observe(s.section); });
    }
  }

  /* ----------------------------------------
     Scroll reveal
     Fades + lifts sections and work items
     into place as they enter the viewport.
     Skips entirely if the user prefers
     reduced motion.
  ---------------------------------------- */

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {

    const revealTargets = document.querySelectorAll(
      '.work-item, .featured-project, .about-content, .beyond-content, .stat-item, .detail-section, .figure-block'
    );

    if (revealTargets.length) {

      revealTargets.forEach(function (el) {
        el.classList.add('reveal');
      });

      const revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      });

      revealTargets.forEach(function (el) { revealObserver.observe(el); });
    }
  }

});