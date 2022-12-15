const { Blog, User, Comment } = require('../../db');
const { definitions } = require('../../definitions')
const { blogs, SuccessResponse } = definitions
const { DeleteBlogParams } = blogs;

exports.deleteOne = app => {

    app.delete('/blog/:blogId', {
        schema: {
            description: 'Deletes one blog',
            tags: ['Blog'],
            summary: 'Deletes one blog',
            params: DeleteBlogParams,
            response: {
                200: SuccessResponse
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
            const { params, user } = request;
            const { blogId } = params;
            const { userId } = user;
            
            if(!blogId){
                return response.badRequest('request/blogId-malformed')
            }

            //find admin and user
            const searchUser = await User.findOne({ userId: userId }).exec(); 
            const searchBlog = await Blog.findOne({ blogId: blogId, username: searchUser.username }).exec(); 

            if(searchBlog){
                //deletes both the blog and all associated comments
                await Blog.findOneAndDelete({ blogId: blogId }).exec();
                await Comment.deleteMany({ blogId: blogId }).exec();
            }else{
                return response.unauthorized("auth/unauthorized")
            }

            return {
                success: true
            }
        }
    })
};