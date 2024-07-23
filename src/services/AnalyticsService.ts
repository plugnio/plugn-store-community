import store from "@/store";
import { appendHTML } from "./HTMLService";
import mixpanel from 'mixpanel-browser';
 
// Set this to a unique identifier for the user performing the event.
//mixpanel.identify('USER_ID')


declare const ga;
declare const fbq;
declare const snaptr;

declare let window;

export async function startTiktokPixelWithId(tiktok_pixel_id: string) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }
  
  const html = `
    <script>
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++
  )ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=i+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
        ttq.load('` + tiktok_pixel_id + `');
        ttq.page();
      }(window, document, 'ttq');
    </script>
  `;

  appendHTML(html);
}

export async function startGoogleTagWithId(google_tag_id: string) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }
  const html = `
    <script async src='https://www.googletagmanager.com/gtag/js?id=` + google_tag_id + `'></script>
    
    <script>
      window.dataLayer = window.dataLayer || [];
    
      function gtag(){dataLayer.push(arguments);}
    
      gtag('js', new Date());
    
      gtag('config', '` + google_tag_id + `');
    
    </script>
  `;

  appendHTML(html);
}

export async function startGoogleTagManagerWithId(google_tag_manager_id: string) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }

  const html = `
    
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','` + google_tag_manager_id + `');</script>
    <!-- End Google Tag Manager -->

    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=` + google_tag_manager_id + `"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;

    appendHTML(html);
}

export async function startSnapchatPixilWithId(snapchatPixilId: string) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }

  const html = `
    <!-- Snap Pixel Code -->
    <script type='text/javascript'>
    (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
    {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
    a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
    r.src=n;var u=t.getElementsByTagName(s)[0];
    u.parentNode.insertBefore(r,u);})(window,document,
    'https://sc-static.net/scevent.min.js');
    
    snaptr('init',  '` + snapchatPixilId + `', {
    'user_email': '_INSERT_USER_EMAIL_'
    });

    snaptr('track', 'PAGE_VIEW');
    
    </script>
    <!-- End Snap Pixel Code -->`;

    appendHTML(html);
}
/**
 * start fb pixil tracking
 * @param facebook_pixil_id 
 */
export async function startFbPixilWithId(facebookPixilId: string) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }

  const html = `
    <!-- Facebook Pixel Code -->
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '` + facebookPixilId + `');
        fbq('track', 'PageView');
    </script>

    <noscript>
            <img height='1' width='1' style='display:none'
        src='https://www.facebook.com/tr?id= ` + facebookPixilId + ` &ev=PageView&noscript=1'
        />
    </noscript>
    <!-- End Facebook Pixel Code -->`;

    appendHTML(html);
}
 
/**
 * Start Tracker
 * @param id 
 */
export async function startGoogleAnalytics(id: string) {
//todo: global track 
  
if(!store.state.store) {
  return null; 
}

  if (typeof ga == "undefined")
    return false;

  try {

    ga('create', {
      storage: 'none',
      trackingId: id,
      //clientId: clientIdValue
    });
    ga('set', 'checkProtocolTask', null);
    ga('set', 'transportUrl', 'https://www.google-analytics.com/collect');
    /*ga((tracker: any) => {
       
        if (!value) {
          Storage.set({
            key: 'ga:clientId',
            value: JSON.stringify(tracker.get('clientId'))
          }).then();
        }
      })
    });*/
  } catch (error: any) {
    console.error(JSON.stringify(error.message));
  }
}

/**
 * Track Screen View
 * @param screenName 
 */
export async function trackView(screenName, itemName = null, itemPrice = null) {
  
  let params = {
    company_id: store.state.restaurant_uuid,
    store_id : store.state.restaurant_uuid,
    language : store.state.language?.code,
    channel : "Store Web App",
    role : store.state.isLogin? "Login User": "Guest"
  };

  mixpanel.track_pageview({"page": screenName, ...params});
  
  window.analytics.page(screenName, itemName);

  //todo: global track 

  if(!store.state.store) {
    return null; 
  }

  if (store.state.store.google_analytics_id) {
    try {
      ga('set', 'page', screenName);
      ga('send', 'pageview');
    } catch (error) {
      //   console.error( JSON.stringify(error.message));
    }
  }

  if (store.state.store.facebook_pixil_id) {
    try {
      fbq('track', 'ViewContent', {
        content_name: screenName,
        value: itemPrice,
        currency: store.state.currency
      });
    } catch (error) {
      console.error( JSON.stringify(error.message));
    }
  }

  //VIEW_CONTENT
  if (store.state.store.snapchat_pixil_id) {
    try {
      snaptr('track', "PAGE_VIEW", {
        content_name: screenName,
        value: itemPrice,
        currency: store.state.currency
      });
    } catch (err) { 
      console.error(err);
    }
  }
}

/**
 * Track Screen View
 * @param screenName 
 */
export async function purchaseEventFacebookPixil(totalAmount) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }

  try {
    fbq('track', 'Purchase', { value: totalAmount, currency: store.state.currency });
  } catch (err) { 
    console.error(err);
  }
}

/**
 * Track Screen View
 * @param screenName 
 */
export async function initiateCheckoutEventFacebookPixil(totalAmount) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }

  try {
    fbq('track', 'InitiateCheckout',
      {
        value: totalAmount,
        currency: store.state.currency // or set to empty string
      });
  } catch (err) { 
    console.error(err);
  }
}

/**
 * purchaseEventSnapchatPixil
 * @param totalAmount 
 * @param currency 
 * @param orderUuid 
 */
export async function purchaseEventSnapchatPixil(totalAmount, currency) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }

  try {
    snaptr('track', 'PURCHASE', { 'currency': currency, 'price': totalAmount });
  } catch (err) { 
    console.error(err);
  }
}


/**
 * addToCartEventFacebookPixel
 * @param totalAmount 
 * @param currency 
 * @param orderUuid 
 */
export async function addToCartEventFacebookPixel(itemUuid, itemName, itemPrice) {
  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }

  if (store.state.store.facebook_pixil_id) {
    try {
      fbq('track', 'AddToCart', {
        content_ids: itemUuid,
        content_name: itemName,
        content_type: 'product',
        value: itemPrice,
        currency: store.state.currency
      });
    } catch (err) { 
      console.error(err);
    }
  }
}

/**
 * Track Event
 * @param category 
 * @param action 
 * @param label 
 * @param value 
 */
export async function trackEvent(category, action, label?, value?, price?, itemUuid?) {
 
  const props = {
    'action': action,
    'label': label,
    'value': value, 
    price: price, 
    itemUuid: itemUuid,
    company_id: store.state.restaurant_uuid,
    store_id : store.state.restaurant_uuid,
    language : store.state.language?.code,
    channel : "Store Web App",
    role : store.state.isLogin? "Login User": "Guest"
  };

  if(window.analytics) {
    window.analytics.track(action, props);
  }

  mixpanel.track(action, props);

  //todo: global track 
  
  if(!store.state.store) {
    return null; 
  }

  if (store.state.store.google_analytics_id) {
    try {
      ga('send', 'event', {
        eventCategory: category,
        eventLabel: label,
        eventAction: action,
        eventValue: value
      });
    } catch (error) {
      console.error(JSON.stringify(error.message));
    }
  }

  if (action == 'add-to-cart' && store.state.store.facebook_pixil_id) {
    addToCartEventFacebookPixel(itemUuid, value, price);
  }

  if (action == 'add-to-cart' && store.state.store.snapchat_pixil_id) {
    try {
      snaptr('track', "ADD_CART", {
        'currency': store.state.currency,
        'price': price
      });
    } catch (err) { 
      console.error(err);
    }
  }
}