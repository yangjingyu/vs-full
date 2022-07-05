
const isMobile = () => {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
}


const getEl = (el) => {
  if (typeof el === 'string') {
    return document.querySelector(el)
  } else {
    return el
  }
}

const createStyle = () => {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(".__is_full__{touch-action: none; overflow: hidden;}"));
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
}

const createBlank = () => {
  const blank = document.createElement('div')
  const styles = [
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

const bindTouchmove = (el) => {
  const body = document.body
  function ev(event) {
    if (body.classList.contains('__is_full__')) {
      event.preventDefault();
    }
  }
  el.addEventListener('touchmove', ev, { passive: false })
  return () => {
    el.removeEventListener('touchmove', ev)
  }
}

const fullStyle = `
  position: fixed;
  left: 0;
  height: 100%;
  width: 100%;
  top: 0;
`

const fullStyleRotate = (el) => `
  position: fixed;
  left: 0px;
  height: ${el.offsetWidth}px;
  width: ${el.offsetHeight}px;
  top: 0px;
  transform: rotate(90deg);
  transform-origin: 0 0;
  margin-left: ${el.offsetWidth}px;
`

class Full {
  constructor(config) {
    this.$el = getEl(config.el)
    this.$toggle = getEl(config.toggle)
    this.$blank = createBlank()
    this.cssText = this.$toggle.style.cssText
    this.is_full = false
    const body = document.body
    createStyle()

    if (this.disableScroll) {
      this.__un_bind_touchmove__ = bindTouchmove(this.$el)
    }

    if (config.autoRotate && isMobile() && this.$blank.offsetHeight < this.$blank.offsetWidth) {
      this.__full__ = true
      this.$el.style.cssText = fullStyle
    }

    const toggle = () => {
      if (!body.classList.contains('__is_full__')) {
        body.classList.add('__is_full__')
        this.is_full = true
        if (this.__full__) return
        this.$el.style.cssText = config.forceRotate ? fullStyleRotate(this.$blank) : fullStyle
        this.onUpdate && this.onUpdate()
      } else {
        body.classList.remove('__is_full__')
        this.is_full = false
        if (config.autoRotate && isMobile() && this.$blank.offsetHeight < this.$blank.offsetWidth) {
          this.__setCss__(3)
        } else {
          this.__setCss__(1)
        }
      }
    }

    this.toggle = toggle.bind(this)
    this.$toggle.addEventListener('click', toggle, false)

    var mql = window.matchMedia('(orientation: landscape)');
    const screenChange = (e) => {
      if (e.matches) {
        if (this.is_full) {
          if (config.forceRotate) {
            this.__setCss__(3)
          }
        } else {
          if (config.autoRotate && isMobile()) {
            this.__setCss__(3)
          }
        }
      } else {
        if (this.is_full) {
          if (config.forceRotate) {
            this.__setCss__(2)
          }
        } else {
          if (config.autoRotate && isMobile()) {
            this.__setCss__(1)
          }
        }
      }
    }
    mql.addEventListener('change', screenChange)

    this.__destroy__ = () => {
      mql.removeEventListener('change', screenChange)
      this.$toggle.removeEventListener('click', toggle)
      toggle = null
      this.__destroy__ = null
      screenChange = null
      this.$toggle = null
      this.$blank = null
      this.$el = null
    }
  }

  __setCss__(type) {
    switch (type) {
      case 1:
        this.$el.style.cssText = this.cssText
        this.__full__ = false
        break
      case 2:
        this.$el.style.cssText = fullStyleRotate(this.$blank)
        this.__full__ = false
        break
      case 3:
        this.__full__ = true
        this.$el.style.cssText = fullStyle
        break
    }
    this.onUpdate && this.onUpdate()
  }

  onUpdate() { }

  destroy() {
    this.$el.style.cssText = this.cssText
    this.$blank.parentNode.removeChild(this.$blank)
    this.__destroy__()
    this.__un_bind_touchmove__ && this.__un_bind_touchmove__()
  }
}


export default Full