import prisma from '../lib/prisma';
import { Statistic, Prisma } from '@prisma/client';
import { TopQuery } from '../types';

export const statisticRepository = {
  async create(data: {
    topQueries: TopQuery[];
    avgResponseTime: number;
    mostPopularHour: number;
    totalQueries: number;
  }): Promise<Statistic> {
    return prisma.statistic.create({
      data: {
        topQueries: data.topQueries as unknown as Prisma.InputJsonValue,
        avgResponseTime: new Prisma.Decimal(data.avgResponseTime),
        mostPopularHour: data.mostPopularHour,
        totalQueries: data.totalQueries,
      },
    });
  },

  async getLatest(): Promise<Statistic | null> {
    return prisma.statistic.findFirst({
      orderBy: { computedAt: 'desc' },
    });
  },

  async cleanOld(keepCount: number = 10): Promise<void> {
    const latestIds = await prisma.statistic.findMany({
      select: { id: true },
      orderBy: { computedAt: 'desc' },
      take: keepCount,
    });

    const idsToKeep = latestIds.map((s) => s.id);

    if (idsToKeep.length > 0) {
      await prisma.statistic.deleteMany({
        where: { id: { notIn: idsToKeep } },
      });
    }
  },
};
