
class ArticleHandler {
    constructor(opts) {
        if (!opts.logger) {
            throw new Error('missing logger');
        }
        if (!opts.articleService) {
            throw new Error('missing articleService');
        }
        this._logger = opts.logger;
        this._articleService = opts.articleService;
    }

    getOne() {
        return async (req, res, next) => {
            try {
                const rsp = await this._articleService.getArticle(req.params.id);
                res.status(200).send(rsp);
            } catch(err) {
                return next(err);
            }
        }
    }

    getMany() {
        return async (req, res, next) => {
            try {
                const rsp = await this._articleService.getArticles(req.query.id);
                res.status(200).send(rsp);
            } catch(err) {
                return next(err);
            }
        }
    }

    add() {
        return async (req, res, next) => {
            try {
                await this._articleService.addArticle(req.body);
                res.status(201).send('ok');
            } catch(err) {
                return next(err);
            }
        }
    }
}

module.exports = ArticleHandler;