export const loggerMock = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  fatal: jest.fn(),
};

jest.mock('../../lib/logger', () => ({
  __esModule: true,
  default: loggerMock,
  logger: loggerMock,
}));

beforeEach(() => {
  jest.clearAllMocks();
});
