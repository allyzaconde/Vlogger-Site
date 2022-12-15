const Fastify = require('fastify');
const swagger = require('fastify-swagger');
const sensible = require('fastify-sensible');
const jwt = require('fastify-jwt');
const auth = require('fastify-auth');
const cookie = require('fastify-cookie');
const session = require('fastify-session');
const { readFileSync } = require('fs');
const { errorHandler } = require('./errorHandler');
const { definitions } = require('./definitions');
const { routes } = require('./routes');
const { connect, User, DiscardedToken } = require('./db');
const { name: title, description, version } = require('./package.json');
const audience = 'this-audience';
const issuer = 'localhost';
const cors = require('fastify-cors');

/**
 * 
 * @param {{ logger: boolean, trustProxy: boolean }} opts 
 * @returns {*}
 */
//function call to initialize server
exports.build = async (opts = {logger: true, trustProxy: true}) => {
    const app = Fastify(opts);
    
    //error handling ---> /project_fastify/errorHandler.js
    app.register(sensible).after(() =>{
        app.setErrorHandler(errorHandler);
    });

    //creating authentication ---> /project_fastify/cert
    app.register(jwt, {
        secret: {
            private: readFileSync('./cert/keyfile', 'utf8'),
            public: readFileSync('./cert/keyfile.key.pub', 'utf8')
        },
        sign: {
            algorithm: 'RS256',
            audience,
            issuer,
            expiresIn: '1h'
        },
        verify: {
            audience,
            issuer
        }

    });

    //cookies and session
    app.register(cookie);
    app.register(session, {
        cookieName: 'sessionToken',
        secret: readFileSync('./cert/keyfile', 'utf8'),
        cookie: {
            secure: false,
            httpOnly: true
        },
        maxAge: 60 * 60
    });

    //verification of JWT token
    await app
        .decorate('verifyJWT', async (request, response) => {
            const { headers } = request;
            const { authorization } = headers;
            const { token: cookieToken } = session;

            let authorizationToken;

            if(!authorization && !cookieToken){
                return response.unauthorized('auth/no-authorization-header')
            }

            if(authorization){
                [, authorizationToken] = authorization.split('Bearer ');
            }

            const token = authorizationToken || cookieToken;

            try{
                await app.jwt.verify(token)
                const { userId } = app.jwt.decode(token);

                const discarded = await DiscardedToken.findOne({ userId: userId, token: token }).exec();

                if(discarded){
                    return response.unauthorized('auth/discarded')
                }

                const user = await User.findOne({ userId: userId }).exec();
                if(!user){
                    return response.unauthorized('user/not-found')
                }

                request.user = user;
                request.token = token;
            }catch(error){
                if(error.message === 'jwt expired'){
                    return response.unauthorized('auth/expired');
                }
                return response.unauthorized('auth/unauthorized');
            }
        })
        .register(auth);

    //openAPI in website ---> http://localhost:8080/docs/static/index.html
    app.register(swagger, {
        routePrefix: '/docs',
        exposeRoute: true,
        swagger: {
            info: {
                title,
                description,
                version
            },
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            definitions,
            securityDefinitions: {
                bearer: {
                    type: 'apiKey',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'authorization',
                    in: 'header'
                }
            }
        }
    });

    app.register(cors, {
        origin: true,
        credentials: true
    })

    await connect();
    
    routes(app);

    return app;
};