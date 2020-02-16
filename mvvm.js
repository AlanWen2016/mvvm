class MVVM{
    constructor(options){
        // 先把可用的属性挂载到示例上
        this.$el = options.el;
        this.$data = options.data;
       if(this.$el){
           // 数据劫持
            new Observer(this.$data);
            this.proxyData(this.$data);
           // 利用元素和数据进行编译
           new Compile(this.$el,this);
       } 
    }
    // vm示例直接代理data数据
    proxyData(data){
        Object.keys(data).forEach( key =>{
            Object.defineProperty(this, key, {
                get(){
                    return data[key]
                },
                set(newValue){
                    data[key] = newValue
                }
            })
        })
    }
}