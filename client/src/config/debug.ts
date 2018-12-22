const configureDebug = () => {
  window.ss.debug = window.ss.env !== 'production';
};

export default configureDebug;
