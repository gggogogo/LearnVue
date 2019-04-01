// /*
//  * @Author: GuoWei
//  * @LastEditors: GuoWei
//  * @Description:  探索vue如何实现数组的双向绑定 
//  * @Date: 2019-04-01 09:50:17
//  * @LastEditTime: 2019-04-01 12:48:37
//  */

/** 
 * 尝试使用普通对象的双向绑定方式 处理数组
*/
function Observer(value) {
    this.value = value;
    this.walk(value);
}
Observer.prototype.walk = function (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
        // 给所有属性添加 getter、setter
        defineReactive(obj, keys[i], obj[keys[i]]);
    }
};

var dep = [];

function defineReactive(obj, key, val) {
    // 有自定义的 property，则用自定义的 property
    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
        return;
    }

    var getter = property && property.get;
    var setter = property && property.set;

    // 递归的方式实现给属性的属性添加 getter、setter
    var childOb = observe(val);
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            var value = getter ? getter.call(obj) : val;
            dep.push(value);
            return value;
        },
        set: function (newVal) {
            var value = getter ? getter.call(obj) : val;
            // set 值与原值相同，则不更新
            if (newVal === value) {
                return;
            }
            if (setter) {
                setter.call(obj, newVal);
            } else {
                val = newVal;
            }

            // 给新赋值的属性值的属性添加 getter、setter
            childOb = observe(newVal);
            console.log("数组改变了位置[" + key + "]的值改变了");
        }
    });
}

function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
}



var obj = {
    name: 'alen',
    arr: [1, 2, 3]
}
new Observer(obj);


obj.arr[0] = 11;    //数组改变了位置[0]的值改变了, 
console.log(obj)        // arr = [11,2,3]

obj.arr[4] = 11;     // 没有调用setter，所以没有输出
console.log(obj)     //  arr = [1,2,3,,11]     

obj.arr.push(1);        //// 没有调用setter，所以没有输出
console.log(obj)       //  arr = [1,2,3,1] 

obj.arr = []            // 数组改变了位置[arr]的值改变了
obj.arr[0] = 1           // 没有调用setter，所以没有输出
console.log(obj)        //arr = [1]