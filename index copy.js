var getEl = function (el) {
  if (typeof el === 'string') {
    return document.querySelector(el)
  } else {
    return el
  }
}

var createBlank = function () {
  var blank = document.createElement('div')
  var styles = [
    'position: absolute',
    'width: 100%',
    'height: 100%',
    'top: -10000px',
    'left: -10000px'
  ].join(';')
  blank.style = styles
  document.body.appendChild(blank)
  return blank
}

var fullStyle = `
  position: fixed;
  left: 0;
  height: 100%;
  width: 100%;
  top: 0;
`

var fullStyleRotate = (el) => `
  position: fixed;
  left: 0px;
  height: ${el.offsetWidth}px;
  width: ${el.offsetHeight}px;
  top: 0px;
  transform: rotate(90deg);
  transform-origin: 0 0;
  margin-left: ${el.offsetWidth}px;
`

function Full(config) {
  this.$el = getEl(config.el)
  this.$toggle = getEl(config.toggle)
  this.$blank = createBlank()
  const cssText = this.$toggle.style.cssText
  this.is_full = false
  const body = document.body
  this.__style__()

  
  this.$toggle.addEventListener('click', () => {
    if (!body.classList.contains('__is_full__')) {
      body.classList.add('__is_full__')
      this.is_full = true
      this.$el.style.cssText = fullStyle
    } else {
      body.classList.remove('__is_full__')
      this.is_full = false
      this.$el.style.cssText = cssText
    }
  }, false)

  var mql = window.matchMedia('(orientation: landscape)');

  function screenTest(e) {
    if (e.matches) {
      /* the viewport is 600 pixels wide or less */
      document.body.style.backgroundColor = 'pink';
    } else {
      /* the viewport is more than 600 pixels wide */
      document.body.style.backgroundColor = 'blue';
    }
  }
  mql.addEventListener('change', screenTest)
}

Full.prototype.__style__ = function () {
  var style = document.createElement("style");
  style.appendChild(document.createTextNode(".__is_full__{touch-action: none; overflow: hidden;}"));
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
}

Full.prototype.onUpdate = function () { }

export default Full