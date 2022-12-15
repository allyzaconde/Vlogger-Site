const { Blog } = require('../../db');
const { definitions } = require('../../definitions')
const { blogs } = definitions
const { UpdateBlogParams, UpdateBlogRequest, UpdateBlogResponse } = blogs;

exports.update = app => {

    app.put('/blog/:blogId', {
        schema: {
            description: 'Updates one blog',
            tags: ['Blog'],
            summary: 'Updates one blog',
            body: UpdateBlogRequest,
            params: UpdateBlogParams,
            response: {
                200: UpdateBlogResponse
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
            const { params, body, user } = request;
            const { blogId } = params;
            const { summary, title, textBody } = body;
            const { userId } = user;

            //check if an edit exists
            if(summary || title || textBody){
                const searchUser = await User.findOne({ userId: userId }).exec(); 
                const old = await Blog.findOne({ blogId: blogId , username: searchUser.username }).exec();
                const adminSearch = await Blog.findOne({ blogId: blogId }).exec();


                if(!old && !adminSearch){
                    return response.notFound('blog/not-found')
                }else if(!old && adminSearch){
                    return response.forbidden('auth/forbidden')
                }

                const updated = {}

                if(summary){
                    updated.summary = summary;
                }
                if(title){  
                    updated.title = title;
                }
                if(textBody){
                    updated.textBody = textBody;
                }
                updated.dateUpdated = new Date().getTime();
                
                const data = await Blog.findOneAndUpdate(
                    { blogId: blogId },
                    updated,
                    { new: true, projection: { _id: 0, title: 1, summary: 1, textBody: 1, dateUpdated: 1, dateCreated: 1 } }
                ).exec(); 

                return {
                    success: true,
                    data
                }
            }else{
                return response.badRequest('request/body-malformed')
            }
        }
    })
};