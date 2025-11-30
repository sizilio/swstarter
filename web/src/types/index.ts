import { ReactNode } from 'react';

// swapi.tech response types (native format)
export interface SwapiSearchResponse<T> {
  message: string;
  result: Array<{
    uid: string;
    properties: T;
    description: string;
  }>;
}

export interface SwapiDetailResponse<T> {
  message: string;
  result: {
    uid: string;
    properties: T;
    description: string;
  };
}

// Person properties (inside result.properties)
export interface SwapiPerson {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

// Film properties (inside result.properties)
export interface SwapiFilm {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  created: string;
  edited: string;
  url: string;
}

// Hydrated types (with expanded nested data)
export interface SwapiPersonWithFilms extends SwapiPerson {
  filmsData: SwapiFilm[];
}

export interface SwapiFilmWithCharacters extends SwapiFilm {
  charactersData: SwapiPerson[];
}

// Search result item (from search response)
export interface SearchResultItem<T> {
  uid: string;
  properties: T;
  description: string;
}

// API Response Types (from our backend)
export interface SearchResponse<T> {
  success: boolean;
  data: SwapiSearchResponse<T>;
  count: number;
  responseTime: number;
}

export interface DetailResponse<T> {
  success: boolean;
  data: SwapiDetailResponse<T>;
}

// Search Type
export type SearchType = 'people' | 'movies';

// Component Props Types
export interface LayoutProps {
  children: ReactNode;
}

export interface SearchBarProps {
  onSearch: (term: string) => void;
  searchType: SearchType;
  onTypeChange: (type: SearchType) => void;
}

export interface ResultsListProps {
  results: SearchResultItem<SwapiPerson | SwapiFilm>[];
  type: SearchType;
  error: string;
  loading: boolean;
  onClear?: () => void;
}

export interface ResultCardProps {
  result: SearchResultItem<SwapiPerson | SwapiFilm>;
  type: SearchType;
}

export interface SkeletonLoaderProps {
  count?: number;
}
