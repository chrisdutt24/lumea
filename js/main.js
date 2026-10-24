/* Lumea static demo JavaScript. This is intentionally dependency-free. */
(() => {
  "use strict";

  // Change this demo password if you want a different prompt.
  // IMPORTANT: a password stored in frontend JavaScript is not secure access control.
  const FACHKREISE_DEMO_PASSWORD = "12345";
  const CONSENT_KEY = "lumea-static-demo-consent-v1";
  const META_PIXEL_ID = "2414924022576846";

  const loadMetaPixel = () => {
    if (window.fbq) return;
    const fbq = (window.fbq = function () {
      fbq.callMethod
        ? fbq.callMethod.apply(fbq, arguments)
        : fbq.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    fbq("init", META_PIXEL_ID);
    fbq("track", "PageView");
  };

  const trackEvent = (name, parameters, metaEvent = name) => {
    if (typeof window.gtag === "function") {
      const key = `lumea-${name}-ga4-sent`;
      if (!sessionStorage.getItem(key)) {
        window.gtag("event", name, parameters);
        sessionStorage.setItem(key, "yes");
      }
    }
    if (typeof window.fbq === "function") {
      const key = `lumea-${name}-meta-sent`;
      if (!sessionStorage.getItem(key)) {
        if (metaEvent === name) {
          window.fbq("trackCustom", metaEvent, parameters);
        } else {
          window.fbq("track", metaEvent, parameters);
        }
        sessionStorage.setItem(key, "yes");
      }
    }
  };

  const checkoutParameters = {
    currency: "EUR",
    value: 14.5,
    items: [
      {
        item_id: "lumea-monthly-subscription",
        item_name: "Lumea Monatsabo",
        price: 14.5,
        quantity: 1,
      },
    ],
  };

  const trackCheckoutEvents = () => {
    const orderForm = document.querySelector("#order-form");
    if (orderForm && sessionStorage.getItem("lumea-checkout-started") === "yes") {
      trackEvent("begin_checkout", checkoutParameters, "InitiateCheckout");
    } else if (orderForm) {
      orderForm.addEventListener("focusin", () => {
        sessionStorage.setItem("lumea-checkout-started", "yes");
        trackEvent("begin_checkout", checkoutParameters, "InitiateCheckout");
      }, { once: true });
    }

    if (document.querySelector(".thankyou")) {
      const transactionId = sessionStorage.getItem("lumea-demo-transaction-id")
        || `lumea-demo-${Date.now()}`;
      sessionStorage.setItem("lumea-demo-transaction-id", transactionId);
      trackEvent("purchase", {
        ...checkoutParameters,
        transaction_id: transactionId,
      }, "Purchase");
      trackEvent("subscription_start", {
        ...checkoutParameters,
        value: 29,
        items: checkoutParameters.items.map((item) => ({ ...item, price: 29 })),
        transaction_id: transactionId,
        subscription_interval: "month",
        subscription_price: 29,
      });
    }
  };

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
      if (passwordInput.value.trim() === FACHKREISE_DEMO_PASSWORD) {
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

  // Cookie settings control optional Meta marketing and analytics categories.
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
      if (value.marketing) {
        loadMetaPixel();
        trackCheckoutEvents();
      }
      banner.hidden = true;
    };
    const saved = read();
    if (!saved) banner.hidden = false;
    else {
      marketing.checked = Boolean(saved.marketing);
      analytics.checked = Boolean(saved.analytics);
      if (saved.marketing) loadMetaPixel();
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

  trackCheckoutEvents();
})();