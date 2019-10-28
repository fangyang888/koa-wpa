
class UserController {
    async list(ctx, next) {
        const data = [
            {name:'wer1'},
            {name:'wer2'},
            {name:'wer3'},
            {name:'wer4'},
            {name:'wer5'},
            {name:'wer6'},
            {name:'wer7'},
        ]
            ctx.body = {
                  status: true,
                  data:data
              }
     }
    async userInfo(ctx, next) {
         let data = {
             name: '我是xxx',
             age: 25
         }
         ctx.body = {
             status: true,
             data
         };
     }
 }
 
 module.exports = new UserController();
 
 