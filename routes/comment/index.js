const { create } = require('./create')
const { getMany } = require('./getMany')
const { deleteOne } = require('./delete')

exports.comment = app => {
    create(app);
    getMany(app);
    deleteOne(app);
}