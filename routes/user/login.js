const { User } = require('../../db');
const bcrypt = require('bcrypt');
const { definitions } = require('../../definitions/index')
const { users } = definitions  
const { LoginUserRequest, LoginUserResponse } = users;

exports.login = app => {
    app.post('/login', {
        schema: {
            description: 'Logs in a user',
            tags: ['User'],
            summary: 'Logs in a user',
            body: LoginUserRequest,
            response: {
                200: LoginUserResponse
            }
        },
        /**
         * 
         * @param {import('fastify'.FastifyRequest)} request
         * @param {import('fastify'.FastifyReply<Response>)} response
         */
        handler: async (request, response) => {
            const { body } = request;
            const { username, password } = body;

            if(!username){
                return response.badRequest('request/username-malformed')
            }else if (!password){
                return response.badRequest('request/password-malformed')
            }

            const user = await User.findOne({ username: username }).exec(); 

            if(!user){
                return response.notFound('user/not-found')
            }

            if(!(await bcrypt.compare(password, user.password))){
                return response.unauthorized('auth/wrong-password')
            }

            const userId = user.userId;

            const data = app.jwt.sign({
                userId
            })

            request.session.token = data;
            
            return {
                success: true,
                userId,
                data
            }
        }
    })
}