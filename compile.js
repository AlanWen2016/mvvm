class Compile{
    constructor(el, vm){
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm  = vm;
        if(this.el){
            // 1.先把真是的Dom移入内存中fragment
               let fragment = this.node2fragment(this.el);
            // 2. 编译， 提取想要的元素介个 v-model和文本节点
                this.compile(fragment);
            // 3. 把编译好的fragment放回页面
                this.el.appendChild(fragment);
        }
    }

    // 辅助方法
    isElementNode(node){
        return node.nodeType === 1;
    }
    // 判断是不是指令
    isDirective(name) {
        return name.includes('v-')
    }




    // 核心方法
    node2fragment(el){
        // 需要将el内容放到内存中
        let firstChild;

        // 创建空白文本片段
        let fragment = document.createDocumentFragment();

         while(firstChild = el.firstChild){
            fragment.appendChild(firstChild)
         }
         return fragment;
    }

    compile(fragment) {
        let childNodes = fragment.childNodes;
        // console.log(childNodes);
        // 检查是元素还是文本
        Array.from(childNodes).forEach(node => {
            if(this.isElementNode(node)){
                // 元素节点, 递归检查
                this.compileElement(node);// 编译指令，提取元素节点的指令
                this.compile(node);
            }else{
                // 文本节点 {{}}
                console.log(node)
                this.compileText(node);

            }
        });

    }


    /**
     * 编译元素
     */
    compileElement(node) {
        // 获取节点中的属性, 袋
        let attrs = node.attributes;
        // 查看打印的节点属性： NamedNodeMap {0: type, 1: v-model, type: type, v-model: v-model, length: 2}
        // console.log(attrs)
        // console.log(Array.from(attrs))
        Array.from(attrs).forEach( attr =>{
            let attrName = attr.name;
            if(this.isDirective(attrName)){ // 是v-xxx指令
                // 是v-XXX指令， 取对应值，并修改对应节点
                let expression = attr.value; // message
                let typeText = attrName.slice(2);
                // debugger
                CompileUtil[typeText](node, this.vm, expression);
                // TODO 取到示例vm中，data属性下message的值，放到node节点中
                // console.log(expression)
            }
        })



    }

    /**
     * 编译文本
     */
    compileText(node) {
        let expr = node.textContent;
        // console.log(expr); // {{ message }}    需要考虑 {{ a }} {{ b }} {{ c }}这种情况
        let reg = /\{\{([^}]+)\}\}/g;
        // console.log(reg.test(expr), expr)
        if(reg.test(expr)){
            // TODO 
            CompileUtil['text'](node, this.vm, expr)
        }

    }
}



CompileUtil = {
    getVal(vm, expr) {
      expr = expr.split('.');
      let data = vm.$data;
      return expr.reduce((prev, next)=>{
        return prev[next];
      }, data)
    },
    getTextVal(vm ,expr) {
        return expr.replace(/\{\{([^}]+)\}\}/g, (...args)=>{
            // console.log(args)
            return this.getVal(vm, args[1].trim());
        })
    },
    // html 
    text(node, vm, expr) { // 文本处理
        // debugger
        let updateFn = this.update['textUpdater']; 
        // expr = {{ message.a }}
       
        let value = this.getTextVal(vm, expr);

        // {{a}} {{b}}
        expr.replace(/\{\{([^}]+)\}\}/g, (...args)=>{
            // console.log(args) // output: ["{{ message }}", " message ", 9, "↵        {{ message }}↵    "]
            // debugger
            new Watcher(vm, args[1].trim(), newValue=>{
                debugger
                // b的值不能插入整个节点
                // 如果数据变化了，文本节点要重新获取依赖的属性更新文本中的内容?
                updateFn && updateFn(node, this.getTextVal(vm, expr));
            })

        })
        // 增加一个监控，数据变化应该调用watch侧callback
        updateFn && updateFn(node, value);
    },
    setVal(vm, expr, value){
        expr = expr.split('.');
        return expr.reduce((prev, next, currentIndex)=>{
            if(currentIndex === expr.length -1){
                return prev[next] = value
            }
            return prev[next]
        }, vm.$data)
    },
    model(node, vm, expr) { // input框处理
        let updateFn = this.update['modelUpdater'];
        new Watcher(vm, expr,(newValue)=>{
            // 当值变化后回调用cb,将新的值传递过来
            updateFn && updateFn(node, this.getVal(vm, expr))
        })
        // input框增加处理事件
        node.addEventListener('input', (e)=>{
            let newValue = e.target.value;
            this.setVal(vm, expr, newValue);

        })
        updateFn && updateFn(node, this.getVal(vm, expr))


    },
    update: { 
        textUpdater(node, value){
            node.textContent = value;
        },
        modelUpdater(node, value){ // 输入框更新
            node.value = value;
            // console.log(value, 'modelUpdate')
        }
        
    }
}