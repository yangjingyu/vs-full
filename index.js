
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

const globalStyle = `
.__is_full__ {
  position: absolute;
  touch-action: none;
  overflow: hidden;
  width: 100%!important;
  height: 100%!important;
  margin: 0;
}
`

const createStyle = () => {
  const style = document.createElement("style");
  style.appendChild(document.createTextNode(globalStyle));
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
}

const bindTouchmove = (el) => {
  const body = body
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

const requestFullscreen = (docElm) => {
  if (docElm.requestFullscreen) {
    docElm.requestFullscreen()
    return true
  } else if (docElm.msRequestFullscreen) {
    docElm.msRequestFullscreen()
    return true
  } else if (docElm.mozRequestFullScreen) {
    docElm.mozRequestFullScreen()
    return true
  } else if (docElm.webkitRequestFullScreen) {
    docElm.webkitRequestFullScreen()
    return true
  }
  return false
}

const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  }
}

const body = document.body
class Full {
  constructor(config) {
    this.$el = getEl(config.el)
    if (!(this.$el instanceof HTMLElement)) {
      throw 'el must be Element or Selector!'
    }
    if (config.toggle) {
      this.$toggle = getEl(config.toggle)
      if (!(this.$toggle instanceof HTMLElement)) {
        throw 'toggle must be Element or Selector!'
      }
    }
    this.cssText = this.$el.style.cssText
    this.config = config
    this.is_full = false
    createStyle()

    if (this.disableScroll) {
      this.__un_bind_touchmove__ = bindTouchmove(this.$el)
    }

    if (config.autoRotate && isMobile() && window.innerHeight < window.innerWidth) {
      this.__setCss__(3)
    }

    let toggle = () => {
      if (!body.classList.contains('__is_full__')) {
        this.requestFullscreen()
      } else {
        this.exitFullScreen()
      }
    }

    this.toggle = toggle.bind(this)

    if (this.$toggle instanceof HTMLElement) {
      this.$toggle.addEventListener('click', toggle, false)
    }

    var mql = window.matchMedia('(orientation: landscape)');
    let screenChange = (e) => {
      if (e.matches) {
        if (this.is_full) {
          if (this.isNative) {
            this.__setCss__(1)
          } else {
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
            if (this.isNative) {
              this.__setCss__(1)
            } else {
              this.__setCss__(2)
            }
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
      this.$toggle && this.$toggle.removeEventListener('click', toggle)
      this.toggle = null
      this.$toggle = null
      this.$el = null
      this.__destroy__ = null
      toggle = null
      screenChange = null
    }
  }

  requestFullscreen() {
    if (this.config.nativeFirst) {
      const isFull = requestFullscreen(this.$el)
      this.isNative = isFull
    }
    body.classList.add('__is_full__')
    this.is_full = true
    if (!this.isNative) {
      if (this.__full__) return
      this.$el.style.cssText = this.config.forceRotate && window.innerHeight > window.innerWidth ? fullStyleRotate(body) : fullStyle
      this.onUpdate && this.onUpdate()
    }
  }

  exitFullScreen() {
    body.classList.remove('__is_full__')
    this.is_full = false
    if (this.isNative) {
      exitFullScreen()
    } else {
      if (this.config.autoRotate && isMobile() && window.innerHeight < window.innerWidth) {
        this.__setCss__(3)
      } else {
        this.__setCss__(1)
      }
    }
  }

  __setCss__(type) {
    switch (type) {
      case 1:
        this.$el.style.cssText = this.cssText
        this.__full__ = false
        break
      case 2:
        this.$el.style.cssText = fullStyleRotate(body)
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
    this.__destroy__()
    this.__un_bind_touchmove__ && this.__un_bind_touchmove__()
  }
}

export default Full