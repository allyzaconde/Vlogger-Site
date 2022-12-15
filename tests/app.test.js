const { build } = require('../app');
require('tap').mochaGlobals();
require('should');
const { mongoose } = require('../db');

describe('For the route of root {/}', () => {
    let app; 

    before(async () =>{
        //initialize application
        app = await build({logger: false});
    })

    after(async () => {
        //close database
        await mongoose.connection.close();
    });

    //test
    it('It should return { success: true } when called using GET', async () => {
        const response = await app.inject({
            method: 'GET',
            url: '/'
        });

        //testing materials
        const payload = response.json();
        const { success } = payload;
        const { statusCode } = response;
        success.should.equal(true);
        statusCode.should.equal(200);
        console.log('payload', payload);
    })
});