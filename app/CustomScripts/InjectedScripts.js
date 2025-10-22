// These scripts help the app serve a smooth user experience

// smoothNavigation provides refresh free navigation regardless of
// how the user chooses to navigate
export const smoothNavigation = (route) => {
  return `
      (function() {
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', '${route}');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'urlChange',
          url: window.location.href
        }));
      })();
      true;
`;
};

// the functions name is self explanatory. It prevents refresh when the user navigates back
export const preventRefreshOnBack = (previousUrl) => {
  return `
      (function() {
        if (window.history && window.history.pushState) {
          window.history.pushState({}, '', '${previousUrl}');
          window.dispatchEvent(new PopStateEvent('popstate'));
          
          // Post message to update React state
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'urlChange',
            url: '${previousUrl}'
          }));
        }
      })();
      true;
`;
};

// detects scroll in order to smoothly implement "pull to refresh"
export const scrollDetector = `
    let isScrolling;
    window.addEventListener('scroll', function() {
      window.clearTimeout(isScrolling);
      isScrolling = setTimeout(function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'scroll',
          scrollY: window.scrollY
        }));
      }, 50);
    }, false);

    window.addEventListener('popstate', function() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'popstate',
        url: window.location.href
      }));
    });

    // Initial scroll position
    window.ReactNativeWebView.postMessage(JSON.stringify({ 
      type: 'scroll', 
      scrollY: window.scrollY 
    }));
`;

// prevents zoom for the best experience
export const preventZoom = `
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    document.getElementsByTagName('head')[0].appendChild(meta);
`;

// detectes if specific classes are active then sends a request to disable pull to refresh
export const classActivityDetector = `
  (function() {
  const targetClasses = [".dropdownMenuCard", ".sidenav-toggler.active"];

    function sendStatus(activeClasses) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "activeClasses",
        value: activeClasses
      }));
    }

    function checkClasses() {
      const activeClasses = targetClasses.filter(cls => document.querySelector(cls));
      const active = activeClasses.length > 0;

      // Only send update if something changed
      const lastState = JSON.stringify(window.__lastClassActiveState || []);
      const currentState = JSON.stringify(activeClasses);

      if (lastState !== currentState) {
        window.__lastClassActiveState = activeClasses;
        sendStatus(activeClasses);
      }
    }

    // Observe DOM changes
    const observer = new MutationObserver(checkClasses);
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    // Run initially
    checkClasses();
  })();
`;
