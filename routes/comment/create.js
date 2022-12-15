const { Blog, User, Comment } = require('../../db');
const { definitions } = require('../../definitions')
const { comments, SuccessResponse } = definitions
const { PostCommentRequest, CreateCommentParams } = comments;

exports.create = app => {
    
    app.post('/blog/:blogId/comment', {
        schema: {
            description: 'Creates one comment',
            tags: ['Comment'],
            summary: 'Creates one comment',
            params: CreateCommentParams,
            body: PostCommentRequest,
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
            const { params } = request;
            const { blogId } = params;
            const { body, user } = request;          
            const { comment } = body;
            const { userId } = user;

            if(!comment){
                return response.badRequest('request/comment-malformed');
            }
            
            const searchUser = await User.findOne({ userId: userId }).exec(); 
            const username = searchUser.username;
            

            const searchBlog = await Blog.findOne({ blogId: blogId }).exec(); 

            if(!searchBlog){
                return response.notFound('blog/not-found');
            }

            const data = new Comment({
                comment, 
                blogId, 
                username
            });

            await data.save();
            
            return {
                success: true
            }
        }
    })
}