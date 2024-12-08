const app = require('./app')
const http = require('http')
const { initSocket } = require('./socket')

const server = http.createServer(app)

initSocket(server)

const config = require('./utils/config')
const logger = require('./utils/logger')

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})