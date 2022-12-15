const { User, Comment } = require('../../db');
const { definitions } = require('../../definitions')
const { comments, SuccessResponse } = definitions
const { CommentParams } = comments;

exports.deleteOne = app => {

    app.delete('/blog/:blogId/:commentId', {
        schema: { 
            description: 'Deletes one comment',
            tags: ['Comment'],
            summary: 'Deletes one comment',
            params: CommentParams,
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
            const { commentId } = params;
            const { userId } = user;

            if(!commentId){
                return response.badRequest()
            }
            
            const checkAdmin = await User.findOne({ userId: userId }).exec();
            const adminSearch = await Comment.findOne({ commentId: commentId }).exec(); 

            if(checkAdmin.isAdmin){
                if(!adminSearch){
                    return response.notFound("comment/not-found")
                }else{
                    await Comment.findOneAndDelete({ commentId: commentId }).exec(); 
                }
            }else{
                const data = await Comment.findOneAndDelete({ commentId: commentId, username: checkAdmin.username }).exec(); 

                if(adminSearch && !data){
                    return response.unauthorized("auth/unauthorized")
                }else if(!adminSearch){
                    return response.notFound("comment/not-found")
                }
            }

            return {
                success: true
            }
        }
    })
}