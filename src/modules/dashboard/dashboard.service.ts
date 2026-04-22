import { desc, eq, aliasedTable, sql, getTableColumns } from "drizzle-orm";
import { db } from "../../db";
import { animes, topics, users } from "../../db/schema";
import { AnimeStatusEnum } from "../../interfaces/Anime";

export const DashboardService = {
  getDashboardData: async () => {
    const updatedByUsers = aliasedTable(users, "updatedByUsers");

    const recentAnimesFetch = await db
      .select({
        anime: animes,
        createdByUser: {
          name: users.name,
          userName: users.userName,
          rank: users.rank,
          avatarUrl: users.avatarUrl,
        },
        updatedByUser: {
          name: updatedByUsers.name,
          userName: updatedByUsers.userName,
          rank: updatedByUsers.rank,
          avatarUrl: updatedByUsers.avatarUrl,
        },
      })
      .from(animes)
      .leftJoin(users, eq(animes.createdByUserId, users.id))
      .leftJoin(updatedByUsers, eq(animes.updatedByUserId, updatedByUsers.id))
      .orderBy(desc(animes.createdAt))
      .limit(5);

    const recentAnimes = recentAnimesFetch.map((row) => {
      const { createdByUserId, updatedByUserId, ...animeData } = row.anime;
      return {
        ...animeData,
        createdByUser: row.createdByUser,
        updatedByUser: row.updatedByUser,
      };
    });

    const recentTopicsFetch = await db
      .select({
        topic: topics,
        createdByUser: {
          name: users.name,
          userName: users.userName,
          rank: users.rank,
          avatarUrl: users.avatarUrl,
        },
        updatedByUser: {
          name: updatedByUsers.name,
          userName: updatedByUsers.userName,
          rank: updatedByUsers.rank,
          avatarUrl: updatedByUsers.avatarUrl,
        },
      })
      .from(topics)
      .leftJoin(users, eq(topics.createdByUserId, users.id))
      .leftJoin(updatedByUsers, eq(topics.updatedByUserId, updatedByUsers.id))
      .orderBy(desc(topics.createdAt))
      .limit(5);

    const recentTopics = recentTopicsFetch.map((row) => {
      const { createdByUserId, updatedByUserId, ...topicData } = row.topic;
      return {
        ...topicData,
        createdByUser: row.createdByUser,
        updatedByUser: row.updatedByUser,
      };
    });

    const releasingAnimesSubquery = db
      .select({
        ...getTableColumns(animes),
        rn: sql<number>`row_number() over (partition by ${animes.createdByUserId} order by ${animes.updatedAt} desc)`.as(
          "rn",
        ),
      })
      .from(animes)
      .where(eq(animes.status, AnimeStatusEnum.RELEASING))
      .as("releasing_sq");

    const releasingAnimesFetch = await db
      .select({
        anime: {
          id: releasingAnimesSubquery.id,
          title: releasingAnimesSubquery.title,
          description: releasingAnimesSubquery.description,
          episodes: releasingAnimesSubquery.episodes,
          review: releasingAnimesSubquery.review,
          stars: releasingAnimesSubquery.stars,
          imageUrl: releasingAnimesSubquery.imageUrl,
          status: releasingAnimesSubquery.status,
          createdAt: releasingAnimesSubquery.createdAt,
          updatedAt: releasingAnimesSubquery.updatedAt,
        },
        createdByUser: {
          name: users.name,
          userName: users.userName,
          rank: users.rank,
          avatarUrl: users.avatarUrl,
        },
        updatedByUser: {
          name: updatedByUsers.name,
          userName: updatedByUsers.userName,
          rank: updatedByUsers.rank,
          avatarUrl: updatedByUsers.avatarUrl,
        },
      })
      .from(releasingAnimesSubquery)
      .leftJoin(users, eq(releasingAnimesSubquery.createdByUserId, users.id))
      .leftJoin(
        updatedByUsers,
        eq(releasingAnimesSubquery.updatedByUserId, updatedByUsers.id),
      )
      .where(eq(releasingAnimesSubquery.rn, 1))
      .orderBy(desc(releasingAnimesSubquery.updatedAt))
      .limit(5);

    const releasingAnimes = releasingAnimesFetch.map((row) => {
      return {
        ...row.anime,
        createdByUser: row.createdByUser,
        updatedByUser: row.updatedByUser,
      };
    });

    return {
      recentAnimes,
      recentTopics,
      releasingAnimes,
    };
  },
};
