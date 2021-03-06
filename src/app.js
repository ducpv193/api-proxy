// Load environment configuration
const {
    APP_KEY,
    TRUST_PROXIES,
    ETAG_ENABLE,
    REDIS_HOST,
    REDIS_PORT,
} = require('./config')

const csrf = require('./csrf')
const redis = require('redis')
const cookieParser = require('cookie-parser')()

// Setup Express application
const app = require('express')()

app.set('trust proxy', TRUST_PROXIES)
app.set('etag', ETAG_ENABLE)

// // Setup Middleware
app.use(cookieParser)

const session = require('express-session')
const RedisStore = require('connect-redis')(session)

app.use(session({
    secret: APP_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000,
    },
    store: new RedisStore({
        client: redis.createClient({
            host: REDIS_HOST,
            port: REDIS_PORT,
        }),
    }),
}))

app.use(csrf)

// Handle XSRF token error
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err)
    }

    res.status(403).json({
        error: 'session has expired or been tampered with',
    })
})

module.exports = app
