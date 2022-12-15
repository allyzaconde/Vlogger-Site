const { blog } = require('./blog')
const { user } = require('./user')
const { definitions } = require('../definitions')
const { SuccessResponse } = definitions;
const { comment } = require('./comment')

exports.routes = app => {
    //access root address localhost:8080
    app.get('/', {
        schema: {
            description: 'Server root route',
            tags: ['Root'],
            summary: 'Server root route',
            response: {
                200: SuccessResponse
            }
        },
        handler: async (req) => {
            return { success: true }
        }
    });

    //access /user & /blog & /blog/:blogId/comment addresses
    user(app);
    blog(app);
    comment(app);
}