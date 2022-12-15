module.exports = (mongoose) => {
    const { Schema } = mongoose;

    const discardedTokenSchema = new Schema({
        userId: {
            type: String, 
            required: true,
            index: true
        },
        token: {
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
        }
    })
    return mongoose.model('DiscardedToken', discardedTokenSchema)
};