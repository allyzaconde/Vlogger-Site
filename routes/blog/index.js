const { create } = require('./create')
const { getMany } = require('./getMany')
const { getOne } = require('./getOne')
const { deleteOne } = require('./delete')
const { update } = require('./update')

exports.blog = app => {
    create(app);
    getMany(app);
    getOne(app);
    deleteOne(app);
    update(app);
}