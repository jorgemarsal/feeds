const Sequelize = require('sequelize');
const Op = Sequelize.Op
const _ = require('lodash');

class FeedMgr {
    constructor(opts) {
        if (!opts.db) {
            throw new Error('missing db');
        }
        if (!opts.logger) {
            throw new Error('missing logger');
        }
        
        this.db = opts.db;
        this.logger = opts.logger;
    }

    async getAllFeeds() {
        try {
            const feeds = await this.db.Feeds.findAll();
            return feeds;
        } catch (err) {
            this.logger.error({ err }, `Error getting feeds`)
        }
    }

    async getFeedsForUser(userId) {
        if (!userId) {
            return [];
        }
        try {
            const feeds = await this.db.UserFeeds.findAll({
                where: {
                    userId,
                }
            });
            return feeds;
        } catch (err) {
            this.logger.error({ err }, `Error getting feeds for user: ${userId}`)
        }
    }

    async getFeed(id) {
        try {
            return await this.db.Feeds.findOne({
                where: {
                    id,
                }
            })
        } catch (err) {
            this.logger.error({ err }, `Error getting feed: ${id}`)
        }
    }

    async getFeeds(ids) {
        try {
            return await this.db.Feeds.findAll({
                where: {
                    id: {
                        [Op.in]: ids,
                    }
                }
            })
        } catch (err) {
            this.logger.error({ err }, `Error getting feeds: ${ids}`)
        }
    }

    async subscribe(userId, feedId, feedName) {
        try {
            // NOTE: we aren't checking if userId or feedId exists
            return await this.db.UserFeeds.findOrCreate({
                where: {
                    userId,
                    feedId,
                    feedName,
                }
            })
        } catch (err) {
            this.logger.error({ err }, `Error subscribing user ${userId} to feed ${feedId}`)
            throw err;
        }
    }

    async unsubscribe(userId, feedId) {
        // NOTE: we aren't checking if userId or feedId exists
        try {
            return await this.db.UserFeeds.destroy({
                where: {
                    userId,
                    feedId,
                }
            })
        } catch (err) {
            this.logger.error({ err }, `Error unsubscribing user ${userId} from feed ${feedId}`);
            throw err;
        }
    }

    async addArticle(articleId, articleCreatedAt, feedId, feedName) {
        // NOTE: we aren't checking if feedId exists
        try {
            return await this.db.FeedArticles.findOrCreate({
                where: {
                    articleId,
                    articleCreatedAt,
                    feedId,
                    feedName,
                }
            })
        } catch (err) {
            this.logger.error({ err, articleId, feedId, articleCreatedAt }, 'Error adding article');
            throw err;
        }
    }

    async getArticles(beginDate, endDate, feedId) {
        // NOTE: we aren't checking if feedId exists
        try {
            return await this.db.FeedArticles.findAll({
                where: {
                    articleCreatedAt: {
                        [Op.lte]: endDate,
                        [Op.gt]: beginDate,
                    },
                    feedId,
                }
            })
        } catch (err) {
            this.logger.error({ err, beginDate, endDate, feedId }, 'Error getting articles');
        }
    }
}

module.exports = FeedMgr;