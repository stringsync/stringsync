import $ from 'jquery';

// const beforeSend = (xhr, settings) => {
//   const { ss } = window;

//   // ensure use of proxy
//   if (ss.env === 'development' && typeof settings.url !== 'undefined') {
//     const url = new URL(`${location.protocol}//${location.host}${settings.url}`);
//     url.host = 'localhost:3001';
//     settings.url = url.toString();
//   }

//   ss.auth.appendAuthHeaders(xhr, settings);
// };

export const ajax = (url: string, settings: JQuery.AjaxSettings = {}): JQuery.jqXHR => (
  $.ajax(url, { headers: window.ss.auth.retrieveData('authHeaders'), ...settings })
);
