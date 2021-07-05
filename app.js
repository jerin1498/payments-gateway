const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')
const nunjucks = require('nunjucks')
const cookieParser = require('cookie-parser');

const stripeRouter = require('./routers/stripeRouter')

const app = express()



app.use(morgan('combined'))

app.set('view engine', 'nunjucks');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});



app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '30kb' }));
app.use(express.urlencoded({ extended: true, limit: '30kb' }));
app.use(cookieParser());

app.use('/stripe', stripeRouter )


module.exports = app;