require('dotenv').config({
    silent: true,
})

let makeHostConfig = (env, prefix) => {
    let host = env[prefix + '_HOST'] || '127.0.0.1'
    let port = env[prefix + '_PORT'] || 3030
    let https = env[prefix + '_HTTPS'] === 'true' || env[prefix + '_HTTPS'] === true

    let default_port, protocol

    if (https) {
        default_port = 443
        protocol = 'https'
    } else {
        default_port = 80
        protocol = 'http'
    }

    let url = protocol + '://' + host + (port === default_port ? '' : ':' + port)

    return {
        host,
        port,
        url,
        protocol,
        https,
    }
}

const env = process.env.APP_ENV || 'local'

module.exports = {
    node: makeHostConfig(process.env, 'NODE'),
    api: makeHostConfig(process.env, 'API'),
    websocket: makeHostConfig(process.env, 'ECHO'),
    debug: process.env.APP_DEBUG === 'true' || process.env.APP_DEBUG === true,
    env,
    production: env === 'production',
    dev: env !== 'production',
}
