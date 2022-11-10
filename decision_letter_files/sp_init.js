"use strict";


var s1_appID = document._snowplow._appid; // Registered ScholarOne Manuscripts snowplow app ID
var s1_platform = document._snowplow._platform; // Type of app platform (web, mobile etc) - 'srv' = Server side web app
var s1_domain = document._snowplow._domain; // Domain of web app
var s1_spCookieName = document._snowplow._cookiename; // Snowplow cookie name
var sp_js_loc = document._snowplow._js_loc; // Relative location of snowplow javascript
var sp_collector = document._snowplow._endpoint; // Snowplow collector endpoint

var usePOST = true;

(function ()
{
  try
  {    
    (function (p, l, o, w, i, n, g) {
      if (!p[i]) {
        p.GlobalSnowplowNamespace = p.GlobalSnowplowNamespace || [];
        p.GlobalSnowplowNamespace.push(i);
        p[i] = function () {
          (p[i].q = p[i].q || []).push(arguments)
        };
        p[i].q = p[i].q || [];
        n = l.createElement(o);
        g = l.getElementsByTagName(o)[0];
        n.async = 1;
        n.src = w;
        g.parentNode.insertBefore(n, g)
      }
    }(window, document, "script", sp_js_loc, "s1_snowplow"));

    function createTracker()
    {
      // The vileness of IE forces us to use this dirty hack
﻿     if(window.ActiveXObject || "ActiveXObject" in window)
      {
        usePOST = false;
      }
      s1_snowplow("newTracker", "s1_tracker", sp_collector,
              {
                appId: s1_appID,
                platform: s1_platform,
                cookieDomain: s1_domain,
                cookieName: s1_spCookieName,
                encodeBase64: true,
                respectDoNotTrack: false,
                userFingerprint: true,
                forceSecureTracker: true,
                post: usePOST,
                contexts: {
                  webPage: true,
                  performanceTiming: true,
                  gaCookies: false,
                  geolocation: false
                }
              });
    }
    
    createTracker();
  }
  catch (err)
  {
    err.toString();
  }
}());
