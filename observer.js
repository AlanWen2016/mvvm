class Observer{
    constructor(data){
        this.observe(data);
    }


    observe(data){
        if(!data || typeof data !== 'object'){
            return;
        }
        Object.keys(data).forEach((key)=>{
            this.defineReactive(data,key, data[key]);
            this.observe(data[key]);
        })
    }


    defineReactive(obj, key, value) {
        // debugger
        let _this = this;
        let dep = new Dep();
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                console.log('getting is called')
                if(Dep.target){
                    dep.addSub(Dep.target)
                }
                return value;
            },
            set(newValue){
                console.log('setting is called');
                if(newValue != value){
                    _this.observe(newValue)
                    value = newValue;
                    dep.notify();
                }
            }
        })
    }
}


class Dep{
    constructor(){
        this.subs = []
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){
        debugger
        this.subs.forEach(watcher=>watcher.update());
    }
}