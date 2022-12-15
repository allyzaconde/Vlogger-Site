const { Comment } = require('../../db');
const { definitions } = require('../../definitions')
const { comments } = definitions
const { GetManyCommentQuery, GetManyCommentResponse } = comments;

exports.getMany = app => {
    app.get('/blog/:blogId/comment', {
        schema: {
            description: 'Gets many comments',
            tags: ['Comment'],
            summary: 'Gets many comments',
            query: GetManyCommentQuery,
            response: {
                200: GetManyCommentResponse
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
            const { query } = request;
            const { 
                limit = 10, 
                startDateCreated, 
                endDateCreated, 
                startDateUpdated, 
                endDateUpdated } = query;

            const startDateCreatedOpts = startDateCreated ? { 
                dateCreated: { $gte: startDateCreated } } 
                : { dateCreated: { $gte: 0 } };
            const endDateCreatedOpts = endDateCreated ? { 
                dateCreated: { $lte: endDateCreated } } 
                : { dateCreated: { $lte: 10000000000000 } }; 
            const startDateUpdatedOpts = startDateUpdated ? { 
                dateUpdated: { $gte: startDateUpdated } } 
                : { dateUpdated: { $gte: 0 } }; 
            const endDateUpdatedOpts = endDateUpdated ? { 
                dateUpdated: { $lte: endDateUpdated } } 
                : { dateUpdated: { $lte: 10000000000000 } }; 
            
            const lim = limit > 50 ? 50 : limit; 

            const options = { $and: [ startDateCreatedOpts, endDateCreatedOpts, startDateUpdatedOpts, endDateUpdatedOpts, { blogId: blogId } ] }
            const data = await Comment.find(
                options, 
                { _id: 0, blogId: 1, comment: 1, dateUpdated: 1, dateCreated: 1, username: 1, commentId: 1 })
                .sort({dateUpdated: -1})
                .limit(parseInt(lim))
                .exec();

            return {
                success: true,
                data
            }
        }
    })
};