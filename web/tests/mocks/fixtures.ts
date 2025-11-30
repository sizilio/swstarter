// Fixtures de teste - baseado no backend (api/tests/mocks/swapi.fixtures.ts)

import { SearchResponse, DetailResponse, SwapiPerson, SwapiFilm, SwapiPersonWithFilms, SwapiFilmWithCharacters } from '~/types';

// Person mock data
export const mockPerson: SwapiPerson = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.tech/api/planets/1',
  films: ['https://swapi.tech/api/films/1', 'https://swapi.tech/api/films/2'],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.tech/api/people/1',
};

// Film mock data
export const mockFilm: SwapiFilm = {
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl: 'It is a period of civil war...',
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1977-05-25',
  characters: ['https://swapi.tech/api/people/1', 'https://swapi.tech/api/people/2'],
  planets: [],
  starships: [],
  vehicles: [],
  species: [],
  created: '2014-12-10T14:23:31.880000Z',
  edited: '2014-12-20T19:49:45.256000Z',
  url: 'https://swapi.tech/api/films/1',
};

// Search Response - People
export const mockPersonSearchResponse: SearchResponse<SwapiPerson> = {
  success: true,
  data: {
    message: 'ok',
    result: [
      {
        uid: '1',
        properties: mockPerson,
        description: 'A person within the Star Wars universe',
      },
    ],
  },
  count: 1,
  responseTime: 150,
};

// Search Response - Films
export const mockFilmSearchResponse: SearchResponse<SwapiFilm> = {
  success: true,
  data: {
    message: 'ok',
    result: [
      {
        uid: '1',
        properties: mockFilm,
        description: 'A Star Wars film',
      },
    ],
  },
  count: 1,
  responseTime: 120,
};

// Empty Search Response
export const mockEmptySearchResponse: SearchResponse<SwapiPerson> = {
  success: true,
  data: {
    message: 'ok',
    result: [],
  },
  count: 0,
  responseTime: 100,
};

// Person Detail Response (with films data)
export const mockPersonDetailResponse: DetailResponse<SwapiPersonWithFilms> = {
  success: true,
  data: {
    message: 'ok',
    result: {
      uid: '1',
      properties: {
        ...mockPerson,
        filmsData: [mockFilm],
      },
      description: 'A person within the Star Wars universe',
    },
  },
};

// Film Detail Response (with characters data)
export const mockFilmDetailResponse: DetailResponse<SwapiFilmWithCharacters> = {
  success: true,
  data: {
    message: 'ok',
    result: {
      uid: '1',
      properties: {
        ...mockFilm,
        charactersData: [mockPerson],
      },
      description: 'A Star Wars film',
    },
  },
};

// Search result items for component testing
export const mockPersonSearchResult = {
  uid: '1',
  properties: mockPerson,
  description: 'A person within the Star Wars universe',
};

export const mockFilmSearchResult = {
  uid: '1',
  properties: mockFilm,
  description: 'A Star Wars film',
};
