import http from 'http';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import eventRoute from './routes/routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/slack', eventRoute);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 8000;
http.createServer(app).listen(port, () => {
  console.log(`server running on port ${port}`);
});
