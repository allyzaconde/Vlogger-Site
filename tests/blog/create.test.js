const { build } = require('../../app');
require('tap').mochaGlobals();
const should = require('should');
const { v4: uuid } = require('uuid');
const { mongoose, Blog } = require('../../db');

describe('For the route of creating a blog POST {/blog}', () => {
    let app; 
    const ids = [];

    before(async () =>{
        //initialize application
        app = await build({logger: false});
    });

    after(async () => {
        //clean up database
        for (const id of ids){
            await Blog.findOneAndDelete({ id });
        }
        await mongoose.connection.close();
    });
    const id = uuid();

    //request payload tests
    
    //happy path
    it('It should return { success: true, blogId } with status 200 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/blog',
            payload: {
                "summary": "Test Blog 1",
                "title": "Test 1",
                "textBody": "This is a test for blog#1",
                "blogId": id,
                "username": "User1"
            }
        });

        //testing materials
        const payload = response.json();
        const { success, blogId } = payload;
        const { statusCode } = response;
        success.should.equal(true);
        statusCode.should.equal(200);

        //retrieving data from database
        const { blogId: blogIdDb } = await Blog.findOne({"blogId": id}).exec();

        //checking if the response was equal to the database
        blogId.should.equal(blogIdDb);
        ids.push(id);
    })

    //non-happy path: no summary
    it('It should return { success: false, message } with status 400 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/blog',
            payload: {
                "title": "Test 1",
                "textBody": "This is a test for blog#1",
                "blogId": id,
                "username": "User1"
            }
        });

        //testing materials
        const payload = response.json();
        const { success, message } = payload;
        const { statusCode } = response;
        success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);
    })

    //non-happy path: no title
    it('It should return { success: false, message } with status 400 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/blog',
            payload: {
                "summary": "Test Blog 1",
                "textBody": "This is a test for blog#1",
                "blogId": id,
                "username": "User1"
            }
        });

        //testing materials
        const payload = response.json();
        const { success, message } = payload;
        const { statusCode } = response;
        success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);
    })

    //non-happy path: no textBody
    it('It should return { success: false, message } with status 400 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/blog',
            payload: {
                "summary": "Test Blog 1",
                "title": "Test 1",
                "blogId": id,
                "username": "User1"
            }
        });

        //testing materials
        const payload = response.json();
        const { success, message } = payload;
        const { statusCode } = response;
        success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);
    })

    //non-happy path: no blogId
    it('It should return { success: false, message } with status 400 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/blog',
            payload: {
                "summary": "Test Blog 1",
                "title": "Test 1",
                "textBody": "This is a test for blog#1",
                "username": "User1"
            }
        });

        //testing materials
        const payload = response.json();
        const { success, message } = payload;
        const { statusCode } = response;
        success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);
    })

    //non-happy path: no username
    it('It should return { success: false, message } with status 400 when called using POST', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/blog',
            payload: {
                "summary": "Test Blog 1",
                "title": "Test 1",
                "textBody": "This is a test for blog#1",
                "blogId": id
            }
        });

        //testing materials
        const payload = response.json();
        const { success, message } = payload;
        const { statusCode } = response;
        success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);
    })
});