const { Blog } = require('../../db');
const { definitions } = require('../../definitions')
const { blogs } = definitions
const { GetOneBlogResponse, GetOneBlogParams } = blogs;


exports.getOne = app => {
    app.get('/blog/:blogId', {
        schema: {
            description: 'Gets one blog',
            tags: ['Blog'],
            summary: 'Gets one blog',
            params: GetOneBlogParams,
            response: {
                200: GetOneBlogResponse
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
            const { params } = request;
            const { blogId } = params;

            //check if request is valid
            if(!blogId){
                return response.badRequest('request/blogId-malformed')
            }

            //find blog
            const data = await Blog.findOne(
                { blogId: blogId }, 
                { _id: 0, title: 1, summary: 1, textBody: 1, blogId: 1, dateUpdated: 1, dateCreated: 1}//, username: 1 }
            ).exec(); 

            //if does not exist throw error 404
            if(!data){
                return response.notFound("blog/not-found")
            }

            return {
                success: true,
                data
            }
        }
    })
};