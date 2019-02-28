import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import { createEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/client';
import eventRoute from './routes/routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/slack', eventRoute);

const port = process.env.PORT || 8000;
http.createServer(app).listen(port, () => {
  console.log(`server running on port ${port}`);
});
