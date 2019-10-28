
const app = new Vue({
    el: '#app',
    data: {
        message: 'Hello PWA!',
        list: []
    },
    created() {
        this.getUserList();
    },
    mounted() {
        if ('serviceWorker' in navigator) {
            this.registered().catch(err => console.log(err))
        }
    },
    methods: {
        async registered() {
            const register = await navigator.serviceWorker.register('sw.js', { scope: '/' });
            console.log('registering ...');
            this.askPermission();
        },
        async postMessage() {
            console.log('postMessage ...');
            navigator.serviceWorker.controller.postMessage('post-message');
        },
        async getUserList() {
            const { data } = await axios.get('/user/list');
            this.list = data.data;
        },
        async pushMessage() {
            setInterval(()=>{
                console.log(123);
            },2000)
            if (!('PushManager' in window)) {
                console.log('不支持')
                return;
            } else {
                console.log('支持')
                // const interval = setInterval(()=>{
                    window.navigator.serviceWorker.controller.postMessage('send-data');
                // },4000)
            
                // clearInterval(interval);
            }

        },
        askPermission() {
            return new Promise((resolve, reject)=> {
                const permissionResult = Notification.requestPermission((result)=> {
                    resolve(result);
                });

                if (permissionResult) {
                    permissionResult.then(resolve, reject);
                    console.log('getPushPermission ....')
                }
            })
                .then((permissionResult)=> {
                    if (permissionResult !== 'granted') {
                        throw new Error('We weren\'t granted permission.');
                    }
                });
        }
    }
})
