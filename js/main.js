/* Lumea static demo JavaScript. This is intentionally dependency-free. */
(() => {
  "use strict";

  // Change this demo password if you want a different prompt.
  // IMPORTANT: a password stored in frontend JavaScript is not secure access control.
  const FACHKREISE_DEMO_PASSWORD = "12345";
  const CONSENT_KEY = "lumea-static-demo-consent-v1";

  // Simple front-end password prompt for the Fachkreise demo.
  const fachForm = document.querySelector("#fach-form");
  if (fachForm) {
    const login = document.querySelector("#fach-login");
    const content = document.querySelector("#fach-content");
    const error = document.querySelector("#fach-error");
    const passwordInput = document.querySelector("#fach-password");
    const showContent = () => {
      login.hidden = true;
      content.hidden = false;
      sessionStorage.setItem("lumea-fachkreise-demo-open", "yes");
    };
    if (sessionStorage.getItem("lumea-fachkreise-demo-open") === "yes") showContent();
    fachForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (passwordInput.value === FACHKREISE_DEMO_PASSWORD) {
        error.hidden = true;
        showContent();
      } else {
        error.hidden = false;
        passwordInput.focus();
        passwordInput.select();
      }
    });
    document.querySelector("#fach-logout")?.addEventListener("click", () => {
      sessionStorage.removeItem("lumea-fachkreise-demo-open");
      content.hidden = true;
      login.hidden = false;
      passwordInput.value = "";
      passwordInput.focus();
    });
  }

  // Demo order flow: validate in browser, send no data, and redirect to thank-you page.
  const orderForm = document.querySelector("#order-form");
  if (orderForm) {
    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!orderForm.reportValidity()) return;
      window.location.href = "danke.html";
    });
  }

  // Consent UI is a demonstration only; no Meta/GA scripts are loaded.
  const banner = document.querySelector("#cookie-banner");
  if (banner) {
    const marketing = document.querySelector("#consent-marketing");
    const analytics = document.querySelector("#consent-analytics");
    const read = () => {
      try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null"); }
      catch { return null; }
    };
    const save = (value) => {
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify(value)); } catch { /* no-op */ }
      banner.hidden = true;
    };
    const saved = read();
    if (!saved) banner.hidden = false;
    else {
      marketing.checked = Boolean(saved.marketing);
      analytics.checked = Boolean(saved.analytics);
    }
    document.querySelectorAll("[data-open-cookies]").forEach((button) => {
      button.addEventListener("click", () => {
        const current = read();
        marketing.checked = Boolean(current?.marketing);
        analytics.checked = Boolean(current?.analytics);
        banner.hidden = false;
      });
    });
    banner.querySelectorAll("[data-consent]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.consent;
        if (action === "deny") save({ marketing: false, analytics: false, savedAt: new Date().toISOString() });
        if (action === "accept") save({ marketing: true, analytics: true, savedAt: new Date().toISOString() });
        if (action === "save") save({ marketing: marketing.checked, analytics: analytics.checked, savedAt: new Date().toISOString() });
      });
    });
  }
})();