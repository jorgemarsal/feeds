const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

class ArticleMgr {
    constructor(opts) {
        if (!opts.db) {
            throw new Error('missing db');
        }
        if (!opts.logger) {
            throw new Error('missing logger');
        }
        
        this.db = opts.db;
        this.logger = opts.logger;
        this.cache = opts.cache;  // optional cache
    }

    async getArticle(id) {
        try {
            if (this.cache && this.cache.has(id)) {
                return this.cache.get(id); 
            } else {
                const article = await this.db.Articles.findOne({
                    where: {
                        id,
                    }});
                if (this.cache) {
                    this.cache.set(id, article.toJSON());
                }
                return article;
            }
        } catch (err) {
            this.logger.error({ err }, `Error fetching article with id: ${id}`)
        }
    }

    async getArticles(idsOrString) {
        const ids = Array.isArray(idsOrString) ? idsOrString : [idsOrString];
        try {
            const idsInCache = _.filter(ids, id => this.cache.has(id));
            const articles = _.map(idsInCache, id => this.cache.get(id));
            const notInCache = _.difference(ids, idsInCache);
            const rest = await this.db.Articles.findAll({
                where: {
                    id: {
                        [Op.in]: notInCache,
                    }
                }
            });
            return articles.concat(rest);
        } catch (err) {
            this.logger.error({ err }, `Error fetching article with ids: ${idsOrString}`)
        }
    }

    async addArticle(article) {
        try {
            return await this.db.Articles.create({
                title: article.title,
                contents: article.contents,
            });
        } catch (err) {
            this.logger.error({ err, article }, `Error adding article`)
            throw err;
        }
    }
}

module.exports = ArticleMgr;