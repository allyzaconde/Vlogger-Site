const { v4: uuid } = require('uuid');

module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const blogSchema = new Schema({
        title: {
            type: String,
            index: true
        },
        summary: {
            type: String
        },
        textBody: {
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
            unique: true,
            default: uuid
        },
        username: {
            type: String, 
            required: true,
            index: true
        }
    })

    return mongoose.model('Blog', blogSchema);
};