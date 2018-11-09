const chai = require("chai")
const chaiHttp = require("chai-http")
const {app, runServer, closeServer} = require("../server")

//use chai expect syntax
const expect = chai.expect;

chai.use(chaiHttp);

describe("blogAPI", function(){
    before(function(){
        return runServer();
    })
    after(function(){
        return closeServer()
    })
    it("Should return post on GET", function() {
        return chai
        .request(app)
        .get("/blog-posts")
        .then(function(res) {
            const testFields = ["id","title","content","author","publishDate"]
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a("array");
            expect(res.body.length).to.be.at.least(1);
            res.body.forEach(function(post){
                expect(post).to.includes.keys(testFields)
            })
        })
    })
    it("Should return post on GET with id", function(){
        return chai
        .request(app)
        .get("/blog-posts")
        .then(function(res){
            const id = res.body[0].id
            return chai
            .request(app)
            .get(`/blog-posts/${id}`)
            .then(function(res){
                const testFiels = ["id","title","content","author","publishDate"]
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a("object")
                expect(res.body.id).to.be.equal(id);
                expect(res.body).to.includes.keys(testFiels)
            })
        })
    })
    it("Should return successful message on POST", function() {
        const newPost = {"title": "test title 1", "content": "test content blallalalalal", "author": "Evan Xu"}
        return chai
        .request(app)
        .post("/blog-posts")
        .send(newPost)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res.body).to.be.empty;
            expect(res.body).to.be.a("object")
        })
        
    })
    it("Should return error on POST if missing required field", function() {
        const newPost = {"title": "test title 1", "content": "test content blallalalalal"}
        return chai
        .request(app)
        .post("/blog-posts")
        .send(newPost)
        .then(function(res){
            expect(res).to.have.status(400);
            expect(res.body).to.be.empty;
            expect(res.body).to.be.a("object")
        })
    })
    it("Should return nothing on PUT when succesfully updated post", function(){
        const newPost = {"title": "test title 1", "content": "test content blallalalalal", "author": "Evan Xu"}
        return chai
        .request(app)
        .get("/blog-posts")
        .then(function(res){
            newPost.id = res.body[0].id;
            return chai
            .request(app)
            .put(`/blog-posts/${res.body[0].id}`)
            .send(newPost)
            .then(function(res){
                expect(res).to.have.status(201);
                expect(res).to.be.a("object")
                expect(res.body).to.be.empty
            })
        })
    })
    it("Should return nothing on DELETE",function(){
        return chai
        .request(app)
        .get("/blog-posts")
        .then(function(res){
            return chai
            .request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
            .then(function(res){
                expect(res).to.have.status(204)
                expect(res).to.be.a("object")
                expect(res.body).to.be.empty
            })
        })
    })
})




