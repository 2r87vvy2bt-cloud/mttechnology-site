// Google tag bootstrap with Consent Mode v2.
// Loads a single gtag.js and configures both Google Analytics (GA4) and
// Google Ads conversion tracking. Analytics/ad storage stay denied until the
// visitor accepts cookies in the consent banner (see cookie.js). Returning
// visitors who already granted consent are recognised from the
// `cookie-consent` cookie on load.
(function () {
  var GA_ID = 'G-S7CNT2ZNR7';      // Google Analytics 4
  var ADS_ID = 'AW-18246770209';   // Google Ads conversion tracking

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('js', new Date());

  var alreadyGranted = /(?:^|;\s*)cookie-consent=granted(?:;|$)/.test(document.cookie);
  var initial = alreadyGranted ? 'granted' : 'denied';
  gtag('consent', 'default', {
    analytics_storage: initial,
    ad_storage: initial,
    ad_user_data: initial,
    ad_personalization: initial
  });

  gtag('config', GA_ID);
  gtag('config', ADS_ID);

  // Called by the cookie banner when the visitor clicks Allow / Deny.
  window.setAnalyticsConsent = function (allowed) {
    var state = allowed ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: state,
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state
    });
  };

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
})();
