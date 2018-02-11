const Sequelize = require('sequelize');

class DB {

    // Constructor
    constructor(opt) {
        this._type = opt.type;
        this._host = opt.host;
        this._port = opt.port;
        this._name = opt.name;
        this._user = opt.user;
        this._password = opt.password;
        this._sync = opt.sync;
        this._forcesync = opt.forcesync;

        // Construct the connection string.
        const connString = `${this._type}://${this._user}:${this._password}@${this._host}:${this._port}/${this._name}`;
        this._db = new Sequelize(connString, {
            define: {
                timestamps: false // true by default
            }
        });

        // define Models
        this.Users = this._db.define('Users', {
            // id: {
            //     type: Sequelize.BIGINT,
            //     primaryKey: true,
            // }
        });
        this.Articles = this._db.define('Articles', {
            // id: {
            //     type: Sequelize.BIGINT,
            //     primaryKey: true,
            // },
            title: {
                type: Sequelize.TEXT,
            },
            contents: {
                type: Sequelize.TEXT,
            }
        },
        {
            timestamps: true
        });
        this.Feeds = this._db.define('Feeds', {
            // id: {
            //     type: Sequelize.BIGINT,
            //     primaryKey: true,
            // },
            name: {
                type: Sequelize.TEXT,
            },
        });
        this.UserFeeds = this._db.define('UserFeeds', {
            // id: {
            //     type: Sequelize.BIGINT,
            //     primaryKey: true,
            // },
            userId: {
                type: Sequelize.BIGINT,
            },
            feedId: {
                type: Sequelize.BIGINT,
            },
            feedName: {
                type: Sequelize.TEXT,
            },
        });
        this.FeedArticles = this._db.define('FeedArticles', {
            // id: {
            //     type: Sequelize.BIGINT,
            //     primaryKey: true,
            // },
            feedId: {
                type: Sequelize.BIGINT,
            },
            feedName: {
                type: Sequelize.TEXT,
            },
            articleId: {
                type: Sequelize.BIGINT,
            },
            articleCreatedAt: {
                type: Sequelize.DATE,
            },
        });
        
    }

    // PUBLIC FUNCTIONS
    /*
     * Initialize the database connection, optionally force sync.
     *
     * @return Promise<Project> A promise which would resolve to the Project object.
     */
    init() {
        if (this._sync) {
            // Return a promise which would resolved to the DB Models once db sync complete.
            return this._db.sync({ force: this._forcesync });
        }

        return Promise.resolve(null);
    }

    /*
     * Close the database connection.
     *
     * @return undefined
     */
    close() {
        if (this._db) {
            this._db.close();
        }
    }
}

module.exports = DB;
