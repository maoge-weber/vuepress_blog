---
title: Vue3
cover: https://pan.zealsay.com/zealsay/cover/5.jpg
date: 2023-03-07
tags:
 - Vue3+tsx
 
categories: 
 - 前端技术

---
::: tip 介绍
Vue3<br>
:::

1.vue3+tsx 的几种写法
接下来使用几个简单的代码书写几种写法
第一种写法。

```tsx
import {defineComponent} from 'vue'

export default defineComponent({

    setup(){

        // 这里使用（）不用写return  如果是{}则需要写
        // 内部只能有一个跟标签，你可以使用<></>
        return ()=>(
            <div>hello tsx</div>
        )
    }


})
```

2.第二种写法
变量使用{}，只要在 tsx 想使用任何非字符串的代码，都需要用 {} 包裹，包括数字、布尔、函数表达式。

```tsx
import {defineComponent} from 'vue'

export default defineComponent({

    setup(){

        // 这里主要书写你的js代码，生命周期，状态等
        // 但是需要将状态方法暴露出去

        let a = ref<string>('12')

        return {a}
    },
    render(){
        return (
            <div>{this.a}<div>
        )
    }

})
```

3. 接收父组件传值
   需要 props 进行传值类型的设置，就会映射到 setup 中的 props，props 才能拿到值。

```tsx
export default defineComponent({
  props: {
  },
  setup(props) {
    const msg = ref('hello tsx')
    const state = reactive({
      count: 1
    })

    return () => (
      <div>
        {msg.value} <span>{state.count}</span>
      </div>
    )
  }
})
```

4.指令 bing 指令：

```tsx
vue中写法：

<A  :data="data"></A>

tsx写法：

<A data={data}></A>
```

vue 中需要进行组件的注册，tsx 写法如下：

```tsx
import {defineComponent} from 'vue'
import A from '..'

export default defineComponent({

    setup(){
        return ()=>(
            <div>
                <A></A>
            </div>
        )
    }

})
```

v-if：

```tsx
vue中

<div v-if="flag"></div>


tsx中判断则与react相似，与vue原始写法有较大差距

{
    flag?<div></div>:null
}
```

v-for：

```tsx
vue中

let data =[{},{},{}]

<div v-for="item in list" :key="item">{{item}}</div>



tsx中

{
    data?.map((item)=>{
        return <div key={item}>{item}</div>
   })
}
```

v-model

```tsx
vue中

<input  v-model="keyword" />

tsx中

<input v-model={keyword} />
```

v-model 传递参数
vue2 中使用 v-bind.sync 来实现数据的双向绑定，vue3 中移除此写法，只能使用 v-model，tsx 写法没有多大变化，emit 需要在 setup 第二个参数中解构。

```tsx
vue2写法

<Child :title.sync="title" />

然后需要在子组件更新父组件的值，

this.$emit('update:title',newValue)


vue3写法

<Child v-model='title'/>

const emits = defineEmits(['increase']);

emits('update:modelValue',newVlaue)


如果不想使用默认名称modelValue，可以这样

<Child v-model:title='title'></Child>

const emits = defineEmits(['事件']);

emits('update:title',newVlaue)
```

vue3+tsx 写法如下：

```tsx
<Child v-model={[pageTitle,'pageTitle']}/>

传递一个数组，第一项为传递的值，第二项为子组件接收的名称

setup(props,{emit}){

emit('update:pageTitle',newValue)

}

```

v-model 修饰符

```tsx
vue写法

<input v-model.trim="keyword"/>

tsx写法


<input v-model={[keyword,['trim']]}/>



vue写法
<input v-model:title="keyword"/>

tsx写法

<input v-model:title={keyword}/>

或者
<input v-model={[keyword,'title']}/>
```

插槽用法
子组件写法：

```tsx
import { defineComponent } from "vue";

export default defineComponent({
  name: "main",
  setup(props, { slots }) {
    return () => (
      <div>
        {slots.default ? slots.default() : null}
        {slots.title ? slots.title() : null}
      </div>
    );
  },
});
```

父组件写法：

```tsx
 <Main
     v-slots={{
        default:()=> <div>我是默认插槽</div>,
         title: ()=> <div>我是具名插槽</div>,
        }}
      ></Main>


或者



<Main>
    <slot name={'default'}>123</slot>
    <slot name={'title'}>123</slot>

</Main>
```

4.事件监听

```tsx
vue写法

<div @click="handleClick"></div>


tsx写法

<div onClick={handleClick}></div>
```

传递参数

vue 传参就是@click="handleClick(1)"，但是如果 tsx 写法和 react 一样，不用回调的形式写，会导致函数直接执行，并不会点击触发事件。正确写法：onClick={()=>handleClick(1)}

5.样式文件引入
全局引入 scss 文件：

```tsx
vite.config.ts

css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/style.scss';`,
        },
      },
    },
```

或者在 main.ts 中引入样式文件 6.动态 class 写法

```tsx
vue 写法

<div :class="{active:true}"></div>


tsx 写法  多类名写法

<div class={['box',true?'active':'']}></div>
```
```