const express = require('express')
const app = express();
const morgan = require('morgan');

const blogRouter = require('./blogRouter');

let server;

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve,reject)=>{
        server = app
        .listen(port, ()=> {
            console.log(`app is running at ${port}`)
            resolve()
        })
        .on("error", err=>reject(err))
    })
}

function closeServer() {
    return new Promise((resolve,reject)=>{
        server.close(err=>{
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}

if (require.main === module) {
    runServer().catch(err=>console.error(err))
}

app.use(morgan('common'));

app.use('/blog-posts', blogRouter);

module.exports = {app, runServer, closeServer}