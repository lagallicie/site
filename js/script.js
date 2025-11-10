(function () {
  'use strict';

  // Références DOM initialisées après DOMContentLoaded
  let allPages = [];
  let allDropdowns = [];
  let header = null;

  function safeGetById(id) {
    if (!id) return null;
    try { return document.getElementById(id); } catch (e) { return null; }
  }

  /**
   * Met à jour --header-height si header existe.
   */
  function updatePagePadding() {
    if (!header) return;
    const headerHeight = header.offsetHeight || 0;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }

  /**
   * Affiche la page correspondant à la hash (ou 'home' si invalide).
   */
  function router() {
    let pageId = window.location.hash.substring(1);
    if (!pageId || !document.getElementById(pageId)) pageId = 'home';

    allPages.forEach(page => page.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');

    // fermer dropdowns
    allDropdowns.forEach(d => d.classList.remove('active'));

    window.scrollTo(0, 0);
  }

  /**
   * Toggle d'un dropdown.
   * Accepte soit un id (string) soit un élément HTMLElement.
   */
  function toggleDropdown(target) {
    let dropdownEl = null;

    if (typeof target === 'string') dropdownEl = safeGetById(target);
    else if (target instanceof HTMLElement) dropdownEl = target;
    else if (target && typeof target === 'object' && target.id) dropdownEl = safeGetById(target.id);

    // si pas d'élément, on ferme tous et on retourne
    if (!dropdownEl) {
      allDropdowns.forEach(d => d.classList.remove('active'));
      return;
    }

    const isActive = dropdownEl.classList.contains('active');

    // fermer tous
    allDropdowns.forEach(d => d.classList.remove('active'));

    // ouvrir si était fermé
    if (!isActive) dropdownEl.classList.add('active');
  }

  // Exposer globalement (pour la fonction de toggle)
  window.toggleDropdown = toggleDropdown; 

  // Initialisation DOM
  document.addEventListener('DOMContentLoaded', () => {
    allPages = Array.from(document.querySelectorAll('.page'));
    allDropdowns = Array.from(document.querySelectorAll('.dropdown'));
    header = document.querySelector('.header');

    router();
    updatePagePadding();

    // **********************************************
    // NOUVELLE LOGIQUE : GESTION DES DROPDOWNS AU SURVOL (HOVER)
    // **********************************************
    document.querySelectorAll('.nav-item').forEach(navItem => {
      const dropdown = navItem.querySelector('.dropdown');
      const button = navItem.querySelector('.nav-dropdown-trigger');
      
      if (!dropdown) return;

      // 1. OUVRIR au survol (mouseenter) sur le conteneur complet (.nav-item)
      navItem.addEventListener('mouseenter', function () {
        // Ferme les autres dropdowns avant d'ouvrir celui-ci
        allDropdowns.filter(d => d !== dropdown).forEach(d => d.classList.remove('active'));
        dropdown.classList.add('active');
      });

      // 2. FERMER lorsque la souris quitte le conteneur complet (.nav-item)
      navItem.addEventListener('mouseleave', function () {
        dropdown.classList.remove('active');
      });
      
      // 3. Garder la fonction de toggle au clic/touch (pour l'accessibilité/mobile)
      if (button) {
          button.addEventListener('click', function (e) {
              e.preventDefault();
              // Utilise l'ancienne fonction toggle pour le mode clic/touch
              toggleDropdown(dropdown); 
          });
      }
    });

    // Fermer les dropdowns en cliquant à l'extérieur
    document.addEventListener('click', function (event) {
      const isInside = !!event.target.closest('.nav-item');
      if (!isInside) allDropdowns.forEach(d => d.classList.remove('active'));
    });

    // Fermer avec Echap
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') allDropdowns.forEach(d => d.classList.remove('active'));
    });
  });

  // Le routeur est déclenché par le changement de hash dans l'URL.
  window.addEventListener('hashchange', router);
  
  window.addEventListener('load', () => {
    // Recalcule après que tout ait chargé
    updatePagePadding();
    router();
  });

  // Resize observer pour header, installé après DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    if ('ResizeObserver' in window && header) {
      new ResizeObserver(updatePagePadding).observe(header);
    } else {
      window.addEventListener('resize', updatePagePadding);
    }
  });

})();
