exports.errorHandler = (error, request, response) => {
    let statusCode = error.statusCode || 500;
    let errorCode = error.message;
    let errorMessage = error.message;

    const errors = {
        'blog/not-found': 'Blog doesn\'t exist',
        'request/body-malformed': 'Payload doesn\'t have body',
        'request/summary-malformed': 'Payload doesn\'t have summary',
        'request/title-malformed': 'Payload doesn\'t have title',
        'request/textBody-malformed': 'Payload doesn\'t have textBody',
        'request/blogId-malformed': 'Payload doesn\'t have blogId',
        'user/not-found': 'User not found',
        'user/exists': 'Username already exists',
        'request/username-malformed': 'Payload doesn\'t have username',
        'request/password-malformed': 'Payload doesn\'t have password',
        'request/passwordchar-malformed': 'Password should have more than 12 characters and has no number and special character',
        'request/firstName-malformed': 'Payload doesn\'t have firstName',
        'request/lastName-malformed': 'Payload doesn\'t have lastName',
        'auth/no-authorization-header': 'No authorization header found',
        'auth/wrong-password': 'Wrong password',
        'auth/expired': 'Token has expired',
        'auth/unauthorized': 'Not authorized to use this path',
        'auth/discarded': 'Token already logged-out',
        'auth/forbidden': 'You are not allowed to do this',
        'request/comment-malformed': 'Payload doesn\'t have comment',
        'comment/not-found': 'Comment doesn\'t exist'
    }
    
    if(error.validation && error.validation.length && error.validationContext === 'body'){
        statusCode = 400;
        errorCode = 'request/malformed';
    }

    if(errorMessage === errorCode){
        errorMessage = errors[errorCode];
    }

    return response
        .code(statusCode)
        .send({
            success: false,
            code: errorCode,
            message: errorMessage
        });
}