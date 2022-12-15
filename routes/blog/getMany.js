const { Blog } = require('../../db');
const { definitions } = require('../../definitions')
const { blogs } = definitions
const { GetManyBlogResponse, GetManyBlogQuery } = blogs;

exports.getMany = app => {
    app.get('/blog', {
        schema: {
            description: 'Gets many blogs',
            tags: ['Blog'],
            summary: 'Gets many blogs',
            query: GetManyBlogQuery,
            response: {
                200: GetManyBlogResponse
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
            const { query, user } = request;
            const { userId } = user;
            const { 
                limit = 10, 
                startDateCreated, 
                endDateCreated, 
                startDateUpdated, 
                endDateUpdated } = query;
            
            //pagination for the vlogs
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
            
            const lim = limit > 10 ? 10 : limit; 
                
            let options
            if(user){
                options = { $and: [ startDateCreatedOpts, endDateCreatedOpts, startDateUpdatedOpts, endDateUpdatedOpts, { userId: userId } ] }
            }else{
                options = { $and: [ startDateCreatedOpts, endDateCreatedOpts, startDateUpdatedOpts, endDateUpdatedOpts ] }
            }
            
            const data = await Blog.find(
                options, 
                { title: 1, summary: 1, dateUpdated: 1, dateCreated: 1, blogId: 1, username: 1 })
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