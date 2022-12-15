const { common } = require('./common');
const { UniqueIDData, TextData, DateData, LimitData, SuccessData } = common;

const CommentFullData = {
    type: 'object',
    description: 'Comment object data from the database',
    properties: {
        username: TextData,
        comment: TextData,
        dateUpdated: DateData,
        dateCreated: DateData,
        commentId: UniqueIDData
    }
};

const CommentListData = {
    type: 'array',
    description: 'A list of comments',
    items: CommentFullData
};

const CreateCommentParams = {
    type: 'object',
    description: 'Parameter for getting blog id',
    properties: {
        blogId: UniqueIDData
    }
};

const CommentParams = {
    type: 'object',
    description: 'Parameter for getting blog id',
    properties: {
        blogId: UniqueIDData,
        commentId: UniqueIDData
    }
}

const GetManyCommentResponse = {
    type: 'object',
    description: 'Returns a list of comments',
    required: ['success', 'data'],
    properties: {
        success: SuccessData,
        data: CommentListData
    }
};

const GetManyCommentQuery = {
    type: 'object',
    description: 'Query parameters for getting many comments',
    properties: {
        limit: LimitData,
        startDateCreated: DateData, 
        endDateCreated: DateData, 
        startDateUpdated: DateData, 
        endDateUpdated: DateData
    }
};

const PostCommentRequest = {
    type: 'object',
    description: 'Comment data to be sent to the server',
    required: ['comment'],
    properties: {
        comment: TextData
    }
};

exports.comments = {
    GetManyCommentResponse,
    GetManyCommentQuery,
    PostCommentRequest,
    CreateCommentParams,
    CommentParams
}