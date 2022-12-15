const { Blog, User } = require('../../db');
const { definitions } = require('../../definitions')
const { blogs } = definitions
const { PostBlogRequest, PostBlogResponse } = blogs;

exports.create = app => {
    app.post('/blog', {
        schema: {
            description: 'Creates one blog',
            tags: ['Blog'],
            summary: 'Creates one blog',
            body: PostBlogRequest,
            response: {
                200: PostBlogResponse
            },
            security: [
                {
                  bearer: []
                }
            ]
        
        },
        /**
         * 
         * @param {import('fastify'.FastifyRequest)} request
         * @param {import('fastify'.FastifyReply<Response>)} response
         */
        preHandler: app.auth([
            app.verifyJWT
        ]),
        handler: async (request, response) => {
            const { body, user } = request;
            const { summary, title, textBody} = body;
            const { userId } = user;

            //checks the data received from the request if existing
            if(!summary){
                return response.badRequest('request/summary-malformed');
            }else if (!title){
                return response.badRequest('request/title-malformed');
            }else if(!textBody){
                return response.badRequest('request/textBody-malformed');
            }
            
            const searchUser = await User.findOne({ userId: userId }).exec(); 
            const username = searchUser.username;

            const data = new Blog({
                summary, 
                title, 
                textBody,
                username
            });
            
            await data.save();
            
            const blogId = data.blogId;

            return {
                success: true,
                blogId
            }
        }
    })
}