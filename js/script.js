// CONTROL PAGE POSITION ON REFRESH
if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});

// MOBILE NAVIGATION AUTO-COLLAPSE

const portfolioNavbar = document.getElementById("portfolioNavbar");

// LOCK BACKGROUND SCROLLING

const htmlElement = document.documentElement;

let previousOverflow = "";

portfolioNavbar.addEventListener("shown.bs.collapse", () => {

    if (window.innerWidth < 992) {

        previousOverflow = htmlElement.style.overflow;

        htmlElement.style.overflow = "hidden";

    }

});

portfolioNavbar.addEventListener("hidden.bs.collapse", () => {

    htmlElement.style.overflow = previousOverflow;

});

const portfolioNavLinks = document.querySelectorAll(
    ".portfolio-nav .nav-link"
);

portfolioNavLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        // Only apply this behavior on mobile/tablet
        if (window.innerWidth < 992) {

            event.preventDefault();

            const targetSection = document.querySelector(link.getAttribute("href"));

            const navbarCollapse =
                bootstrap.Collapse.getOrCreateInstance(portfolioNavbar);

            // Wait until the menu has completely collapsed
            portfolioNavbar.addEventListener(
                "hidden.bs.collapse",
                () => {

                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }

                },
                { once: true }
            );

            navbarCollapse.hide();
        }

    });

});

// BRAND CLICK - COLLAPSE MOBILE MENU

const portfolioBrands = document.querySelectorAll(".portfolio-nav .site-brand, .footer-brand-link");

portfolioBrands.forEach((brand) => {
    brand.addEventListener("click", (event) => {

        if (
            window.innerWidth < 992 &&
            portfolioNavbar.classList.contains("show")
        ) {
            event.preventDefault();

            const navbarCollapse =
                bootstrap.Collapse.getOrCreateInstance(portfolioNavbar);

            portfolioNavbar.addEventListener(
                "hidden.bs.collapse",
                () => {
                    document.querySelector("#home").scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                },
                { once: true }
            );

            navbarCollapse.hide();
        }
    });
});

// INITIALIZE BOOTSTRAP SCROLLSPY
const scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: ".portfolio-nav",
    rootMargin: "0px 0px -25%",
    smoothScroll: false
});

// HANDLE DEVICE ORIENTATION CHANGES

let savedScrollAnchor = null;

window.addEventListener("orientationchange", () => {

    // Identify the content currently visible on screen
    const visibleElement = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight * 0.80
    );

    // Find a meaningful content element
    savedScrollAnchor = visibleElement?.closest(
        "p, h1, h2, h3, article, .education-item, .project-card, section[id]"
    );

    // Remember its current vertical position
    if (savedScrollAnchor) {
        savedScrollAnchorTop =
            savedScrollAnchor.getBoundingClientRect().top;
    }

    // Wait for the browser to finish rearranging the layout
    setTimeout(() => {

        requestAnimationFrame(() => {

            // Restore the previously visible content position
            if (savedScrollAnchor) {

                const newTop =
                    savedScrollAnchor.getBoundingClientRect().top;

                const difference = newTop - savedScrollAnchorTop;

                window.scrollTo(
                    0,
                    window.scrollY + difference
                );
            }
            // Recalculate Bootstrap ScrollSpy positions
            scrollSpy.refresh();

            // Recheck the active navigation link
            requestAnimationFrame(() => {
                scrollSpy.process();
            });

            // Recalculate Bootstrap ScrollSpy positions
            scrollSpy.refresh();

            // Recheck which navigation link should be active
            window.dispatchEvent(new Event("scroll"));

        });

    }, 300);

});

let savedScrollAnchorTop = 0;

// DYNAMIC CERTIFICATE PREVIEW
const certificateModal = document.querySelector("#certificateModal");

certificateModal.addEventListener("show.bs.modal", (event) => {

    const button = event.relatedTarget;

    const certificateSrc = button.getAttribute("data-certificate-src");
    const certificateTitle = button.getAttribute("data-certificate-title");

    const certificateImage = certificateModal.querySelector(
        ".certificate-modal-image"
    );

    const modalTitle = certificateModal.querySelector(
        "#certificateModalLabel"
    );

    certificateImage.src = certificateSrc;
    certificateImage.alt = certificateTitle;
    modalTitle.textContent = certificateTitle;

});

// AUTOMATIC COPYRIGHT YEAR

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}