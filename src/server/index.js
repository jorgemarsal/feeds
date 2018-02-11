const path = require('path');
const bunyan = require('bunyan');
const express = require('express');
const bodyParser                 = require('body-parser');
const validate                   = require('express-jsonschema').validate;
const LRU = require("lru-cache")

const ArticleHandler = require('./controllers/article-handler');
const ArticleService = require('./article-service');
const FeedHandler = require('./controllers/feed-handler');
const FeedService = require('./feed-service');
const MainHandler = require('./controllers/main-handler');

const config = require('./config');
const DB = require('./db');

const _createLogger = () => {
    const loggerOptions = {
        name: config.get('logging.name'),
        streams: [],
        src: true,
        serializers: bunyan.stdSerializers
    };
    if (config.get('logging.stdout.enable')) {
        loggerOptions.streams.push({
            level: config.get('logging.stdout.level'),
            stream: process.stdout
        });
    }
    if (config.get('logging.file.enable')) {
        loggerOptions.streams.push({
            level: config.get('logging.file.level'),
            path: config.get('logging.file.path'),
        });
    }
    return bunyan.createLogger(loggerOptions);
}

const _createDB = () => {
    return new DB({
        type      : config.get('db.type'),
        host      : config.get('db.host'),
        port      : config.get('db.port'),
        name      : config.get('db.name'),
        user      : config.get('db.user'),
        password  : config.get('db.password'),
        sync      : config.get('db.sync'),
        forcesync : config.get('db.forcesync')
    });
}

const _createCache = () => {
    if (!config.get('cache.enabled')) {
        return;
    }
    return LRU({ 
        max: config.get('cache.size'),
        length: n => n.length,
    });
};

const logger = _createLogger();
const db = _createDB();
const cache = _createCache();

const articleService = new ArticleService({
    db,
    logger,
    cache,
});
const articleHandler = new ArticleHandler({
    logger,
    articleService,
});

const feedService = new FeedService({
    db,
    logger,
});
const feedHandler = new FeedHandler({
    logger,
    feedService,
});

const mainHandler = new MainHandler({
    logger,
    articleService,
    feedService,
});

const app = express();
app.use(bodyParser.json({ type: '*/json' }));
app.use(bodyParser.urlencoded({ extended: false }));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.get('/api/v1/article/:id', articleHandler.getOne());
app.get('/api/v1/articles', validate({
    query: {
        type: 'object',
        properties: {
            id: {
                type: 'String',
                pattern: '^[0-9]+$',
                required: true
            },
        },
        additionalProperties: false
    }    
}), articleHandler.getMany());
app.post('/api/v1/articles', validate({
    body: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                minLength: 1,
                required: true
            },
            contents: {
                type: 'string',
                minLength: 1,
                required: true
            },
        },
        additionalProperties: false
    }    
}), articleHandler.add());
app.get('/api/v1/feeds', validate({
    query: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                pattern: '^[0-9]+$',
                required: true
            },
        },
        additionalProperties: false
    }    
}), feedHandler.getFeedsForUser());
app.get('/api/v1/allfeeds', feedHandler.getAllFeeds());
app.get('/api/v1/feed/:id', feedHandler.getFeed());
app.post('/api/v1/feed/:id/subscribe', validate({
    query: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                pattern: '^[0-9]+$',
                required: true
            },
        },
        additionalProperties: false
    }    
}), feedHandler.subscribe());
app.post('/api/v1/feed/:id/unsubscribe', validate({
    query: {
        type: 'object',
        properties: {
            user: {
                type: 'string',
                pattern: '^[0-9]+$',
                required: true
            },
        },
        additionalProperties: false
    }    
}), feedHandler.unsubscribe());
app.post('/api/v1/feed/:id/article', validate({
    body: {
        type: 'object',
        properties: {
            article: {
                type: 'integer',
                required: true
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                required: true
            },
        },
        additionalProperties: false
    }    
}), feedHandler.addArticle());
app.get('/api/v1/feed/:id/articles', validate({
    query: {
        type: 'object',
        properties: {
            begin: {
                type: 'string',
                required: true
            },
            end: {
                type: 'string',
                required: true
            },
        },
        additionalProperties: false
    }    
}), feedHandler.getArticles());
app.get('/api/v1/', validate({
    query: {
        type: 'object',
        properties: {
            begin: {
                type: 'string',
                format: 'date-time',
                required: true
            },
            end: {
                type: 'string',
                format: 'date-time',
                required: true
            },
            user: {
                type: 'string',
                pattern: '^[0-9]+$',
                required: true
            },
        },
        additionalProperties: false
    }    
}), mainHandler.getSubscribedToArticles());
app.post('/api/v1/', validate({
    body: {
        type: 'object',
        properties: {
            title: {
                type: 'string',
                minLength: 1,
                required: true
            },
            contents: {
                type: 'string',
                minLength: 1,
                required: true
            },
        },
        additionalProperties: false
    }}), validate({
    query: {
        type: 'object',
        properties: {
            feed: {
                type: 'string',
                pattern: '^[0-9]+$',
                required: true
            },
        },
        additionalProperties: false
    }
    }), mainHandler.addArticle());

app.use('/', express.static(path.join(__dirname,'dist/')))


const onBodyValidationError = () => {
    return (err, req, res, next) => {
        // If this is not a JsonSchemaValidation error,
        // pass it down to the next error handler.
        if (err.name !== 'JsonSchemaValidation') {
            return next(err);
        } else {
            return next(new Error(JSON.stringify(err.validations)));
        }
    };
}

app.use(onBodyValidationError());


( async () => {
    try {
        await db.init();
        logger.info('Database Connected.');
        const server = app.listen(config.get('port'), () => {
            const host = server.address().address;
            const port = server.address().port;
            logger.info(`Server listening at http://${host}:${port}`);
        });
    } catch(err) {
        logger.error({err: err}, 'Error');
        db.close();
    }
})();

