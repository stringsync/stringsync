const configureEnv = () => {
  if (!window.ss.env) {
    window.ss.env = 'test';
  }
};

export default configureEnv;
