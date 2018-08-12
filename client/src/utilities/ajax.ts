import * as $ from 'jquery';

export const ajax = (path: string, settings: JQuery.AjaxSettings): JQuery.jqXHR => {
  const url = `${window.ss.auth.getApiUrl()}${path}`;
  return $.ajax({ url,  ...settings});
};
