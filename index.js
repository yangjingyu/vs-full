function Full(config) {
  this.el = this.getEl(config.el)
  if (!(this.el instanceof HTMLElement)) {
    throw 'el must be Element or Selector!'
  }
  this.toggle = this.getEl(config.toggle)
  if (!(this.toggle instanceof HTMLElement)) {
    throw 'toggle must be Element or Selector!'
  }
  this.forceRotate = config.forceRotate || false
  this.disableScroll = config.disableScroll || false
  this.blank = this.insertBlank()
  this.unbindToggle = this.bindToggle()
  this._style = this.el.getAttribute('style')

  this.css = {
    w: this.el.offsetWidth,
    h: this.el.offsetHeight,
  }

  this.type = -1
  this.isDestroy = false
  this.cancelFrame = null
  this.shouldUpdate = true

  var style = document.createElement("style");
  style.appendChild(document.createTextNode(".__is_full__{touch-action: none; overflow: hidden;}"));
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);

  this.autoRotate = config.autoRotate
  if (this.autoRotate) {
    this.bindOriginChange()
  }

  if (this.disableScroll) {
    this.unBindTouchmove = this.bindTouchmove()
  }

  this.onUpdate = function () { }
}

Full.prototype.getEl = function (el) {
  if (typeof el === 'string') {
    return document.querySelector(el)
  } else {
    return el
  }
}

Full.prototype.insertBlank = function () {
  var blank = document.createElement('div')
  var styles = [
    'position: absolute',
    'width: 100vw',
    'height: 100vh',
    'top: -10000px',
    'left: -10000px'
  ].join(';')
  blank.style = styles
  document.body.appendChild(blank)
  return blank
}

Full.prototype.getWH = function () {
  var data = {
    ow: this.blank.offsetWidth,
    oh: this.blank.offsetHeight,
    ww: window.innerWidth,
    wh: window.innerHeight,
    o: window.orientation
  }
  data.hasTools = data.h > data.wh
  data.w = Math.min(data.ow, data.ww)
  data.h = Math.min(data.oh, data.wh)
  return data
}

Full.prototype.bindToggle = function () {
  var that = this
  const fn = function () {
    that.shouldUpdate = true
    var body = document.body
    if (!body.classList.contains('__is_full__')) {
      body.classList.add('__is_full__')
      that.getStyle(that.forceRotate ? 1 : 3)
      that.__is_full__ = true
      that.bindOriginChange()
    } else {
      body.classList.remove('__is_full__')
      that.getStyle(2)
      that.__is_full__ = false
    }
  }
  this.toggle.addEventListener('click', fn, false)

  return function () {
    that.toggle.removeEventListener('click', fn, false)
  }
}

Full.prototype.getStyle = function (boo) {
  var that = this
  var offset = that.getWH()
  this.oldEl = Object.assign({}, offset)
  this.type = boo
  switch (boo) {
    case 1:
      var trans = Math.abs(offset.w - offset.h) / 2
      that.el.style = this._style + [
        'width:' + offset.h + 'px',
        'height:' + offset.w + 'px',
        'position: fixed',
        'z-index: 99999',
        'top: 0',
        'left: 0',
        'transform:rotate(90deg) translate(' + trans + 'px, ' + trans + 'px)'
      ].join(';')
      break
    case 2:
      that.el.style = this._style
      break
    case 4:
      that.el.style = this._style + [
        'width:' + that.css.h + 'px',
        'height:' + that.css.w + 'px',
      ].join(';')
      break
    case 3:
      that.el.style = this._style + [
        'width:' + offset.ww + 'px',
        'height:' + offset.wh + 'px',
        'top: 0',
        'left: 0',
        'position: fixed',
        'z-index: 99999',
      ].join(';')
      break
  }
}

Full.prototype.bindOriginChange = function () {
  var that = this
  var body = document.body
  var w = this.css.w
  that.cancelFrameFn()
  var willChange = null
  var needUpdate = true
  var update = function () {
    if (body.classList.contains('__is_full__') || that.autoRotate) {
      if (Math.abs(window.orientation) === 90) {
        that.getStyle(3)
      } else {
        if (!body.classList.contains('__is_full__')) {
          that.getStyle(2)
        } else {
          that.getStyle(that.forceRotate ? 1 : 3)
        }
      }
    } else {
      that.getStyle(2)
    }

    if ((that.__is_full__ || that.autoRotate || needUpdate) && !that.isDestroy) {
      if (window.requestAnimationFrame) {
        that.cancelFrame = window.requestAnimationFrame(update)
      } else {
        that.cancelFrame = setTimeout(update, 100)
      }
    }

    if (that.el.offsetWidth !== w) {
      w = that.el.offsetWidth
      if (willChange) clearTimeout(willChange)
      willChange = setTimeout(() => {
        w = that.el.offsetWidth
        // that.el.innerText += '\n' + w
        const data = {
          w: w,
          h: that.el.offsetHeight,
          ow: w,
          oh: that.el.offsetHeight,
          or: window.orientation
        }
        if (that.type === 1 || Math.abs(window.orientation) === 90) {
          data.ow = data.h
          data.oh = data.w
        }
        needUpdate = false
        that.onUpdate && that.onUpdate(data)
      }, 25)
    }
  }

  update()
}

Full.prototype.bindTouchmove = function () {
  var body = document.body
  this.el.addEventListener('touchmove', function (event) {
    if (body.classList.contains('__is_full__')) {
      event.preventDefault();
    }
  }, { passive: false })
}

Full.prototype.cancelFrameFn = function () {
  var that = this
  if (that.cancelFrame) {
    if (window.cancelAnimationFrame) {
      window.cancelAnimationFrame(that.cancelFrame)
    } else {
      clearTimeout(that.cancelFrame)
    }
  }
}


Full.prototype.destroy = function () {
  this.isDestroy = true
  this.unbindToggle()
  this.cancelFrameFn()
  if (this.unBindTouchmove) {
    this.unBindTouchmove()
  }
}

export default Full