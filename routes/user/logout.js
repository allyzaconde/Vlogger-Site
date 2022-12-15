const { DiscardedToken } = require('../../db');
const { definitions } = require('../../definitions/index')
const { SuccessResponse } = definitions;

exports.logout = app => {
    app.get('/logout', {
        schema: {
            description: 'Logs out a user',
            tags: ['User'],
            summary: 'Logs out a user',
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
            const { token, user } = request;
            const { userId } = user;

            if(!token){
                return response.unauthorized('auth/no-authorization-header')
            }
            
            const data = new DiscardedToken({
                userId,
                token
            });
            await data.save();

            request.destroySession(() =>{
                response.send({
                    success: true
                })
            })
        }
    })
}