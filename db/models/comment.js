const { v4: uuid } = require('uuid');

module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const commentSchema = new Schema({
        comment: {
            type: String,
            required: true
        },
        dateUpdated: {
            type: Number,
            required: true,
            default: () => new Date().getTime()
        },
        dateCreated: {
            type: Number,
            required: true,
            immutable: true,
            default: () => new Date().getTime()
        },
        blogId: {
            type: String,
            immutable: true,
            index: true, 
        },
        commentId: {
            type: String,
            immutable: true,
            index: true, 
            unique: true,
            default: uuid
        },
        username: {
            type: String, 
            required: true,
        }
    })
    
    return mongoose.model('Comment', commentSchema)
};