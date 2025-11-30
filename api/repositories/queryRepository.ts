import prisma from '../lib/prisma';
import { Query } from '@prisma/client';

export const queryRepository = {
  async create(data: {
    searchTerm: string;
    searchType: string;
    resultsCount: number;
    responseTimeMs: number;
  }): Promise<Query> {
    return prisma.query.create({ data });
  },

  async findAll(): Promise<Query[]> {
    return prisma.query.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async findByDateRange(startDate: Date, endDate: Date): Promise<Query[]> {
    return prisma.query.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });
  },

  async count(): Promise<number> {
    return prisma.query.count();
  },

  async getAverageResponseTime(): Promise<number> {
    const result = await prisma.query.aggregate({
      _avg: { responseTimeMs: true },
    });
    return result._avg.responseTimeMs ?? 0;
  },
};
