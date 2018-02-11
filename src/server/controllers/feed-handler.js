const _ = require('lodash');

class FeedHandler {
    constructor(opts) {
        if (!opts.logger) {
            throw new Error('missing logger');
        }
        if (!opts.feedService) {
            throw new Error('missing articleService');
        }
        this._logger = opts.logger;
        this._feedService = opts.feedService;
    }

    getFeedsForUser() {
        return async (req, res, next) => {
            try {
                const feeds = await this._feedService.getFeedsForUser(req.query.user);
                res.status(200).send(feeds);
            } catch(err) {
                return next(err);
            }
        }
    }

    getAllFeeds() {
        return async (req, res, next) => {
            try {
                const rsp = await this._feedService.getAllFeeds();
                res.status(200).send(rsp);
            } catch(err) {
                return next(err);
            }
        }
    }

    getFeed() {
        return async (req, res, next) => {
            try {
                const rsp = await this._feedService.getFeed(req.params.id);
                if (!rsp) {
                    res.status(404).send(rsp);    
                } else {
                    res.status(200).send(rsp);
                }
            } catch(err) {
                return next(err);
            }
        }
    }

    subscribe() {
        return async (req, res, next) => {
            try {
                if (isNaN(req.query.user)) {
                    res.status(400).send('Invalid user');
                } else {
                    // get feed name
                    const feed = await this._feedService.getFeed(req.params.id);
                    await this._feedService.subscribe(req.query.user, req.params.id, feed.name);
                    res.status(200).send('ok');
                }
            } catch(err) {
                return next(err);
            }
        }
    }

    unsubscribe() {
        return async (req, res, next) => {
            try {
                if (isNaN(req.query.user)) {
                    res.status(400).send('Invalid user');
                } else {
                    await this._feedService.unsubscribe(req.query.user, req.params.id);
                    res.status(200).send('ok');
                }
            } catch(err) {
                return next(err);
            }
        }
    }

    addArticle() {
        return async (req, res, next) => {
            try {
                if (isNaN(req.body.article)) {
                    res.status(400).send('Invalid articleId');
                } else {
                    const feed = await this._feedService.getFeed(req.query.feed);
                    await this._feedService.addArticle(req.body.article, req.body.createdAt, req.params.id, feed.name);
                    res.status(200).send('ok');
                }
            } catch(err) {
                return next(err);
            }
        }
    }

    getArticles() {
        return async (req, res, next) => {
            try {
                // TODO check dates are well formed
                const rsp = await this._feedService.getArticles(req.query.begin, req.query.end, req.params.id);
                res.status(200).send(rsp);
            } catch(err) {
                return next(err);
            }
        }
    }
}

module.exports = FeedHandler;