# rx-form-state

```shell
yarn add @sinoui/rx-form-state
```

## 使用方式

```typescript
const formState = createFormState();

formState.formState$.subscribe((formState) => {
  console.log(formState);
});

// 更新整个表单
formState.updateState((draft) => {
  set(draft.values, 'address.city', 'Beijing');
});

// 表单级别的操作
formState.setErrors();
formState.setTouched();
formState.setAsyncErrors();
formState.setPending();
formState.reset();
formState.submit();

// 表单域级别的操作
formState.setFieldValue('address.city', 'Beijing');
formState.setFieldValue('address.street', 'No.9');
formState.setFieldTouched('address.city', true);
formState.setFieldError('address.city', undefined);
formState.setFieldAsyncError('address.city', undefined);
formState.setFieldPending('address.city', true);
formState.blur('adress.city');

// 表单域配置
formState.addField({...});
formState.removeField(fieldName);
```

```tsx
function beginEndTimeValidate(value, values) {
  const { startTime, endTime } = values;

  if (startTime && endTime && startTime > endTime) {
    return '开始时间不能大于结束时间';
  }
}

function Demo() {
  const formState = useFormState();

  return (
    <FormStateContext.Provider value={formState}>
      <Field name="startTime" validate={beginEndTimeValidate} />
      <Field name="endTime" validate={beginEndTimeValidate} />
    </FormStateContext.Provider>
  );
}
```

## 关于 React 调度器优化

- IMMEDIATE: 立即更新表单域值 - 确保处理用户输入的优先级最高
- Normal: 更新值关联表单域值 - 值关联计算应该排在第二位
- LowPriority: 校验 - 校验不能阻止值的计算和处理

```typescript
import {
  unstable_NormalPriority,
  unstable_LowPriority,
  unstable_runWithPriority,
} from 'scheduler';

function setFieldValue(fieldName: string, value: string) {
  updateState((draft) => {
    draft.values[fieldName] = value;
  });

  unstable_runWithPriority(unstable_NormalPriority, () => {
    const newState = updateState((draft) => {
      applyFieldRelyRules(draft.values, fields, fieldName);
    });

    unstable_runWithPriority(unstable_LowPriority, () => {
      validate();
    });
  });
}
```

## 关于嵌套表单

采用嵌套对象的数据结构存储嵌套表单的状态数据。

