DROP TABLE "Users";
DROP TABLE "Articles";
DROP TABLE "Feeds";
DROP TABLE "UserFeeds";
DROP TABLE "FeedArticles";

CREATE TABLE IF NOT EXISTS "Users" (
    "id" BIGSERIAL,
    PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "Articles" (
    "id" BIGSERIAL,
    "title" TEXT NOT NULL,
    "contents" TEXT NOT NULL,
    "createdAt"             TIMESTAMP     WITH TIME ZONE         NOT NULL          ,
    "updatedAt"             TIMESTAMP     WITH TIME ZONE         NOT NULL          ,
    PRIMARY KEY("id")
);
ALTER TABLE "Articles" ALTER COLUMN "createdAt" SET DEFAULT now();

CREATE TABLE IF NOT EXISTS "Feeds" (
    "id" BIGSERIAL,
    "name" TEXT NOT NULL,
    PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "UserFeeds" (
    "id" BIGSERIAL,
    "userId" BIGINT NOT NULL,
    "feedId" BIGINT NOT NULL,
    "feedName" TEXT NOT NULL,
    unique ("userId", "feedId"),
    PRIMARY KEY("id")


);
CREATE INDEX users_index ON "UserFeeds"("userId");

CREATE TABLE IF NOT EXISTS "FeedArticles" (
    "id" BIGSERIAL,
    "feedId" BIGINT NOT NULL,
    "feedName" TEXT NOT NULL,
    "articleId" BIGINT NOT NULL,
    "articleCreatedAt" TIMESTAMP     WITH TIME ZONE         NOT NULL,
    unique ("feedId", "articleId"),
        PRIMARY KEY("id")
  
);
CREATE INDEX feeds_index ON "FeedArticles"("feedId");
CREATE INDEX articles_index ON "FeedArticles"("articleCreatedAt" DESC);



INSERT INTO "Users" ("id") VALUES (DEFAULT) ON CONFLICT DO NOTHING;
INSERT INTO "Users" ("id") VALUES (DEFAULT) ON CONFLICT DO NOTHING;

INSERT INTO "Feeds" ("id", "name") VALUES (DEFAULT, 'sports') ON CONFLICT DO NOTHING;
INSERT INTO "Feeds" ("id", "name") VALUES (DEFAULT, 'technology') ON CONFLICT DO NOTHING;

INSERT INTO "Articles" ("id", "title","contents","createdAt", "updatedAt") VALUES (DEFAULT, 'the superbowl', 'lakj kaljd lakj lakj aljk', '2018-02-11 18:09:09.303271+00','2018-02-11 18:09:09.303271+00') ON CONFLICT DO NOTHING;
INSERT INTO "Articles" ("id", "title","contents","createdAt", "updatedAt") VALUES (DEFAULT, 'winter olympics', 'lakj kaljd lakj lakj aljk fda ad', '2018-02-10 18:09:09.303271+00','2018-02-10 18:09:09.303271+00') ON CONFLICT DO NOTHING;
INSERT INTO "Articles" ("id", "title","contents","createdAt", "updatedAt") VALUES (DEFAULT, 'company goes bankrupt', 'lakj kaljd lakj lakj aljk', '2018-02-11 18:09:09.303271+00','2018-02-11 18:09:09.303271+00') ON CONFLICT DO NOTHING;
INSERT INTO "Articles" ("id", "title","contents","createdAt", "updatedAt") VALUES (DEFAULT, 'company goes public', 'lakj kaljd lakj lakj aljk fda ad', '2018-02-10 18:09:09.303271+00','2018-02-10 18:09:09.303271+00') ON CONFLICT DO NOTHING;

INSERT INTO "UserFeeds" ("userId", "feedId", "feedName") VALUES (1, 1, 'sports') ON CONFLICT DO NOTHING;
INSERT INTO "UserFeeds" ("userId", "feedId", "feedName") VALUES (2, 2, 'technology') ON CONFLICT DO NOTHING;

INSERT INTO "FeedArticles" ("feedId", "feedName", "articleId", "articleCreatedAt") VALUES (1, 'sports', 1, '2018-02-11 18:09:09.303271+00') ON CONFLICT DO NOTHING;
INSERT INTO "FeedArticles" ("feedId", "feedName", "articleId", "articleCreatedAt") VALUES (1, 'sports', 2, '2018-02-10 18:09:09.303271+00') ON CONFLICT DO NOTHING;
INSERT INTO "FeedArticles" ("feedId", "feedName", "articleId", "articleCreatedAt") VALUES (2, 'technology', 3, '2018-02-11 18:09:09.303271+00') ON CONFLICT DO NOTHING;
INSERT INTO "FeedArticles" ("feedId", "feedName", "articleId", "articleCreatedAt") VALUES (2, 'technology', 4, '2018-02-10 18:09:09.303271+00') ON CONFLICT DO NOTHING;
