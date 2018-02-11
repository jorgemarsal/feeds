'use strict';
const sinon                  = require('sinon');
const Promise                = require('bluebird');
const expect                 = require('chai').expect;
const chai                   = require('chai');
const chaiAsPromised         = require("chai-as-promised");
const _                      = require('lodash');
chai.use(chaiAsPromised);

const ArticleService = require('../article-service');

describe('ArticleService', () => {
    let sandbox;
    const logger = {
        debug: () => {},
        error: () => {},
    };

    
    const db = {
        Articles: {

        },
    };
    const articleService = new ArticleService({
        db,
        logger,
    });

    
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        db.Articles.findOne = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("#getArticle", () => {
        it('should work when DB returns an article', () => {
            db.Articles.findOne.returns(Promise.resolve({
                title: 'a title',
                contents: 'contents...'
            }));
            return articleService.getArticle("1")
                .then((res) => {
                    expect(res).to.deep.equal({
                        title: 'a title',
                        contents: 'contents...'
                    });
                    const expectedArgs = [
                        {
                            where: {
                                id: "1"
                            }
                        }];
                    expect(db.Articles.findOne.getCall(0).args).to.deep.equal(expectedArgs);
                })
        });
        it('should work when DB fails', () => {
            db.Articles.findOne.returns(Promise.reject('fail!'));
            return articleService.getArticle("1")
                .then((res) => {
                    expect(res).to.be.undefined;                    
                    const expectedArgs = [
                        {
                            where: {
                                id: "1"
                            }
                        }];
                    expect(db.Articles.findOne.getCall(0).args).to.deep.equal(expectedArgs);
                });
        });
    });
   
})