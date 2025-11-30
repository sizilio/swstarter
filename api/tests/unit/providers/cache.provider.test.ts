import '../../mocks/redis.mock';
import '../../mocks/logger.mock';
import { redisMock } from '../../mocks/redis.mock';
import { loggerMock } from '../../mocks/logger.mock';
import { cacheProvider, CACHE_TTL, CACHE_KEYS } from '../../../providers/cache.provider';

describe('Cache Provider', () => {
  describe('CACHE_TTL', () => {
    it('should have correct TTL for search people', () => {
      expect(CACHE_TTL.SEARCH_PEOPLE).toBe(3600);
    });

    it('should have correct TTL for search movies', () => {
      expect(CACHE_TTL.SEARCH_MOVIES).toBe(86400);
    });

    it('should have correct TTL for detail people', () => {
      expect(CACHE_TTL.DETAIL_PEOPLE).toBe(3600);
    });

    it('should have correct TTL for detail movies', () => {
      expect(CACHE_TTL.DETAIL_MOVIES).toBe(86400);
    });
  });

  describe('CACHE_KEYS', () => {
    it('should generate correct key for searchPeople', () => {
      expect(CACHE_KEYS.searchPeople('Luke')).toBe('swapi:people:search:luke');
    });

    it('should convert search term to lowercase', () => {
      expect(CACHE_KEYS.searchPeople('LUKE SKYWALKER')).toBe('swapi:people:search:luke skywalker');
    });

    it('should generate correct key for searchMovies', () => {
      expect(CACHE_KEYS.searchMovies('Hope')).toBe('swapi:movies:search:hope');
    });

    it('should generate correct key for detailPeople', () => {
      expect(CACHE_KEYS.detailPeople('1')).toBe('swapi:people:detail:1');
    });

    it('should generate correct key for detailMovies', () => {
      expect(CACHE_KEYS.detailMovies('4')).toBe('swapi:movies:detail:4');
    });
  });

  describe('cacheProvider.get', () => {
    it('should return parsed data when cache hit', async () => {
      const mockData = { name: 'Luke Skywalker' };
      redisMock.get.mockResolvedValue(JSON.stringify(mockData));

      const result = await cacheProvider.get<typeof mockData>('test-key');

      expect(result).toEqual(mockData);
      expect(redisMock.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null when cache miss', async () => {
      redisMock.get.mockResolvedValue(null);

      const result = await cacheProvider.get('test-key');

      expect(result).toBeNull();
    });

    it('should return null and log error on redis failure', async () => {
      const error = new Error('Redis connection failed');
      redisMock.get.mockRejectedValue(error);

      const result = await cacheProvider.get('test-key');

      expect(result).toBeNull();
      expect(loggerMock.error).toHaveBeenCalledWith(
        { key: 'test-key', error: 'Redis connection failed' },
        'Cache get error'
      );
    });
  });

  describe('cacheProvider.set', () => {
    it('should set data with TTL', async () => {
      const mockData = { name: 'Luke Skywalker' };
      redisMock.setEx.mockResolvedValue('OK');

      await cacheProvider.set('test-key', mockData, 3600);

      expect(redisMock.setEx).toHaveBeenCalledWith(
        'test-key',
        3600,
        JSON.stringify(mockData)
      );
    });

    it('should log error on redis failure', async () => {
      const error = new Error('Redis write failed');
      redisMock.setEx.mockRejectedValue(error);

      await cacheProvider.set('test-key', { data: 'test' }, 3600);

      expect(loggerMock.error).toHaveBeenCalledWith(
        { key: 'test-key', error: 'Redis write failed' },
        'Cache set error'
      );
    });
  });

  describe('cacheProvider.del', () => {
    it('should delete key from cache', async () => {
      redisMock.del.mockResolvedValue(1);

      await cacheProvider.del('test-key');

      expect(redisMock.del).toHaveBeenCalledWith('test-key');
    });

    it('should log error on redis failure', async () => {
      const error = new Error('Redis delete failed');
      redisMock.del.mockRejectedValue(error);

      await cacheProvider.del('test-key');

      expect(loggerMock.error).toHaveBeenCalledWith(
        { key: 'test-key', error: 'Redis delete failed' },
        'Cache del error'
      );
    });
  });

  describe('cacheProvider.exists', () => {
    it('should return true when key exists', async () => {
      redisMock.exists.mockResolvedValue(1);

      const result = await cacheProvider.exists('test-key');

      expect(result).toBe(true);
      expect(redisMock.exists).toHaveBeenCalledWith('test-key');
    });

    it('should return false when key does not exist', async () => {
      redisMock.exists.mockResolvedValue(0);

      const result = await cacheProvider.exists('test-key');

      expect(result).toBe(false);
    });

    it('should return false and log error on redis failure', async () => {
      const error = new Error('Redis exists failed');
      redisMock.exists.mockRejectedValue(error);

      const result = await cacheProvider.exists('test-key');

      expect(result).toBe(false);
      expect(loggerMock.error).toHaveBeenCalledWith(
        { key: 'test-key', error: 'Redis exists failed' },
        'Cache exists error'
      );
    });
  });
});
