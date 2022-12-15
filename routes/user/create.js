const { User } = require('../../db');
const bcrypt = require('bcrypt');
const { definitions } = require('../../definitions/index')
const { users, SuccessResponse } = definitions  
const { PostUserRequest } = users;

exports.create = app => {
    app.post('/user', {
        schema: {
            description: 'Creates one user',
            tags: ['User'],
            summary: 'Creates one user',
            body: PostUserRequest,
            response: {
                200: SuccessResponse
            }
        },
        /**
         * 
         * @param {import('fastify'.FastifyRequest)} request
         * @param {import('fastify'.FastifyReply<Response>)} response
         */
        handler: async (request, response) => {
            const { body } = request;
            const { username, password, firstName, lastName } = body;
            const saltRounds = 10;

            const pattern = /[{}|,.;':"<>?~!@#$%^&*()_+`\\-\\=\[\]\d]/g

            if(!username){
                return response.badRequest('request/username-malformed');
            }else if (!password){
                return response.badRequest('request/password-malformed');
            }else if(!firstName){
                return response.badRequest('request/firstName-malformed');
            }else if(!lastName){
                return response.badRequest('request/lastName-malformed');
            }else if((password.length < 12) || pattern.test(password)){
                return response.badRequest('request/passwordchar-malformed');
            }

            const search = await User.findOne({ username: username }).exec();
             
            if(search){
                return response.forbidden('user/exists');
            }

            const hash = await bcrypt.hash(password, saltRounds);
            
            const data = new User({
                username,
                password: hash,
                firstName,
                lastName
            })
            await data.save();

            return {
                success: true
            }
        }
    })
}