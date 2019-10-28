const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();
const static = require('koa-static');
const path = require('path');
const webpush = require('web-push');
const bodyParser = require('koa-bodyparser')
const PORT =4000;
const userRouter = require('./router/index.js');

const staticPath = './public';
app.use(bodyParser())
app.use(static(
    path.join( __dirname,  staticPath)
))

const publicVapidKey = 'BPf0lj1Oa2hVbTl1u5w5RlBw7c_H71k96EYxnjUNhBACQkou6jF6VU-Bg5aYtMvS6EdoG07GMd7kLXpiBccWdJ8';
const PrivateVapidKey = 'JrK1RHQ9vUcemSFTY8LvZSJ5hR_1EAR8jnvVSmQY_7k';
webpush.setVapidDetails('mailto:web-push-book@gauntface.com', publicVapidKey, PrivateVapidKey);

router.get('/', async ctx =>{
	console.log(123)
	ctx.body = 'hello koa';
})
router.post('/subscribe',(ctx)=>{
  console.log('request post ...')
  const payload = JSON.stringify({title:'push test'});
  console.log(ctx.request.body)
  const subscription = ctx.request.body;
  ctx.body = {
    status: true,
    payload
   };
   webpush.sendNotification(subscription,payload).then(()=>{
      console.log('发送成功');
  }).catch(err=> console.error(err));
})

app.use(router.routes()).use(router.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());

app.listen(PORT,()=>{
    console.log('app start');
    console.log(`Listening on port ${PORT}`);
});


