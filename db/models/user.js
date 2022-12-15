const { v4: uuid } = require('uuid');

module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const userSchema = new Schema({
        username: {
            type: String, 
            required: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        isContributor: {
            type: Boolean,
            default: false
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
        userId: {
            type: String,
            required: true,
            immutable: true,
            default: uuid
        }
    })
    return mongoose.model('User', userSchema)
};