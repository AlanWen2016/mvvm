
function convert(obj){
    let dep = new Dep()
    Object.keys(obj).forEach(key => {
        let val = obj[key];
        Object.defineProperty(obj, key,{
            get(){
                dep.depend();
                console.log(`getting is called, and value is ${val}`)
                return val
            },
            set(newVal){
                console.log(`setting is call, and the value is ${newVal}`);
                dep.notify();
                return newVal
            }
        })
    })
}

class Dep {
    constructor() {
        this.subscribers = new Set();
    }
    depend(){
        if(activeUpdate){
            this.subscribers.add(activeUpdate)
        }
    }
    notify() {
        console.log('notify', this.subscribers)
        this.subscribers.forEach(sub => sub())
    }

}

let activeUpdate;
function autoRun(update){
    function wrapperUpdate() {
        activeUpdate = wrapperUpdate;
        update();
        activeUpdate = null;
    }
    wrapperUpdate();
}

const state = {a: 1};
convert(state);

// watcher在这里做一次调用get，进行以来收集
autoRun(()=>{
    console.log(`state ${state.a}`)
})
state.a ++
