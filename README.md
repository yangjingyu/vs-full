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
});
```