使用[lodash.get](https://www.lodashjs.com/docs/latest#_getobject-path-defaultvalue)和[ldoash.set](https://www.lodashjs.com/docs/latest#_setobject-path-value)两个方法通过 json 路径的方式获取、设置对象中的值。

## 不可变

需要以不可变的方式维护状态。采用[immer](https://github.com/immerjs/immer)来维护状态的不可变性。

`updateState()`方法就是以不可变的方式来更新状态的方法。

## 为什么采用 RxJS

- RxJS 支持发布、订阅模式。表单状态发生变化后，通过发布、订阅模式，通知订阅了表单状态变化的组件重新获取状态
- RxJS 支持数据流模式。表单状态是一种动态变化的数据，借助于 RxJS，组件可以轻松获取到表单状态
- RxJS 提供众多操作数据流的方法，这样处理表单状态会得心应手
- RxJS 的概念能够轻松处理异步事件，比如异步校验

核心概念：

### 可观察对象（Observable）、订阅、观察者

可观察对象代表值或者事件流集合。就像是一个序列，里面的元素会随着时间推送。

可以通过`subscribe`方法**订阅**可观察对象的值、完成和错误状态：
`subscribe(onNext: (value) => void, onError?: (error) => void, onComplete?: () => void)`。

```ts
import { from } from 'rxjs';

const observable = from([1, 2, 3]);

// 订阅可观察对象
observable.subscribe(
  (value) => {
    console.log(value);
  },
  undefined,
  () => {
    console.log('completed');
  },
);
/* 输出：
1
2
3
completed
*/
```

```ts
import { Observable } from 'rxjs';

const obsevable = new Observable((observer) => {
  observer.next(0);

  setTimeout(() => {
    observer.next(1);
  }, 100);


  setTimeout(() => {
    observable.next(2);
  }, 50);

  setTimeout(() => {
    observable.complete();
  }, 200);
});

observable.subscribe((value) => {
  console.log(value);
}, undefined, () => {
  console.log('completed');
};

/* 输出：
0
2
1
completed
*/
```

```ts
import { Observable } from 'rxjs';

const obsevable = new Observable((observer) => {
  observer.next(0);

  setTimeout(() => {
    observer.next(1);
  }, 100);

  setTimeout(() => {
    observer.next(2);
  }, 50);

  setTimeout(() => {
    observer.error(new Error('未知错误'));
  }, 200);
});

observable.subscribe(
  (value) => {
    console.log(value);
  },
  (error) => {
    console.error(error);
  },
);

/* 输出：
0
2
1
未知错误
*/
```

再看一个示例：

```ts
import { Observable } from 'rxjs';

const observable = new Observable((observer) => {
  console.log('执行可观察对象的内部逻辑');
  observer.next(0);

  setTimeout(() => {
    observer.next(1);
  }, 100);

  setTimeout(() => {
    observer.next(2);
  }, 50);

  setTimeout(() => {
    observer.complete();
  }, 200);
});

observable.subscribe(
  (value) => {
    console.log(`观察者1：${value}`);
  },
  undefined,
  () => {
    console.log('观察者1：completed');
  },
);

observable.subscribe(
  (value) => {
    console.log(`观察者2：${value}`);
  },
  undefined,
  () => {
    console.log('观察者2: completed');
  },
);

/* 输出：
执行可观察对象的内部逻辑
观察者1：0
执行可观察对象的内部逻辑
观察者2：0
观察者1：2
观察者2：2
观察者1：1
观察者2：1
观察者1：completed
观察者2: completed
*/
```

从上面的示例可以得到以下几个讯息：

- 每次订阅可观察对象时，才会执行可观察对象的内部逻辑，通过 next 产生数据流 —— 序列的延迟计算
- 每次订阅可观察对象时，都会再次执行可观察对象的内部逻辑 —— 可观察对象的单播特性，每次订阅都会重新产生新的序列

### 主题（Subject）

在 RxJS 中，主题是一种特殊类型的可观察对象——允许将值发送给多个观察者。从形态上看，它既是可观察对象，又是观察者。

```ts
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe((value) => {
  console.log(`观察者A：${value}`);
});

subject.subscribe((value) => {
  console.log(`观察者B：${value}`);
});

subject.next(1);
subject.next(2);

/* 输出：
观察者A: 1
观察者B: 1
观察者A: 2
观察者B: 2
*/
```

注意：对[Subject](https://rxjs.dev/api/index/class/Subject)的订阅，只能监听到订阅之后产生的值，不能订阅到产生前的值，如下所示：

```ts
import { Subject } from 'rxjs';

const subject = new Subject<number>();

subject.next(0);
subject.next(1);

subject.subscribe((value) => {
  console.log(`观察者A：${value}`);
});

subject.subscribe((value) => {
  console.log(`观察者B：${value}`);
});

subject.next(2);
subject.next(3);

/* 输出：
观察者A: 2
观察者B: 2
观察者A: 3
观察者B: 3
*/
```

上面的例子中，并不会输出`0`和`1`。如果需要订阅到之前产生的值，可以用：

- [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) - 保留并直接获取最新值的 Subject，它需要一个初始化值。
- [ReplaySubject](https://rxjs.dev/api/index/class/ReplaySubject) - 可以订阅到所有之前产生的值。

[BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject)是经常用到的主题，示例如下：

```typescript
import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject(0);

console.log(subject.value);

subject.next(1);
subject.next(2);

subject.subscribe((value) => {
  console.log(`观察者：${value}`);
});

subject.next(3);
console.log(subject.value);

subject.next(4);
console.log(subject.value);

/* 输出：
0
观察者：2
观察者：3
3
观察者：4
4
*/
```

### 操作数据流

可以使用操作符操作数据流。

```ts
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const observable = from([1, 2, 3]);

const observable2 = observable.pipe(map((x) => x * x));

observable2.subscribe((value) => {
  console.log(value);
});

/* 输出：
1
4
9
*/
```

有很多操作数据流的方法。

项目中用到的操作如下：

- [map](https://rxjs.dev/api/operators/map)
- [mergeMap](https://rxjs.dev/api/operators/mergeMap)
- [debounceTime](https://rxjs.dev/api/operators/debounceTime)
- [distinctUntilChanged](https://rxjs.dev/api/operators/distinctUntilChanged)
