// document.querySelector(".header-bar").classList.add('animate');
// Robust header initialization for cases where header is injected later
let prevScrollpos = 0;
let headerDiv = null;

function initHeaderBar() {
    prevScrollpos = window.pageYOffset;
    headerDiv = document.querySelector('.header-bar');
    if (!headerDiv) return false; // caller may retry later

    // compute header bottom lazily
    let headerBottom = headerDiv.offsetTop + headerDiv.offsetHeight;

    window.onscroll = function() {
        const currentScrollPos = window.pageYOffset;
        if (currentScrollPos < 200) {
            headerDiv.style.top = '0';
            headerDiv.classList.remove('midpage');
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) backToTop.classList.add('hide');
        } else if (prevScrollpos > currentScrollPos) {
            headerDiv.style.top = '0';
            headerDiv.classList.add('midpage');
        } else if (currentScrollPos < 200) {
            headerDiv.style.top = '0';
            headerDiv.classList.add('midpage');
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) backToTop.classList.add('hide');
        } else if (document.querySelector('.nav-content') && document.querySelector('.nav-content').classList.contains('active') == false) {
            headerDiv.style.top = '-200px';
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) backToTop.classList.remove('hide');
        }

        prevScrollpos = currentScrollPos;
    };

    return true;
}

// expose for other scripts to call after injecting header
window.initHeaderBar = initHeaderBar;

// If header exists now, initialize. Otherwise observe for it and init once inserted.
if (!initHeaderBar()) {
    const mo = new MutationObserver((records, obs) => {
        if (document.querySelector('.header-bar')) {
            initHeaderBar();
            obs.disconnect();
        }
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
}

function scrollWin() {
    window.scrollTo(0, 0);
}
