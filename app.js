const express = require("express");
const config = require("./utils/config");
require("express-async-errors");
const app = express();
const cors = require("cors");

const profilesRouter = require('./controllers/profiles')
const serversRouter = require('./controllers/servers')
const uploadRouter = require('./controllers/upload')
const channelsRouter = require('./controllers/channels')
const membersRouter = require('./controllers/members')

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/profile', profilesRouter)
app.use('/api/server', serversRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/channel', channelsRouter)
app.use('/api/member', membersRouter)

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;