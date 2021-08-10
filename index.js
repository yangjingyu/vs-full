; (function () {
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
    this.blank = this.insertBlank()
    this.bindToggle()
    this._style = this.el.getAttribute('style')

    this.css = {
      w: this.el.offsetWidth,
      h: this.el.offsetHeight,
    }

    var style = document.createElement("style");
    style.appendChild(document.createTextNode(".__is_full__{touch-action: none}"));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
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
    this.toggle.addEventListener('click', function () {
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
    })
  }

  Full.prototype.getStyle = function (boo) {
    var that = this
    var offset = that.getWH()
    switch (boo) {
      case 1:
        var trans = Math.abs(offset.w - offset.h) / 2
        that.el.style = this._style + [
          'width:' + offset.h + 'px',
          'height:' + offset.w + 'px',
          'position: fixed',
          'z-index: 99999',
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
          'position: fixed',
          'z-index: 99999',
        ].join(';')
        break
    }
  }

  Full.prototype.bindOriginChange = function () {
    var that = this
    var body = document.body

    var update = function () {
      if (body.classList.contains('__is_full__')) {
        if (Math.abs(window.orientation) === 90) {
          that.getStyle(3)
        } else {
          that.getStyle(that.forceRotate ? 1 : 3)
        }
      } else {
        that.getStyle(2)
      }
      if (that.__is_full__) {
        window.requestAnimationFrame(update)
      }
    }
    window.requestAnimationFrame(update)
  }

  window.Full = Full
})();