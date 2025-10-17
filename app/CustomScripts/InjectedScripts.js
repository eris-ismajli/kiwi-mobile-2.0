// These scripts help the app serve a smooth user experience

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

export const preventZoom = `
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    document.getElementsByTagName('head')[0].appendChild(meta);
`;
