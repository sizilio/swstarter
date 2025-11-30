import axios from 'axios';

jest.mock('axios');

export const axiosMock = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks();
});
