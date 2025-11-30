// SWAPI Mock Data Fixtures

export const mockPersonSearchResponse = {
  message: 'ok',
  result: [
    {
      uid: '1',
      description: 'A person within the Star Wars universe',
      properties: {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.tech/api/planets/1',
        films: [
          'https://swapi.tech/api/films/1',
          'https://swapi.tech/api/films/2',
        ],
        url: 'https://swapi.tech/api/people/1',
      },
    },
  ],
};

export const mockFilmSearchResponse = {
  message: 'ok',
  result: [
    {
      uid: '1',
      description: 'A Star Wars film',
      properties: {
        title: 'A New Hope',
        episode_id: 4,
        opening_crawl: 'It is a period of civil war...',
        director: 'George Lucas',
        producer: 'Gary Kurtz, Rick McCallum',
        release_date: '1977-05-25',
        characters: [
          'https://swapi.tech/api/people/1',
          'https://swapi.tech/api/people/2',
        ],
        url: 'https://swapi.tech/api/films/1',
      },
    },
  ],
};

export const mockPersonDetailResponse = {
  message: 'ok',
  result: {
    uid: '1',
    description: 'A person within the Star Wars universe',
    properties: {
      name: 'Luke Skywalker',
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      homeworld: 'https://swapi.tech/api/planets/1',
      films: ['https://swapi.tech/api/films/1'],
      url: 'https://swapi.tech/api/people/1',
    },
  },
};

export const mockFilmDetailResponse = {
  message: 'ok',
  result: {
    uid: '1',
    description: 'A Star Wars film',
    properties: {
      title: 'A New Hope',
      episode_id: 4,
      opening_crawl: 'It is a period of civil war...',
      director: 'George Lucas',
      producer: 'Gary Kurtz, Rick McCallum',
      release_date: '1977-05-25',
      characters: ['https://swapi.tech/api/people/1'],
      url: 'https://swapi.tech/api/films/1',
    },
  },
};

export const mockEmptySearchResponse = {
  message: 'ok',
  result: [],
};

export const mockStatistics = {
  id: 1,
  topQueries: [
    { search_term: 'luke', count: '10', percentage: '50' },
    { search_term: 'vader', count: '6', percentage: '30' },
  ],
  avgResponseTime: 150.5,
  mostPopularHour: 14,
  totalQueries: 20,
  computedAt: new Date('2024-01-01T12:00:00Z'),
};
