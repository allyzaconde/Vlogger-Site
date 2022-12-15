const { User } = require('../../db');
const { definitions } = require('../../definitions/index')
const { users } = definitions  
const { GetOneUserResponse, GetOneUserParams } = users;


exports.getOne = app => {
    app.get('/user/:id', {
        schema: {
            description: 'Gets one user',
            tags: ['User'],
            summary: 'Gets one user',
            params: GetOneUserParams,
            response: {
                200: GetOneUserResponse
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
            const { id } = params;
            const { userId } = user;


            if(!userId){ //change error handling name
                return response.badRequest('request/blogId-malformed')
            }

            const checkAdmin = await User.findOne({ userId: userId }).exec();

            if(userId != userId && !checkAdmin.isAdmin){
                return response.forbidden('auth/forbidden');
            }

            const data = await User.findOne(
                { userId: id }, 
                { _id: 0, username: 1, firstName: 1, lastName: 1, isAdmin: 1, isContributor: 1, dateUpdated: 1, dateCreated: 1 }
            ).exec(); 

            if(!data){
                return response.notFound("user/not-found")
            }

            return {
                success: true,
                data
            }
        }
    })
};