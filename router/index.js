const router = require('koa-router')();
const userctrl = require('../controllers/User.js');

router.get('/user/list', userctrl.list).post('/user/userinfo', userctrl.userInfo);

module.exports = router;