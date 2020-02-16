let a = 3;
let b= a *3
console.log(b)
document.querySelector('.cell.b1').textContent = a * 10


let obj = {a: 3}
function convert(obj){
    Object.keys(obj).forEach(key =>{
        let val = obj[key];
    Object.defineProperty(obj, key,{
        get(){
            console.log(`getting is called, and value is ${val}`)
            return val
        },
        set(newVal){
            console.log(`setting is call, and the value is ${newVal}`);
            return newVal
        }
    })
})
}
convert(obj);
console.log(obj.a);
obj.a = 4;


class Dep {
    construct() {
        this.subscribers = new Set();
    }
    depend(){
        if(activeUpdate){
            this.subscribers.add(activeUpdate)
        }
    }
    notify() {
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
}

autoRun(()=>{
    console.log(activeUpdate)
})

// let dep = new Dep()
//
// autoRun(()=>{
//     dep.depend();
//     console.log('update');
// })
//
// dep.notify();

const state = {a: 1};

autoRun(()=>{
    console.log(`${state.a}`)
})

state.a ++


