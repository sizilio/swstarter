export const redisMock = {
  get: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  exists: jest.fn(),
  ping: jest.fn(),
  connect: jest.fn(),
  quit: jest.fn(),
  on: jest.fn(),
  isReady: true, // Redis is ready by default in tests
};

jest.mock('../../lib/redis', () => ({
  __esModule: true,
  default: redisMock,
}));

beforeEach(() => {
  jest.clearAllMocks();
  redisMock.isReady = true; // Reset to ready state
});
