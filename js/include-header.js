// include-header.js
// Fetches a shared header fragment and injects it into the page.
(function() {
    const pathsToTry = [
        '/includes/header.html',       // site-root
        'includes/header.html',        // same folder
        '../includes/header.html',     // one level up
        '../../includes/header.html'   // two levels up
    ];

    async function fetchFirst(paths) {
        for (const p of paths) {
            try {
                const res = await fetch(p, {cache: 'no-store'});
                if (res.ok) return {text: await res.text(), path: p};
            } catch (err) {
                // continue trying
            }
        }
        return null;
    }

    function injectHeader(fragment) {
        // create a temporary container to parse the fragment
        const tmp = document.createElement('div');
        tmp.innerHTML = fragment;
        const newHeader = tmp.querySelector('header');
        if (!newHeader) return;

        // Try to find existing header.header-bar
        const existing = document.querySelector('header.header-bar');
        if (existing) {
            // If the existing header explicitly opts out, leave it alone.
            const preserve = existing.dataset.preserve === 'true' || existing.classList.contains('preserve-header');
            if (!preserve) {
                // copy attributes from existing to newHeader (preserve inline styles, classes)
                for (const attr of Array.from(existing.attributes)) {
                    // don't overwrite attributes that come from the fragment unless absent
                    if (!newHeader.hasAttribute(attr.name)) {
                        newHeader.setAttribute(attr.name, attr.value);
                    }
                }
                // replace the existing header element with the new one
                existing.replaceWith(newHeader);
                // ensure homepage animation class is present on home page only
                const isHome = location.pathname === '/' || location.pathname.endsWith('/index.html');
                if (isHome && !newHeader.classList.contains('delay')) newHeader.classList.add('delay');
            }
        } else {
            // insert the header at the top of the body
            document.body.insertBefore(newHeader, document.body.firstChild);
            // ensure homepage animation class is present
            const inserted = document.body.firstChild;
            const isHome = location.pathname === '/' || location.pathname.endsWith('/index.html');
            if (inserted && inserted.tagName === 'HEADER' && isHome && !inserted.classList.contains('delay')) {
                inserted.classList.add('delay');
            }
        }
        // After injection/replacement, initialize standard header interactions
        try {
            initHeaderInteractions();
            // mark the appropriate nav item active based on pathname
            setActiveNavByPath();
            if (window.initHeaderBar) window.initHeaderBar();
        } catch (e) {
            // swallow errors to avoid breaking pages
            // console.warn('initHeaderInteractions failed', e);
        }
    }
    
    // Set .active on nav items for About, Resume, Contact when on their pages
    function setActiveNavByPath() {
        try {
            const path = location.pathname.replace(/\/+$/, ''); // remove trailing slash
            // map target paths to link text or href
            const mapping = [
                {path: '/about', selector: 'a[href="/about"]'},
                {path: '/resume', selector: 'a[href="/resume"]'},
                {path: '/contact', selector: 'a[href="/contact"]'}
            ];
            // clear any existing active classes
            document.querySelectorAll('.nav-content .active').forEach(el => el.classList.remove('active'));

            for (const m of mapping) {
                if (path === m.path || path === m.path + '/index.html') {
                    const link = document.querySelector(m.selector);
                    if (link) {
                        // prefer adding active to the closest li.nav-item
                        const li = link.closest('li.nav-item') || link;
                        li.classList.add('active');
                        // also add to the anchor itself for styling hooks
                        link.classList.add('active');
                    }
                    break;
                }
            }
        } catch (e) {
            // ignore
        }
    }
    // Initialize header interactions (used after injection)
    function initHeaderInteractions() {
        const hamburger = document.querySelector('.menu-icon');
        const dropdown = document.querySelector('.dropdown-content');
        const back = document.querySelector('.back');
        const nameEl = document.querySelector('.name');
        const mobileNavIcon = document.querySelector('.mobile-nav');
        const navBar = document.querySelector('.nav-content');

        if (hamburger) {
            hamburger.onclick = function() {
                try {
                    // Match original behavior: when opening the hamburger menu,
                    // hide any dropdown (remove 'visibility') and reset back/name
                    if (nameEl) nameEl.classList.remove('name-gone');
                    if (dropdown) dropdown.classList.remove('visibility');
                    if (back) back.classList.remove('active');
                    if (mobileNavIcon) mobileNavIcon.classList.toggle('fa-chevron-right');
                    if (navBar) {
                        navBar.classList.toggle('active');
                        navBar.classList.toggle('black');
                    }
                    hamburger.classList.toggle('active');
                    const works = document.querySelector('.dropdown');
                    if (works) works.classList.toggle('left');
                    const droplist = document.querySelector('.nav-content ul .dropdown');
                    if (droplist) droplist.classList.toggle('margins');
                } catch (e) {
                    // ignore
                }
            };
        }

    // Dropdown toggle for Work on mobile
    const dropButton = document.querySelector('.drop-button');
    const dropdownParent = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');
    const openDropdownForMobile = (e) => {
        if (window.matchMedia('(max-width: 900px)').matches) {
            if (dropdownContent) dropdownContent.classList.add('visibility');
            if (dropdownParent) dropdownParent.classList.add('left');
            if (back) back.classList.add('active');
            if (nameEl) nameEl.classList.add('name-gone');
            e && e.preventDefault && e.preventDefault();
        }
    };

    if (dropButton) {
        dropButton.onclick = openDropdownForMobile;
    }
    // Make the whole row clickable on mobile
    if (dropdownParent) {
        dropdownParent.onclick = openDropdownForMobile;
    }

    // Back button hides dropdown on mobile
    if (back) {
        back.onclick = function() {
            if (dropdownContent) dropdownContent.classList.remove('visibility');
            if (dropdownParent) dropdownParent.classList.remove('left');
            back.classList.remove('active');
            if (nameEl) nameEl.classList.remove('name-gone');
        };
    }

        // Ensure checkbox is unchecked on load
        const checkbox = document.querySelector('.menu-icon__cheeckbox');
        if (checkbox) checkbox.checked = false;
    }

    // Start fetching immediately and inject when available
    (async () => {
        const result = await fetchFirst(pathsToTry);
        if (result) injectHeader(result.text);
    })();
})();
