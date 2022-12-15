const { common } = require('./routes/common')
const { SuccessResponse } = common;
const { blogs } = require('./routes/blogDefinitions');
const { users } = require('./routes/userDefinitions');
const { comments } = require('./routes/commentDefinitions');

exports.definitions = {
    SuccessResponse,
    blogs,
    users,
    comments
}