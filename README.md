### Setup

To run the feeds API locally follow these steps (make sure Docker is installed):

1. Unzip the code.

2. Start postgres locally:

    docker run --name feedsdb -e POSTGRES_PASSWORD=123 -d postgres

3. To create the tables and load some data:

    docker run -v `pwd`/db/db.sql:/db.sql -e PGPASSWORD=123 --link feedsdb  -it --rm  postgres psql -h feedsdb -U postgres -f /db.sql

4. Start feeds app

    docker run -e DB_HOST=feedsdb -it -p 8080:8080 --link feedsdb jorgemarsal/confluent:v4

5. Open browser and visit:

    http://localhost:8080

### Backend
The backend code is in `src/server`.

#### Architecture

There are 2 types of components. `Services` implement the feed system and `handlers` expose HTTP interfaces to interact with the services.

To explore the database schemas:

    docker run  -e PGPASSWORD=123 --link feedsdb  -it --rm  postgres psql -h feedsdb -U postgres
    \dt

There are 3 tables that store information about `Users`, `Feeds` and `Articles`:

```
postgres=# \d "Articles"
                                    Table "public.Articles"
  Column   |           Type           |                        Modifiers
-----------+--------------------------+---------------------------------------------------------
 id        | bigint                   | not null default nextval('"Articles_id_seq"'::regclass)
 title     | text                     | not null
 contents  | text                     | not null
 createdAt | timestamp with time zone | not null default now()
 updatedAt | timestamp with time zone | not null
Indexes:
    "Articles_pkey" PRIMARY KEY, btree (id)
```

```
postgres=# \d "Feeds"
                          Table "public.Feeds"
 Column |  Type  |                      Modifiers
--------+--------+------------------------------------------------------
 id     | bigint | not null default nextval('"Feeds_id_seq"'::regclass)
 name   | text   | not null
Indexes:
    "Feeds_pkey" PRIMARY KEY, btree (id)
```

```
postgres=# \d "Users"
                          Table "public.Users"
 Column |  Type  |                      Modifiers
--------+--------+------------------------------------------------------
 id     | bigint | not null default nextval('"Users_id_seq"'::regclass)
Indexes:
    "Users_pkey" PRIMARY KEY, btree (id)
```

And 2 tables that store relationships between feeds and articles and between users and feeds.

The `FeedArticles` table is sorted by `articleCreatedAt`. This is so we can fetch articles in a time range efficiently.
The API supports pagination with `begin` and `end` parameters.

```
postgres=# \d "FeedArticles"
                                        Table "public.FeedArticles"
      Column      |           Type           |                          Modifiers
------------------+--------------------------+-------------------------------------------------------------
 id               | bigint                   | not null default nextval('"FeedArticles_id_seq"'::regclass)
 feedId           | bigint                   | not null
 feedName         | text                     | not null
 articleId        | bigint                   | not null
 articleCreatedAt | timestamp with time zone | not null
Indexes:
    "FeedArticles_pkey" PRIMARY KEY, btree (id)
    "FeedArticles_feedId_articleId_key" UNIQUE CONSTRAINT, btree ("feedId", "articleId")
    "articles_index" btree ("articleCreatedAt" DESC)
    "feeds_index" btree ("feedId")
```

```
postgres=# \d "UserFeeds"
                           Table "public.UserFeeds"
  Column  |  Type  |                        Modifiers
----------+--------+----------------------------------------------------------
 id       | bigint | not null default nextval('"UserFeeds_id_seq"'::regclass)
 userId   | bigint | not null
 feedId   | bigint | not null
 feedName | text   | not null
Indexes:
    "UserFeeds_pkey" PRIMARY KEY, btree (id)
    "UserFeeds_userId_feedId_key" UNIQUE CONSTRAINT, btree ("userId", "feedId")
    "users_index" btree ("userId")
```

#### API

NOTE: the api is versioned with an `api/v1` prefix.
NOTE: We pass the user id in the URL. In a real system we'd have to authenticate the user and encode its identity in a JWT token for example.

1. Get articles for user 1, between `begin` and `end` dates.

```
GET /?user=1&begin=2010-02-02T23:20:50.52Z&end=2020-09-03T23:20:50.52Z'

[
    {
        "id": "3",
        "title": "company goes bankrupt",
        "contents": "lakj kaljd lakj lakj aljk",
        "createdAt": "2018-02-11T18:09:09.303Z",
        "updatedAt": "2018-02-11T18:09:09.303Z",
        "feed": "technology"
    },
    {
        "id": "4",
        "title": "company goes public",
        "contents": "lakj kaljd lakj lakj aljk fda ad",
        "createdAt": "2018-02-10T18:09:09.303Z",
        "updatedAt": "2018-02-10T18:09:09.303Z",
        "feed": "technology"
    }
]
```

Get feeds a user is subscribed to.

```
GET /?feeds?user=1

[
    {
        "id": "3",
        "userId": "1",
        "feedId": "2",
        "feedName": "technology"
    }
]
```

Subscribe user 1 to feed 1:

```
POST  /feed/1/subscribe?user=1'

`ok`
```

Unubscribe user 1 from feed 1:

```
POST  /feed/1/unsubscribe?user=1'

`ok`
```

#### Scaling

##### ArticleService

Probably due to article size and read / write load the first candidate to scale is the `ArticleService`. To scale it we can shard by `articleId`.

##### FeedService

Feeds could be sharded by `feedId`. In this design there's a single `FeedService` that manages 3 tables (`Feeds`, `UserFeeds` and `FeedArticles`). We could split this service into 3 separate services.

###### UserFeeds

`UserFeeds` could be sharded by `userId`. One thing to note is we don't check if `userId` and `feedId` exist. We could create a foreign key constraint that references the `Users` and `Feeds` table but that would limit the scalability of the system.
We could clean up rows with bad `userIds` or `feedIds` periodically.

##### FeedArticles

FeedArticles could be sharded by `feedId`. If a feed didn't fit in a single shard (unlikely) when we'd have to merge the results from different shards in the application logic.


#### Testing

Testing is pretty scarce. I've created unit tests for the `ArticleService` (`article-service-test.js`). In a real system all the code should have similar tests. To run the tests:

    cd src/server; npm test


In a real system we should also have fuzzing, integration testing and load testing.

### Frontend

There's a simple UI to read & create articles and to manage feed subscriptions in `src/client`.



