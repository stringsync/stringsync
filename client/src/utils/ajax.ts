import $ from 'jquery';

export const ajax = (url: string, settings: JQuery.AjaxSettings = {}): JQuery.jqXHR => {
  const dupSettings = { ...settings };

  const headers = {
    ...window.ss.auth.retrieveData('authHeaders'),
    ...(dupSettings.headers || {})
  };

  delete dupSettings.headers;

  return $.ajax(url, {
    headers,
    ...dupSettings
  });
};
