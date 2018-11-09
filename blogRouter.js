const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create("Hello World", "This is the first post", "Evan Xu", Date.now());
BlogPosts.create("Second post", "This is the 2nd post", "Evan Xu", Date.now());

// show all post with out specify id
router.get('/', (req,res) => {
    res.status(200).send(BlogPosts.get());
    console.log(`showing all posts`)
})

//show post match id requested
router.get('/:id', (req,res) => {
    res.status(200).send(BlogPosts.get(req.params.id));
    console.log(`post with id \"${req.params.id}\" requested`)
})

router.post('/', jsonParser, (req,res)=> {
    // check if request body have all required fields
    const requiredFields = ['title', 'content', 'author'];
    for (let field of requiredFields) {
        if (!(field in req.body)) {
            const message = `${field} is missing in post body`
            return res.status(400).send(message)
        }
    }
    BlogPosts.create(req.body.title,req.body.content,req.body.author, req.body.publishDate);
    console.log(`new post \"${req.body.title}\" created`)
    res.status(201).end();
})

router.put('/:id', jsonParser, (req,res)=>{
    // check if request body have all required fields
    const requiredFields = ['id', 'title', 'content', 'author']
    for (let field of requiredFields) {
        if (!(field in req.body)) {
            const message = `${field} is missing in request body`;
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        message = `Request patch id ${req.params.id} must match request body id ${req.body.id}`
        return res.status(400).send(message);
    }

    const updatedPost = {
        id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate || Date.now()
      };
    BlogPosts.update(updatedPost);
    console.log(`updated post id: \"${req.params.id}\"`)
    res.status(201).end();
})

router.delete('/:id', (req,res)=> {
    BlogPosts.delete(req.params.id);
    console.log(`post with id \"${req.params.id}\" deleted`)
    res.status(204).end();
})

module.exports =router;