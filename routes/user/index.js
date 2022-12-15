const { create } = require('./create')
const { login } = require('./login')
const { logout } = require('./logout')
const { getOne } = require('./getOne')

exports.user = app => {
    create(app);
    login(app);
    logout(app);
    getOne(app);
}