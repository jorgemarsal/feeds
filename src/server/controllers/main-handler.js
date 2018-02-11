const _ = require('lodash');

class MainHandler {
    constructor(opts) {
        if (!opts.logger) {
            throw new Error('missing logger');
        }
        if (!opts.articleService) {
            throw new Error('missing articleService');
        }
        if (!opts.feedService) {
            throw new Error('missing feedService');
        }
        this._logger = opts.logger;
        this._articleService = opts.articleService;
        this._feedService = opts.feedService;
    }

    getSubscribedToArticles() {
        return async (req, res, next) => {
            try {
                // 1. Get List of feeds the user is subscribed to
                const feeds = await this._feedService.getFeedsForUser(req.query.user);
                const articles = await Promise.all(_.map(feeds, async (feed) => {
                    const articles = await this._feedService.getArticles(req.query.begin, req.query.end, feed.feedId);
                    return this._articleService.getArticles(_.map(articles, article => article.articleId));
                }));
                const jsonArticles = _.map(articles, a => _.map(a, b => b.toJSON()));  // convert to JSON so we can add new keys
                _.forEach(_.zip(jsonArticles, feeds), item => {
                    const [arts, feed] = item;
                    _.forEach(arts, article => {
                        article.feed = feed.feedName;
                    })
                })
                res.status(200).send(_.flatten(jsonArticles));
            } catch(err) {
                return next(err);
            }
        }
    }

    addArticle() {
        return async (req, res, next) => {
            try {
                const article = await this._articleService.addArticle(req.body);
                const feed = await this._feedService.getFeed(req.query.feed);
                await this._feedService.addArticle(article.id, article.createdAt, req.query.feed, feed.name);
                res.status(201).send('ok');
            } catch(err) {
                return next(err);
            }
        }
    }

   
}

module.exports = MainHandler;
