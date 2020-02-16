// 给需要变化的那个元素增加一个观察者，当数据变化后执行对应当方法
/**
 * 例如有个input标签，绑定了messeage, 当input的value被修改了，绑定值也需要对应修改
 * 就是新值和老值对比，如果方法变化，就调用更新方法
 */


class Watcher {
    constructor(vm, expr, cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;

        // 先获取旧值
        this.value = this.get();
    }

    get(){
        Dep.target = this;
        let value = this.getVal(this.vm, this.expr);
        Dep.target = null;
        return value;
    }
    getVal(vm, expr) {
        expr = expr.split('.');
        let data = vm.$data;
        return expr.reduce((prev, next)=>{
          return prev[next];
        }, data)
    }
    // 对外暴露方法
    update() {
        let newValue = this.getVal(this.vm, this.expr);
        let oldValue = this.value;
        if(oldValue != newValue){
            this.cb(newValue); // 
        }
    }

}