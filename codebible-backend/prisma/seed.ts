import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建种子数据...')

  await prisma.question.deleteMany({})
  await prisma.category.deleteMany({})

  const jsCategory = await prisma.category.create({
    data: {
      name: 'JavaScript核心',
      slug: 'javascript',
      icon: '📜',
      description: 'JavaScript 核心知识点，包括 ES6+、异步编程、原型链、闭包等',
      sortOrder: 1,
    },
  })

  const vueCategory = await prisma.category.create({
    data: {
      name: 'Vue框架',
      slug: 'vue',
      icon: '💚',
      description: 'Vue 2/3 框架知识点，包括响应式原理、生命周期、Composition API 等',
      sortOrder: 2,
    },
  })

  const hotCategory = await prisma.category.create({
    data: {
      name: '高频面试题',
      slug: 'hot',
      icon: '🔥',
      description: '前端面试高频出现的题目，涵盖 JS、CSS、框架、工程化等',
      sortOrder: 3,
    },
  })

  const jsQuestions = [
    {
      categoryId: jsCategory.id,
      title: 'var、let、const 的核心区别是什么？',
      content: '这是一道非常基础但又非常重要的 JS 面试题，面试官想考察你对 JS 变量声明的理解深度。',
      answer: `## var、let、const 的核心区别

### 1. 作用域不同

**var**：函数作用域（function-scoped）
- 在函数内声明，整个函数内可见
- 在全局声明，挂载到 window 对象
- 存在变量提升（hoisting）

**let/const**：块级作用域（block-scoped）
- 只在声明所在的代码块（{}）内可见
- 不会挂载到 window 对象
- 存在暂时性死区（TDZ）

---

### 2. 变量提升与暂时性死区

**var**：变量提升
- 声明会被提升到作用域顶部
- 但赋值不会提升
- 可以在声明前访问（值为 undefined）

\`\`\`javascript
console.log(a) // undefined
var a = 1
\`\`\`

**let/const**：暂时性死区（TDZ）
- 在声明之前访问会抛出 ReferenceError
- 从块的开始到声明语句之间是 TDZ

\`\`\`javascript
console.log(b) // ReferenceError: Cannot access 'b' before initialization
let b = 2
\`\`\`

---

### 总结对比

| 特性 | var | let | const |
|-----|-----|-----|-------|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | ✅ 有 | ❌ 无（TDZ） | ❌ 无（TDZ） |
| 重复声明 | ✅ 允许 | ❌ 不允许 | ❌ 不允许 |
| 重新赋值 | ✅ 可以 | ✅ 可以 | ❌ 不可以 |
| 挂载 window | ✅ 是 | ❌ 否 | ❌ 否 |`,
      difficulty: 'easy',
      frequency: 5,
      tags: JSON.stringify(['变量声明', 'ES6', '作用域']),
      sortOrder: 1,
    },
    {
      categoryId: jsCategory.id,
      title: '闭包是什么？闭包的应用场景有哪些？',
      content: '闭包是 JS 中非常重要的概念，也是面试高频题。',
      answer: `## 闭包（Closure）详解

### 什么是闭包？

**定义**：当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。

**简单理解**：
1. 函数 A 内部定义了函数 B
2. 函数 B 引用了函数 A 中的变量
3. 函数 B 被返回到外部执行
4. 此时即使函数 A 执行完毕，其内部变量也不会被销毁

\`\`\`javascript
function createCounter() {
  let count = 0
  return function() {
    return ++count
  }
}

const counter = createCounter()
console.log(counter()) // 1
console.log(counter()) // 2
console.log(counter()) // 3
\`\`\`

---

### 闭包的应用场景

#### 场景 1：实现模块模式（Module Pattern）

\`\`\`javascript
const calculator = (function() {
  let result = 0
  
  return {
    add: function(num) {
      result += num
      return this
    },
    getResult: function() {
      return result
    }
  }
})()
\`\`\`

#### 场景 2：函数防抖（Debounce）

\`\`\`javascript
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
\`\`\`

#### 场景 3：函数节流（Throttle）

\`\`\`javascript
function throttle(fn, interval) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
\`\`\`

---

### 闭包的优缺点

#### 优点
1. **变量私有化**：保护内部状态
2. **延长生命周期**：变量不会被意外销毁
3. **函数柯里化**：提高函数灵活性

#### 缺点
1. **内存泄漏**：闭包会导致变量无法被垃圾回收
2. **性能问题**：过多闭包可能影响性能
3. **调试困难**：作用域链复杂`,
      difficulty: 'medium',
      frequency: 5,
      tags: JSON.stringify(['闭包', '作用域', 'JavaScript核心']),
      sortOrder: 2,
    },
    {
      categoryId: jsCategory.id,
      title: '原型链是什么？如何理解 JS 的继承？',
      content: '原型链是 JS 实现继承的核心机制。',
      answer: `## 原型链与继承详解

### 什么是原型链？

JavaScript 是基于原型的语言，不像 Java 那样使用类继承。

**原型链的核心概念：**

1. **每个对象都有 \`__proto__\`**（隐式原型）
   - 指向创建该对象的构造函数的 \`prototype\`
   
2. **每个函数都有 \`prototype\`**（显式原型）
   - 只有函数才有 \`prototype\`
   - 包含由该函数创建的实例共享的属性和方法

\`\`\`javascript
function Person(name) {
  this.name = name
}

const person = new Person('张三')

console.log(person.__proto__ === Person.prototype) // true
console.log(Person.prototype.constructor === Person) // true
\`\`\`

---

### 原型链的查找机制

当访问对象的属性时：

1. 先在对象自身查找
2. 如果找不到，去 \`__proto__\` 中找
3. 如果还找不到，继续去 \`__proto__.__proto__\` 中找
4. 直到找到 \`Object.prototype.__proto__ === null\`
5. 如果还没找到，返回 \`undefined\`

---

### ES6 class 继承（语法糖）

\`\`\`javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  
  sayHello() {
    console.log('Hello,', this.name)
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name)
    this.age = age
  }
  
  sayAge() {
    console.log('Age:', this.age)
  }
}
\`\`\`

---

### 关键面试题

#### Q：\`__proto__\` 和 \`prototype\` 的区别？

\`\`\`javascript
// __proto__：每个对象都有，指向构造函数的 prototype
// prototype：只有函数才有，是该函数创建的实例的共享原型

function Foo() {}
const foo = new Foo()

console.log(foo.__proto__ === Foo.prototype) // true
console.log(Foo.__proto__ === Function.prototype) // true
console.log(Function.__proto__ === Function.prototype) // true
console.log(Object.__proto__ === Function.prototype) // true
console.log(Object.prototype.__proto__) // null - 原型链终点
\`\`\``,
      difficulty: 'hard',
      frequency: 5,
      tags: JSON.stringify(['原型链', '继承', 'JavaScript核心']),
      sortOrder: 3,
    },
  ]

  const vueQuestions = [
    {
      categoryId: vueCategory.id,
      title: 'Vue 响应式原理是什么？Vue2 和 Vue3 有什么区别？',
      content: '响应式是 Vue 的核心特性，也是面试高频考点。',
      answer: `## Vue 响应式原理详解

### Vue 2 响应式原理：Object.defineProperty

Vue 2 使用 \`Object.defineProperty\` 实现数据劫持。

#### 三大核心概念

1. **Observer（观察者）**：给对象的属性添加 getter/setter
2. **Dep（依赖收集）**：管理 Watcher
3. **Watcher（订阅者）**：连接数据和视图

---

### Vue 2 的局限性

#### 问题 1：无法检测对象属性的添加/删除

\`\`\`javascript
// ❌ 新添加的属性不是响应式的
vm.obj.age = 18
vm.obj.age = 20 // 视图不更新！

// ✅ 解决方法
Vue.set(vm.obj, 'age', 18)
Vue.delete(vm.obj, 'name')
\`\`\`

#### 问题 2：无法检测数组索引和长度的修改

\`\`\`javascript
// ❌ 通过索引修改
vm.list[0] = 100 // 视图不更新！

// ✅ 解决方法
Vue.set(vm.list, 0, 100)
vm.list.splice(0, 1, 100)
\`\`\`

---

### Vue 3 响应式原理：Proxy

Vue 3 使用 ES6 的 \`Proxy\` 重写了响应式系统。

#### 核心优势

1. **可以监听对象属性的添加/删除**
2. **可以监听数组索引和长度的变化**
3. **支持 Map、Set、WeakMap、WeakSet**
4. **惰性监听（只在访问时递归）**
5. **性能更好**

---

### Vue 2 vs Vue 3 响应式对比

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| **对象属性添加** | ❌ 不支持（需 Vue.set） | ✅ 原生支持 |
| **对象属性删除** | ❌ 不支持（需 Vue.delete） | ✅ 原生支持 |
| **数组索引修改** | ❌ 不支持 | ✅ 原生支持 |
| **Map/Set 支持** | ❌ 不支持 | ✅ 支持 |
| **底层实现** | Object.defineProperty | Proxy |`,
      difficulty: 'hard',
      frequency: 5,
      tags: JSON.stringify(['Vue', '响应式', 'Vue2 vs Vue3']),
      sortOrder: 1,
    },
    {
      categoryId: vueCategory.id,
      title: 'Vue 生命周期有哪些？Vue2 和 Vue3 有什么区别？',
      content: '生命周期是理解组件创建、更新、销毁过程的关键。',
      answer: `## Vue 生命周期详解

### Vue 2 生命周期

| 钩子 | 调用时机 | 常见用途 |
|------|---------|---------|
| \`beforeCreate\` | 实例创建前 | 几乎不用 |
| \`created\` | 实例创建完成 | 数据初始化、接口请求 |
| \`beforeMount\` | 挂载前 | 几乎不用 |
| \`mounted\` | 挂载完成 | DOM 操作、获取 DOM 元素 |
| \`beforeUpdate\` | 更新前 | 几乎不用 |
| \`updated\` | 更新完成 | DOM 更新后的操作 |
| \`beforeDestroy\` | 销毁前 | 清除定时器、解绑事件 |
| \`destroyed\` | 销毁完成 | 组件已销毁 |

---

### Vue 3 生命周期

| Vue 2 | Vue 3 (Options API) | Vue 3 (Composition API) |
|-------|---------------------|-------------------------|
| \`beforeCreate\` | \`beforeCreate\` | ❌ 使用 \`setup()\` |
| \`created\` | \`created\` | ❌ 使用 \`setup()\` |
| \`beforeMount\` | \`beforeMount\` | \`onBeforeMount\` |
| \`mounted\` | \`mounted\` | \`onMounted\` |
| \`beforeUpdate\` | \`beforeUpdate\` | \`onBeforeUpdate\` |
| \`updated\` | \`updated\` | \`onUpdated\` |
| \`beforeDestroy\` | \`beforeUnmount\` | \`onBeforeUnmount\` |
| \`destroyed\` | \`unmounted\` | \`onUnmounted\` |
| - | \`activated\` | \`onActivated\` |
| - | \`deactivated\` | \`onDeactivated\` |

---

### Vue 3 Composition API 示例

\`\`\`javascript
import { onMounted, onUnmounted, onUpdated, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    onUpdated(() => {
      console.log('组件已更新')
    })
    
    onUnmounted(() => {
      console.log('组件已卸载')
    })
    
    return { count }
  }
}
\`\`\`

---

### 生命周期图解

\`\`\`
                    ┌──────────────────┐
                    │   beforeCreate   │
                    │   (实例创建前)   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │     created      │
                    │   (实例创建完成)  │
                    │   ✅ 数据初始化   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   beforeMount    │
                    │     (挂载前)     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │      mounted     │
                    │    (挂载完成)    │
                    │   ✅ DOM 操作    │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 │
           ┌──────────────────┐       │
           │  beforeUpdate    │       │
           │    (更新前)      │       │
           └────────┬─────────┘       │
                    │                 │
                    ▼                 │
           ┌──────────────────┐       │
           │     updated      │       │
           │    (更新完成)    │───────┤
           └──────────────────┘       │
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  beforeUnmount   │
                              │    (卸载前)       │
                              │ ✅ 清除定时器     │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │    unmounted     │
                              │    (卸载完成)     │
                              └──────────────────┘
\`\`\``,
      difficulty: 'medium',
      frequency: 5,
      tags: JSON.stringify(['Vue', '生命周期', 'Vue2 vs Vue3']),
      sortOrder: 2,
    },
    {
      categoryId: vueCategory.id,
      title: 'Vue3 Composition API 和 Options API 有什么区别？',
      content: 'Vue3 引入了 Composition API，这是一个重大的变化。',
      answer: `## Vue3 Composition API 详解

### Options API vs Composition API

#### Options API（Vue 2 风格）

\`\`\`javascript
export default {
  data() {
    return {
      count: 0,
      name: '张三'
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('mounted')
  }
}
\`\`\`

#### Composition API（Vue 3 新风格）

\`\`\`javascript
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const name = ref('张三')
    
    const doubleCount = computed(() => count.value * 2)
    
    function increment() {
      count.value++
    }
    
    onMounted(() => {
      console.log('mounted')
    })
    
    return {
      count,
      name,
      doubleCount,
      increment
    }
  }
}
\`\`\`

---

### 核心区别

| 特性 | Options API | Composition API |
|------|-------------|-----------------|
| **组织方式** | 按选项组织（data、methods、computed） | 按逻辑功能组织 |
| **代码复用** | mixins（命名冲突、来源不明） | 组合式函数（清晰、灵活） |
| **类型支持** | TypeScript 支持有限 | 完美支持 TypeScript |
| **Tree-shaking** | 不友好 | 友好（按需引入） |
| **适用场景** | 简单组件 | 复杂组件、需要复用逻辑 |

---

### 组合式函数（Composables）

#### 什么是组合式函数？

组合式函数是利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。

#### 示例：useCounter

\`\`\`javascript
// composables/useCounter.ts
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = initialValue
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  }
}
\`\`\`

#### 使用组合式函数

\`\`\`javascript
import { useCounter } from './composables/useCounter'

export default {
  setup() {
    const { count, increment, decrement, reset } = useCounter(10)
    
    return {
      count,
      increment,
      decrement,
      reset
    }
  }
}
\`\`\`

---

### 另一个示例：useMouse

\`\`\`javascript
// composables/useMouse.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  function update(event: MouseEvent) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', update)
  })
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })
  
  return { x, y }
}
\`\`\`

---

### 为什么推荐 Composition API？

#### 1. 更好的逻辑复用

\`\`\`javascript
// Options API：使用 mixins（问题多）
export default {
  mixins: [useMouseMixin, useCounterMixin],
  // 问题：
  // 1. 不知道数据来自哪个 mixin
  // 2. 命名冲突
  // 3. 类型支持差
}

// Composition API：使用组合式函数（清晰）
export default {
  setup() {
    const { x, y } = useMouse()  // 明确来源
    const { count, increment } = useCounter() // 明确来源
    // 命名冲突可以重命名
    const { count: count2 } = useCounter(100)
  }
}
\`\`\`

#### 2. 更灵活的代码组织

\`\`\`javascript
// Options API：相关逻辑分散在不同选项中
export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      userProfile: {},
      userPosts: []
    }
  },
  computed: {
    // 搜索相关
    filteredResults() { /* ... */ },
    // 用户相关
    fullName() { /* ... */ }
  },
  methods: {
    // 搜索相关
    handleSearch() { /* ... */ },
    // 用户相关
    fetchUserProfile() { /* ... */ }
  },
  watch: {
    // 搜索相关
    searchQuery() { /* ... */ },
    // 用户相关
    userProfile() { /* ... */ }
  }
}

// Composition API：按逻辑功能组织
export default {
  setup() {
    // 搜索功能（集中在一起）
    const { searchQuery, searchResults, handleSearch } = useSearch()
    
    // 用户功能（集中在一起）
    const { userProfile, userPosts, fetchUserProfile } = useUser()
    
    return {
      searchQuery,
      searchResults,
      handleSearch,
      userProfile,
      userPosts,
      fetchUserProfile
    }
  }
}
\`\`\`

#### 3. 更好的 TypeScript 支持

\`\`\`javascript
// Composition API 天然支持类型推断
interface User {
  id: number
  name: string
  email: string
}

export default {
  setup() {
    // 类型自动推断
    const user = ref<User>({
      id: 1,
      name: '张三',
      email: 'zhangsan@example.com'
    })
    
    // user.value 的类型是 User
    // IDE 有完整的代码提示
    
    return { user }
  }
}
\`\`\`

---

### 最佳实践建议

| 场景 | 推荐 |
|------|------|
| 简单组件（展示型） | Options API |
| 复杂组件（有大量逻辑） | Composition API |
| 需要复用逻辑 | Composition API + Composables |
| 使用 TypeScript | Composition API |
| 需要更好的 Tree-shaking | Composition API |

---

### 总结

| 维度 | Options API | Composition API |
|------|-------------|-----------------|
| **学习曲线** | 较低（Vue 2 开发者熟悉） | 中等（需要理解新的概念） |
| **代码组织** | 按选项类型分散 | 按逻辑功能集中 |
| **代码复用** | mixins（有缺陷） | 组合式函数（推荐） |
| **TypeScript** | 支持有限 | 完美支持 |
| **Tree-shaking** | 不友好 | 友好 |
| **适用场景** | 简单组件 | 复杂组件、需要复用 |`,
      difficulty: 'medium',
      frequency: 4,
      tags: JSON.stringify(['Vue3', 'Composition API', 'Options API']),
      sortOrder: 3,
    },
  ]

  const hotQuestions = [
    {
      categoryId: hotCategory.id,
      title: 'Promise 和 async/await 有什么关系？事件循环是什么？',
      content: '这是前端面试最高频的问题之一。',
      answer: `## Promise、async/await 与事件循环

### Promise 静态方法

| 方法 | 成功条件 | 失败条件 |
|------|---------|---------|
| \`all()\` | 全部成功 | 任一失败 |
| \`race()\` | 任一先成功 | 任一先失败 |
| \`allSettled()\` | 全部完成（不管成功失败） | ❌ 永不失败 |
| \`any()\` | 任一成功 | 全部失败 |

---

### async/await

**async/await 是 Promise 的语法糖，让异步代码看起来像同步代码。**

\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/user/1')
    const user = await response.json()
    console.log('用户:', user)
    return user
  } catch (error) {
    console.log('出错:', error)
  }
}
\`\`\`

---

### 事件循环（Event Loop）

#### 宏任务 vs 微任务

| 类型 | 包含 |
|------|------|
| **宏任务** | setTimeout、setInterval、setImmediate、I/O、UI 渲染 |
| **微任务** | Promise.then/catch/finally、async/await、process.nextTick |

#### 执行顺序

1. **执行同步代码**
2. **执行所有微任务**
3. **执行一个宏任务**
4. **再次执行所有微任务**
5. **重复 3-4**

\`\`\`javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'))

console.log('5')

// 输出：1, 5, 3, 4, 2
\`\`\`

---

### 为什么微任务优先？

微任务设计目的是**尽快执行**，比如：

- Promise 的回调需要尽快处理
- DOM 变化需要尽快响应

如果先执行多个宏任务，可能会导致用户感知到的延迟。

\`\`\`javascript
// 场景：用户点击按钮，需要：
// 1. 显示加载状态
// 2. 发起请求
// 3. 隐藏加载状态

// 如果没有微任务：
// 宏任务队列：[请求1, 请求2, 渲染, 请求3, 渲染...]

// 有了微任务：
// 同步代码执行 → 微任务（状态更新）→ 渲染 → 宏任务
// 用户体验更好！
\`\`\``,
      difficulty: 'hard',
      frequency: 5,
      tags: JSON.stringify(['Promise', 'async/await', '事件循环', '微任务']),
      sortOrder: 1,
    },
    {
      categoryId: hotCategory.id,
      title: 'HTTP 和 HTTPS 有什么区别？HTTPS 是如何保证安全的？',
      content: '网络相关是面试必考题，HTTPS 是重点。',
      answer: `## HTTP vs HTTPS 详解

### HTTP 和 HTTPS 的区别

| 特性 | HTTP | HTTPS |
|------|------|-------|
| **端口** | 80 | 443 |
| **安全性** | ❌ 明文传输，不安全 | ✅ 加密传输，安全 |
| **证书** | 不需要 | 需要 CA 证书 |
| **协议** | 纯 HTTP | HTTP + SSL/TLS |
| **性能** | 稍快（无需加密） | 稍慢（加密/解密开销） |
| **SEO** | 无特殊权重 | 搜索引擎优先 |

---

### HTTPS 如何保证安全？

#### 1. 对称加密

\`\`\`
客户端 ──────────────────────────── 服务器
    │                                    │
    │        同一个密钥                  │
    │    ┌─────────────┐                │
    │    │ 密钥: ABC123 │                │
    │    └─────────────┘                │
    │         │              │           │
    │    加密 ─────────────► 解密         │
    │    解密 ◄───────────── 加密         │
    │                                    │
\`\`\`

**问题**：密钥如何安全传输？如果密钥被截获，加密就形同虚设。

---

#### 2. 非对称加密

\`\`\`
                    服务器
              ┌───────────────┐
              │  公钥: public  │ ◄────── 可以公开
              │  私钥: private │ ◄────── 只有服务器知道
              └───────────────┘

客户端：
1. 用服务器的公钥加密数据
2. 只有服务器的私钥能解密

服务器：
1. 用私钥解密数据
2. 用私钥签名，客户端用公钥验证
\`\`\`

**问题**：非对称加密计算慢，不适合加密大量数据。

---

#### 3. HTTPS 的实际方案：混合加密

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        HTTPS 握手过程                          │
├─────────────────────────────────────────────────────────────┤
│                                                                 │
│  客户端                          服务器                        │
│     │                               │                          │
│  1. ClientHello                   │                          │
│     │ (支持的加密套件、随机数)     │                          │
│     ├──────────────────────────────►                          │
│     │                               │                          │
│     │                        2. ServerHello                   │
│     │                        (选择的加密套件、随机数)          │
│     │                               │                          │
│     │                        3. Certificate                   │
│     │                        (服务器证书，包含公钥)            │
│     │◄──────────────────────────────┤                          │
│     │                               │                          │
│  4. 验证证书                        │                          │
│     • 检查证书是否过期               │                          │
│     • 检查证书是否被信任             │                          │
│     • 验证证书签名                   │                          │
│     │                               │                          │
│  5. 生成预主密钥                    │                          │
│     • 生成随机数 PreMaster Secret  │                          │
│     • 用服务器公钥加密              │                          │
│     ├──────────────────────────────►                          │
│     │                               │                          │
│     │                        6. 服务器用私钥解密               │
│     │                        得到 PreMaster Secret            │
│     │                               │                          │
│  7. 双方用相同的方式生成会话密钥    │                          │
│     Session Key = random1 +        │                          │
│                random2 +            │                          │
│                PreMaster Secret    │                          │
│     │                               │                          │
│  8. 使用会话密钥（对称加密）传输数据 │                          │
│     ├──────────────────────────────►                          │
│     │◄──────────────────────────────┤                          │
│                                                                 │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

### 为什么需要证书？

防止**中间人攻击**：

\`\`\`
【危险场景：中间人攻击】

客户端                    中间人                     服务器
   │                        │                          │
   │                        │                          │
   │◄── 发送公钥（服务器）──│◄── 发送公钥（真实）─────│
   │                        │                          │
   │ 以为是服务器的公钥      │                          │
   │ 实际是中间人的公钥      │                          │
   │                        │                          │
   ├── 用公钥加密数据 ─────►│                          │
   │                        │ 用私钥解密                │
   │                        │ 窃取数据                  │
   │                        │ 用服务器公钥重新加密      │
   │                        ├─────────────────────────►│
   │                        │                          │
   │                        │                     服务器无法察觉
\`\`\`

---

### CA 证书的作用

\`\`\`
【有证书的安全场景】

客户端                    服务器
   │                          │
   │◄───── 发送证书 ──────────│
   │      (包含：服务器信息、公钥)
   │      (CA 用私钥签名)
   │                          │
1. 验证证书
   • 用 CA 的公钥验证签名
   • 签名正确 = 证书未被篡改
   • 确认是真正的服务器公钥

2. 用证书中的公钥加密
   • 只有服务器有对应私钥
   • 中间人无法解密
\`\`\`

---

### 证书链

\`\`\`
根证书（Root CA）
    │
    ├── 中间证书 1（Intermediate CA）
    │       │
    │       └── 服务器证书（Server Certificate）
    │
    └── 中间证书 2
            │
            └── 其他服务器证书

【验证过程】
1. 浏览器内置根证书的公钥
2. 用根证书公钥验证中间证书签名
3. 用中间证书公钥验证服务器证书签名
4. 全部验证通过 = 可信
\`\`\`

---

### 面试高频问答

#### Q1：HTTPS 握手过程中，为什么不一直用非对称加密？

**答案**：
1. **性能问题**：非对称加密计算开销大（约 1000 倍）
2. **实际需求**：只需要安全地传输对称密钥
3. **混合方案**：非对称加密传输密钥，对称加密传输数据

#### Q2：HTTP/2 和 HTTPS 的关系？

**答案**：
- HTTP/2 是 HTTP 协议的新版本
- HTTP/2 不强制要求 HTTPS
- 但所有浏览器都只支持 HTTPS 上的 HTTP/2
- 所以实际使用中，HTTP/2 = HTTPS + HTTP/2

#### Q3：HTTP/2 有什么优势？

**答案**：
1. **二进制协议**：更高效的解析
2. **多路复用**：一个连接多个请求，避免队头阻塞
3. **头部压缩**：减少开销
4. **服务器推送**：服务器主动推送资源

#### Q4：HTTP/1.1 的队头阻塞问题是什么？

**答案**：

\`\`\`
【HTTP/1.1】
请求1 ──► 响应1 ──► 请求2 ──► 响应2 ──► 请求3 ──► 响应3
         （必须等待前一个完成）
         
问题：如果请求1很慢，后面的都被阻塞

【HTTP/2 多路复用】
┌─────────────────────────────────────────┐
│  请求1帧 │ 请求2帧 │ 请求1帧 │ 请求3帧 │ ...
└─────────────────────────────────────────┘
         同一连接，帧可以交错传输
         不会阻塞
\`\`\`

---

### 总结

| 概念 | 说明 |
|------|------|
| **HTTP** | 明文传输，不安全，端口 80 |
| **HTTPS** | HTTP + SSL/TLS 加密，安全，端口 443 |
| **对称加密** | 加解密用同一个密钥，快，但密钥传输是问题 |
| **非对称加密** | 公钥加密私钥解密，慢，但安全 |
| **HTTPS 实际方案** | 非对称加密传输会话密钥，对称加密传输数据 |
| **CA 证书** | 防止中间人攻击，验证服务器身份 |
| **HTTP/2** | 二进制、多路复用、头部压缩、服务器推送 |`,
      difficulty: 'hard',
      frequency: 5,
      tags: JSON.stringify(['HTTP', 'HTTPS', '网络', '安全']),
      sortOrder: 2,
    },
    {
      categoryId: hotCategory.id,
      title: 'CSS 盒子模型是什么？flex 和 grid 有什么区别？',
      content: 'CSS 布局是前端基础，面试必问。',
      answer: `## CSS 布局详解

### 盒子模型

#### 标准模型 vs IE 模型

\`\`\`
【标准模型（content-box）】
┌─────────────────────────────────┐
│           margin                │
│  ┌───────────────────────────┐  │
│  │        border             │  │
│  │  ┌─────────────────────┐  │  │
│  │  │      padding        │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │   content     │  │  │  │
│  │  │  │  width: 200px │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

实际宽度 = width + padding*2 + border*2 + margin*2

【IE 模型（border-box）】
┌─────────────────────────────────┐
│           margin                │
│  ┌───────────────────────────┐  │
│  │        border             │  │
│  │  ┌─────────────────────┐  │  │
│  │  │      padding        │  │  │
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │   content     │  │  │  │
│  │  │  │               │  │  │  │
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
│     width: 200px (包含 border)  │
└─────────────────────────────────┘

实际宽度 = width + margin*2
\`\`\`

#### box-sizing 属性

\`\`\`css
/* 标准模型（默认） */
box-sizing: content-box;

/* IE 模型（推荐） */
box-sizing: border-box;

/* 全局设置 border-box */
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`

---

### Flexbox 布局

#### 核心概念

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        Flex 容器                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │  Item1  │ │  Item2  │ │  Item3  │ │  Item4  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                              │
│  主轴 (main axis) ─────────────────────────────────►        │
│                                                              │
│  交叉轴 (cross axis)                                         │
│      ▼                                                       │
└─────────────────────────────────────────────────────────────┘
\`\`\`

#### 容器属性

| 属性 | 说明 | 可选值 |
|------|------|--------|
| \`flex-direction\` | 主轴方向 | row / row-reverse / column / column-reverse |
| \`flex-wrap\` | 是否换行 | nowrap / wrap / wrap-reverse |
| \`flex-flow\` | 简写 | flex-direction + flex-wrap |
| \`justify-content\` | 主轴对齐 | flex-start / flex-end / center / space-between / space-around / space-evenly |
| \`align-items\` | 交叉轴对齐 | flex-start / flex-end / center / stretch / baseline |
| \`align-content\` | 多行对齐 | flex-start / flex-end / center / stretch / space-between / space-around |

#### 项目属性

| 属性 | 说明 |
|------|------|
| \`order\` | 排列顺序，默认 0，越小越靠前 |
| \`flex-grow\` | 放大比例，默认 0（不放大） |
| \`flex-shrink\` | 缩小比例，默认 1（空间不足时缩小） |
| \`flex-basis\` | 基准大小，默认 auto |
| \`flex\` | 简写：flex-grow flex-shrink flex-basis |
| \`align-self\` | 单独对齐方式，覆盖 align-items |

---

### Grid 布局

#### 核心概念

\`\`\`
┌───────────────┬───────────────┬───────────────┐
│               │               │               │
│    Item 1     │    Item 2     │    Item 3     │
│               │               │               │
├───────────────┼───────────────┼───────────────┤  ← 网格线（Grid Lines）
│               │               │               │
│    Item 4     │    Item 5     │    Item 6     │
│               │               │               │
├───────────────┼───────────────┼───────────────┤
│               │               │               │
│    Item 7     │    Item 8     │    Item 9     │
│               │               │               │
└───────────────┴───────────────┴───────────────┘
        ▲               ▲               ▲
     网格线           网格线           网格线
     
3 列 × 3 行 = 9 个单元格
4 条列线 × 4 条行线
\`\`\`

#### 容器属性

| 属性 | 说明 |
|------|------|
| \`grid-template-columns\` | 定义列 |
| \`grid-template-rows\` | 定义行 |
| \`grid-template-areas\` | 定义区域 |
| \`grid-gap\` | 间距简写 |
| \`justify-items\` | 单元格内容水平对齐 |
| \`align-items\` | 单元格内容垂直对齐 |
| \`place-items\` | 简写 |
| \`justify-content\` | 整个网格水平对齐 |
| \`align-content\` | 整个网格垂直对齐 |
| \`place-content\` | 简写 |

#### 项目属性

| 属性 | 说明 |
|------|------|
| \`grid-column-start\` | 列起始线 |
| \`grid-column-end\` | 列结束线 |
| \`grid-column\` | 简写 |
| \`grid-row-start\` | 行起始线 |
| \`grid-row-end\` | 行结束线 |
| \`grid-row\` | 简写 |
| \`grid-area\` | 指定区域 |
| \`justify-self\` | 单元格内容水平对齐 |
| \`align-self\` | 单元格内容垂直对齐 |
| \`place-self\` | 简写 |

---

### Flex vs Grid 对比

| 维度 | Flexbox | Grid |
|------|---------|------|
| **定位** | 一维布局（行或列） | 二维布局（行 + 列） |
| **适用场景** | 组件布局、导航、卡片列表 | 整体页面布局、复杂网格 |
| **内容优先** | ✅ 内容决定布局 | ❌ 先定义结构 |
| **结构优先** | ❌ | ✅ 先定义网格，再放内容 |
| **学习曲线** | 较低 | 中等 |
| **兼容性** | IE10+ | IE11（部分支持） |

---

### 实战示例

#### 场景 1：导航栏（Flex）

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo { /* ... */ }
.nav-links {
  display: flex;
  gap: 20px;
}
\`\`\`

#### 场景 2：圣杯布局（Grid）

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header { grid-area: header; }
.nav { grid-area: nav; }
.main { grid-area: main; }
.aside { grid-area: aside; }
.footer { grid-area: footer; }
\`\`\`

#### 场景 3：响应式卡片（Flex + Grid 都可以）

\`\`\`css
/* Flex 版本 */
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px; /* 最小 300px */
}

/* Grid 版本（更简单） */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
\`\`\`

---

### 选择建议

| 场景 | 推荐方案 |
|------|---------|
| 导航栏 | ✅ Flex |
| 页面整体布局 | ✅ Grid |
| 卡片列表 | Flex 或 Grid |
| 居中对齐 | Flex（更简单） |
| 等分布局 | Flex（flex: 1） |
| 复杂二维布局 | ✅ Grid |
| 需要精确控制行列 | ✅ Grid |

**最佳实践：两者结合使用**
- Grid 做页面整体布局
- Flex 做组件内部布局`,
      difficulty: 'medium',
      frequency: 5,
      tags: JSON.stringify(['CSS', '盒子模型', 'Flex', 'Grid', '布局']),
      sortOrder: 3,
    },
  ]

  console.log('创建 JS 题目...')
  for (const q of jsQuestions) {
    await prisma.question.create({ data: q })
  }

  console.log('创建 Vue 题目...')
  for (const q of vueQuestions) {
    await prisma.question.create({ data: q })
  }

  console.log('创建高频面试题...')
  for (const q of hotQuestions) {
    await prisma.question.create({ data: q })
  }

  console.log('种子数据创建完成！')
  console.log('分类数:', await prisma.category.count())
  console.log('题目数:', await prisma.question.count())
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
