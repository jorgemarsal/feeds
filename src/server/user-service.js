class UserMgr {
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

    async getUser(id) {
        try {
            return await this.db.Users.findOne({
                where: {
                    id,
                }
            })
        } catch (err) {
            this.logger.error({ err }, `Error fetching article with id: ${id}`)
        }
    }

}

module.exports = UserMgr;