const { common } = require('./common');
const { UniqueIDData, TextData, DateData, LimitData, SuccessData } = common;

const BlogFullData = {
    type: 'object',
    description: 'Blog object data from the database',
    properties: {
        username: TextData,
        title: TextData,
        summary: TextData,
        blogId: UniqueIDData,
        username: TextData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
};

const BlogListData = {
    type: 'array',
    description: 'A list of blogs',
    items: BlogFullData
};

const GetManyBlogResponse = {
    type: 'object',
    description: 'Returns a list of blogs',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: BlogListData
    }
};

const GetManyBlogQuery = {
    type: 'object',
    description: 'Query parameters for getting many blogs',
    properties: {
        limit: LimitData,
        startDateCreated: DateData, 
        endDateCreated: DateData, 
        startDateUpdated: DateData, 
        endDateUpdated: DateData
    }
};

const GetOneBlogParams = {
    type: 'object',
    description: 'Parameter for getting one blog',
    properties: {
        blogId: UniqueIDData
    }
};

const OneBlogFullData = {
    type: 'object',
    description: 'Blog object data from the database',
    properties: {
        username: TextData,
        title: TextData,
        summary: TextData,
        textBody: TextData,
        blogId: UniqueIDData,
        dateUpdated: DateData,
        dateCreated: DateData
    }
};

const GetOneBlogResponse = {
    type: 'object',
    description: 'Returns one blog',
    required: [ 'success', 'data' ],
    properties: {
        success: SuccessData,
        data: OneBlogFullData
    }
};

const PostBlogRequest = {
    type: 'object',
    description: 'Blog data to be sent to the server',
    required: ['title','summary','textBody'],
    properties: {
        title: TextData,
        summary: TextData,
        textBody: TextData
    }
};

const PostBlogResponse = {
    type: 'object',
    description: 'Create blog data to be saved into the database',
    required: [ 'success', 'blogId' ],
    properties: {
        success: SuccessData,
        blogId: UniqueIDData
    }
};

const DeleteBlogParams = {
    type: 'object',
    description: 'Parameter for getting one blog and deleting it',
    properties: {
        blogId: UniqueIDData
    }
};

const UpdateBlogParams = {
    type: 'object',
    description: 'Parameter for getting one blog and updating it',
    properties: {
        blogId: UniqueIDData
    }
};

const UpdateBlogRequest = {
    type: 'object',
    description: 'Blog data to be sent to the server for updating a blog',
    properties: {
        title: TextData,
        summary: TextData,
        textBody: TextData
    }
};

const UpdateBlogResponse = {
    type: 'object',
    description: 'Delete blog data in the database',
    required: [ 'success', 'data' ],
    properties: {
        success: SuccessData,
        data: OneBlogFullData
    }
};

exports.blogs = {
    GetManyBlogResponse,
    GetManyBlogQuery,
    GetOneBlogParams,
    GetOneBlogResponse,
    PostBlogRequest,
    PostBlogResponse,
    DeleteBlogParams,
    UpdateBlogParams,
    UpdateBlogRequest,
    UpdateBlogResponse
}