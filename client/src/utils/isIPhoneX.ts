export const isIPhoneX = () => {
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const ratio = window.devicePixelRatio || 1;

  const screen = {
    width: window.screen.width * ratio,
    height: window.screen.height * ratio
  };

  return !!iOS && screen.width === 1125 && screen.height === 2436;
};
