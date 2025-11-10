        const allPages = document.querySelectorAll('.page');
        const allDropdowns = document.querySelectorAll('.dropdown');
        const header = document.querySelector('.header');

        /**
         * Met à jour la variable CSS --header-height
         * avec la hauteur réelle du header.
         */
        function updatePagePadding() {
            const headerHeight = header.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        }

        /**
         * Affiche la page correspondant à l'ancre (hash) dans l'URL.
         */
        function router() {
            let pageId = window.location.hash.substring(1);
            
            // Si pas d'ancre, ou ancre invalide, afficher 'home'
            if (!pageId || !document.getElementById(pageId)) {
                pageId = 'home';
            }

            // Cacher toutes les pages
            allPages.forEach(page => page.classList.remove('active'));
            
            // Afficher la page cible
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
            
            // Fermer tous les dropdowns
            allDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            
            // Remonter en haut de page
            window.scrollTo(0, 0);
        }

        /**
         * Ouvre ou ferme un menu déroulant.
         */
        function toggleDropdown(dropdownId) {
            const dropdown = document.getElementById(dropdownId);
            const isActive = dropdown.classList.contains('active');
            
            // Fermer tous les dropdowns
            allDropdowns.forEach(d => d.classList.remove('active'));
            
            // Ouvrir le dropdown cible s'il était fermé
            if (!isActive) {
                dropdown.classList.add('active');
            }
        }

        // --- ÉCOUTEURS D'ÉVÉNEMENTS ---

        // Au chargement de la page
        document.addEventListener('DOMContentLoaded', () => {
            router(); // Afficher la bonne page
            updatePagePadding(); // Définir le padding initial
        });

        // Quand l'ancre dans l'URL change (clic sur un lien)
        window.addEventListener('hashchange', router);

       // NOUVEAU : Au chargement COMPLET de la fenêtre (plus lent, plus fiable)
       window.addEventListener('load', () => {
            router();
            updatePagePadding(); 
});

        // Utiliser ResizeObserver pour détecter les changements de taille du header
        // (plus fiable que l'événement 'resize')
        if ('ResizeObserver' in window) {
            new ResizeObserver(() => {
                updatePagePadding();
            }).observe(header);
        } else {
            // Fallback pour les anciens navigateurs
            window.addEventListener('resize', updatePagePadding);
        }

        // Fermer les dropdowns en cliquant n'importe où
        document.addEventListener('click', function(event) {
            const isClickInsideDropdown = event.target.closest('.nav-item');
            
            if (!isClickInsideDropdown) {
                allDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });

        // Fermer les dropdowns avec la touche "Echap"
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                allDropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
