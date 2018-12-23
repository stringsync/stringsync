export const xhrMock = () => ({
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn()
});
