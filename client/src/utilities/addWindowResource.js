const addWindowResource = (key, value, namespace = 'ss') => {
  window[namespace] = window[namespace] || {};
  window[namespace][key] = value;
};

export default addWindowResource;
