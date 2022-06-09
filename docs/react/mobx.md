# mobx

1. <https://zh.mobx.js.org/the-gist-of-mobx.html>
2. <https://github.com/mobxjs/mobx-react-lite>
3. <https://github.com/mobxjs/mobx>

先了解下 mobx-react-lite mobx-react mobx 之间的关系

- Mobx 对标 redux
- 如果只用 React.FC (HOOK) 时，用 mobx-react-lite 即可
- 如果要用 React.Component (Class) 时，用 mobx-react
- mobx-react 包含了 mobx-react-lite

项目的例子:

stores/index.ts:

```tsx
import TaskClassifyList from "./TaskClassifyList";
export type StoreType = typeof stores;
export type TaskClassifyListExampleProps = typeof stores.TaskClassifyList;

type KeysType = keyof StoreType;

const stores = {
  TaskClassifyList: new TaskClassifyList(),
};

function useMobx<T extends keyof StoreType>(storeName: T) {
  return stores[storeName];
}

function useInitData() {
  Object.keys(stores).forEach((key) => {
    const _k = key as KeysType;
    stores[_k].initData && stores[_k].initData();
  });
}
export { useMobx, useInitData };
```

stores/TaskClassifyList.ts:

```tsx
import { makeAutoObservable, action } from "mobx";
import { TaskGroupServiceListTaskGroup } from "@/service/task-group/TaskGroupService";

export type TaskClassifyProps = {
  id: string;
  name: string;
  code: string;
};

export type TaskClassifyListProp = TaskClassifyProps[];

class TaskClassifyList {
  list: TaskClassifyListProp = [];
  constructor() {
    makeAutoObservable(this);
  }
  get selectOptions() {
    // 计算属性
    return this.list.map((v) => ({
      value: v.code,
      label: v.name,
      id: v.id,
    }));
  }

  addTaskClassify = (item: TaskClassifyProps) => {
    this.list.push(item);
  };

  updateTaskClassify = (item: TaskClassifyProps) => {
    this.list = this.list.map((v) => {
      if (v.id === item.id) return item;
      return v;
    });
  };

  deleteTaskClassify = (id: string) => {
    this.list = this.list.filter((v) => v.id !== id);
  };

  initData() {
    TaskGroupServiceListTaskGroup({}).then(
      action("fetchSuccess", (data) => {
        const list = data.task_groups || [];
        this.list = list;
      }),
      action("fetchError", (error) => {})
    );
  }
}

export default TaskClassifyList;
```

函数组件上使用,需要使用 mobx-react-lite 插件:

```tsx
import { useMobx } from "@/stores";
import { observer } from "mobx-react-lite";

const Comp: React.FC = () => {
  const TaskClassifyList = useMobx("TaskClassifyList");
};

export default observer(Comp);
```

hooks 上不能直接使用, 响应不了数据变化; 需要在组件中通过参数的方式,传递进去:

```tsx
import { useMobx } from "@/stores";
import { observer } from "mobx-react-lite";
import useWorkTaskList from "@/pages/Flow/hooks/useWorkTaskList";

const Comp: React.FC = () => {
  const TaskClassifyList = useMobx("TaskClassifyList");
  useWorkTaskList(TaskClassifyList.selectOptions);
};

export default observer(Comp);
```
