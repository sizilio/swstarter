// Mock do serviço de API

export const mockSearchPeople = jest.fn();
export const mockSearchMovies = jest.fn();
export const mockGetPersonById = jest.fn();
export const mockGetMovieById = jest.fn();

jest.mock('~/services/api', () => ({
  searchPeople: (...args: any[]) => mockSearchPeople(...args),
  searchMovies: (...args: any[]) => mockSearchMovies(...args),
  getPersonById: (...args: any[]) => mockGetPersonById(...args),
  getMovieById: (...args: any[]) => mockGetMovieById(...args),
}));

// Helper para resetar todos os mocks
export const resetApiMocks = () => {
  mockSearchPeople.mockReset();
  mockSearchMovies.mockReset();
  mockGetPersonById.mockReset();
  mockGetMovieById.mockReset();
};
