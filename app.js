var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
var cors = require('cors')

const sliderRouter = require('./routes/sliderRouter');
const blogRouter = require('./routes/blogRouter');
const documentRouter = require('./routes/documentRouter');
const eventRouter = require('./routes/eventRouter');
const faqRouter = require('./routes/faqRouter');
const mediaRouter = require('./routes/mediaRouter');
const photoRouter = require('./routes/photoRouter');
const messageRouter = require('./routes/messageRouter');
const testimonialRouter = require('./routes/testimonialRouter');
const userRouter = require('./routes/userRouter');
const participantRouter = require('./routes/participantRouter');
const statisticsRoute = require('./routes/statisticsRoute');
const visitorRouter = require('./routes/visitorRouter');
const memberRouter = require('./routes/memberRouter');
const pupupRouter = require('./routes/pupupRouter');
const imageRouter = require('./routes/imageRouter');
const surveyRouter = require('./routes/surveyRouter');
const feedbackRouter = require('./routes/feedbackRouter');

var app = express();

const url = process.env.mongoURI;
mongoose
  .connect(url)
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });

var corsOptions = {
  origin: 'https://edenmed-dashboard.netlify.app',
  optionsSuccessStatus: 200,
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/slider', cors(corsOptions), sliderRouter);
app.use('/blogs', cors(corsOptions), blogRouter);
app.use('/library/documents', cors(corsOptions), documentRouter);
app.use('/events', cors(corsOptions), eventRouter);
app.use('/participants', cors(corsOptions), participantRouter);
app.use('/faqs', cors(corsOptions), faqRouter);
app.use('/library/medias', cors(corsOptions), mediaRouter);
app.use('/library/photos', cors(corsOptions), photoRouter);
app.use('/messages', cors(corsOptions), messageRouter);
app.use('/testimonials', cors(corsOptions), testimonialRouter);
app.use('/users', cors(corsOptions), userRouter);
app.use('/statistics', cors(corsOptions), statisticsRoute);
app.use('/visitors', cors(corsOptions), visitorRouter);
app.use('/members', cors(corsOptions), memberRouter);
app.use('/pupup', cors(corsOptions), pupupRouter);
app.use('/images', cors(corsOptions), imageRouter);
app.use('/surveys', cors(corsOptions), surveyRouter);
app.use('/feedbacks', cors(corsOptions), feedbackRouter);

 app.use(express.static('./client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });

module.exports = app;
