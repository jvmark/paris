const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const RedisStore = require('connect-redis')(session);

var sesionAge = 60 * 1000 * 60 * 24 * 14;

var mSession = session({
  store: new RedisStore({
    host: '10.1.2.201',
    port: 16379,
    db: 2
  }),
  secret: 'xVHii2hos4LUMRmTLMsHMfJKJHochkBz',
  cookie: {
    maxAge: sesionAge,
    expires: new Date(Date.now() + sesionAge),
  }
});

if (process.env.ENV == 'production') {
  mSession = session({
    store: new RedisStore({
      host: '10.1.2.201',
      port: 16379,
      db: 1
    }),
    secret: 'xVHii2hos4LUMRmTLMsHMfJKJHochkBz',
    cookie: {
      maxAge: sesionAge,
      expires: new Date(Date.now() + sesionAge),
    }
  });
}

module.exports = mSession;