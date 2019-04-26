/*
 * @Author: GuoWei
 * @LastEditors: GuoWei
 * @Description: 前端路由的 hash 实现
 * @Date: 2019-04-24 17:13:38
 * @LastEditTime: 2019-04-26 10:38:51
 */

class Router {
    constructor(routers) {
        this.routers = routers || {};
        this.currentUrl = '';
        this.history = [];
        this.currentIndex = this.history.length - 1;
        this.isBack = false;
        this.back = this.back.bind(this);
        this.forward = this.forward.bind(this);
        this.go = this.refresh.bind(this);                 // 修改hashchange 的回调函数的this指向，不然会指向window
        window.addEventListener('load', this.go, false);
        window.addEventListener('hashchange', this.go, false);
    }

    router(path, callback) {
        this.routers[path] = callback || function () { };
    }

    refresh() {
        this.currentUrl = location.hash.slice(1) || '/';   //此处是字符串的slice()，取#后的字符串
        this.routers[this.currentUrl]();
        if (!this.isBack) {
            this.history = this.history.slice(0, this.currentIndex + 1);   //处理在后退到某一历史路径时，再次点击新路径，更改历史纪录
            this.history.push(this.currentUrl);
            this.currentIndex++;
        }
        this.isBack = false;
        console.log(this.currentIndex)
        console.log(this.history)
    }

    back() {
        this.currentIndex = this.currentIndex > 0 ? --this.currentIndex : 0;
        location.hash = `#${this.history[this.currentIndex]}`;
        this.isBack = true;
    }

    forward() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
        }
        location.hash = `#${this.history[this.currentIndex]}`;
        this.isBack = true;
    }
}


var el = document.querySelector('#link');
var back = document.querySelector('#back')
var forward = document.querySelector('#forward')
// 先声明再逐个添加路由
var router = new Router();
router.router('/', function () {
    el.innerHTML = 'goods';
})
router.router('/goods', function () {
    el.innerHTML = 'goods';
})
router.router('/rating', function () {
    el.innerHTML = 'rating';
})
router.router('/seller', function () {
    el.innerHTML = 'seller';
})
back.addEventListener('click', router.back, false)
forward.addEventListener('click', router.forward, false)
// 直接写好路由规则在声明
// routers={
//     '/goods':function () {
//         el.innerHTML = 'goods';
//     },
//     '/rating':function () {
//         el.innerHTML = 'rating';
//     },
//     '/seller':function () {
//         el.innerHTML = 'seller';
//     }
// }
// var router = new Router(routers);





