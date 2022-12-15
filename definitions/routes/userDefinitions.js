const { common } = require('./common');
const { UniqueIDData, JWTToken, TextData, BooleanData, DateData, LimitData, SuccessData } = common;

const LoginUserRequest = {
    type: 'object',
    description: 'Login details to be authorized in the server',
    required: [ 'username', 'password' ],
    properties: {
        username: TextData,
        password: TextData
    }
};

const LoginUserResponse = {
    type: 'object',
    description: 'Login details to be authorized in the server',
    required: [ 'success', 'userId', 'data' ],
    properties: {
        success: SuccessData,
        userId: UniqueIDData,
        data: JWTToken
    }
};

const GetManyUserQuery = {
    type: 'object',
    description: 'Query parameters for getting many users',
    properties: {
        limit: LimitData,
        startDateCreated: DateData, 
        endDateCreated: DateData, 
        startDateUpdated: DateData, 
        endDateUpdated: DateData,
        isAdmin: BooleanData,
        isContributor: BooleanData
    }
};

const UserFullData = {
    type: 'object',
    description: 'User object data from the database',
    properties: {
        username: TextData,
        isAdmin: BooleanData,
        isContributor: BooleanData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
};

const OneUserFullData = {
    type: 'object',
    description: 'User object data from the database',
    properties: {
        username: TextData,
        firstName: TextData,
        lastName: TextData,
        isAdmin: BooleanData,
        isContributor: BooleanData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
};

const UserListData = {
    type: 'array',
    description: 'A list of users',
    items: UserFullData
};

const GetManyUserResponse = {
    type: 'object',
    description: 'Returns a list of users',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: UserListData
    }
};

const PostUserRequest = {
    type: 'object',
    description: 'Creates a new user',
    required: ['username', 'password', 'firstName', 'lastName'],
    properties: {
        username: TextData, 
        password: TextData, 
        firstName: TextData, 
        lastName: TextData
    }
};

const GetOneUserResponse = {
    type: 'object',
    description: 'Returns a user',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: OneUserFullData
    }
};

const GetOneUserParams = {
    type: 'object',
    description: 'Parameter for getting one user',
    properties: {
        id: UniqueIDData
    }
};


exports.users = {
    LoginUserRequest,
    LoginUserResponse,
    GetManyUserQuery,
    GetManyUserResponse,
    PostUserRequest,
    GetOneUserResponse,
    GetOneUserParams,
}