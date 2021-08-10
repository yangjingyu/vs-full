# full

移动端模拟全屏容器

## 使用

```html
<div id="full" style="width: 100%;">
  <button id="toggle">{}</button>
</div>
```

```js
const full = new Full({
  // 需要全屏的容器
  el: document.querySelector('#full'),
  // 切换按钮
  toggle: document.querySelector('#toggle'),
  // 强制旋转
  forceRotate: false,
  // 自动旋转
  autoRotate: false
});
```

## 参数

- Selector 为 querySelector 选择器 如：'#ID' '.CLASS'

| 参数名      | 描述     | 可选值                      | 默认值 |
| ----------- | -------- | --------------------------- | ------ |
| el          | 全屏容器 | `HTMLElement` or `Selector` | null   |
| toggle      | 切换按钮 | `HTMLElement` or `Selector` | null   |
| forceRotate | 强制旋转 | `boolean`                   | false  |
| autoRotate | 自动旋转 | `boolean`                   | false  |
