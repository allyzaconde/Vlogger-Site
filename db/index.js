const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/details', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//connects to the database
exports.connect = () => new Promise((resolve, reject) => {
    const { connection } = mongoose;
    connection.on('error', reject);
    connection.once('open', resolve);
})

exports.Blog = require('./models/blog')(mongoose);
exports.Comment = require('./models/comment')(mongoose);
exports.User = require('./models/user')(mongoose);
exports.DiscardedToken = require('./models/discardedTokens')(mongoose);
exports.mongoose = mongoose;