const express = require('express')
const app = express();
const morgan = require('morgan');

const blogRouter = require('./blogRouter');

app.use(morgan('common'));

app.use('/blog-posts', blogRouter);

app.listen(process.env.PORT || 8080, ()=>
console.log(`app is running at ${process.env.PORT || 8080}`))

