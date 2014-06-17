+function ($) { "use strict";

  // DIALOG CLASS DEFINITION
  // ======================

  var Dialog = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Dialog.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Dialog.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Dialog.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.dialog', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.dialog', '[data-dismiss="dialog"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move dialogs dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.dialog', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.dialog-dialog') // wait for dialog to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Dialog.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.dialog')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.dialog')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.dialog')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideDialog, this))
        .emulateTransitionEnd(300) :
      this.hideDialog()
  }

  Dialog.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.dialog') // guard against infinite focus loop
      .on('focusin.bs.dialog', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Dialog.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.dialog', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.dialog')
    }
  }

  Dialog.prototype.hideDialog = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.dialog')
    })
  }

  Dialog.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Dialog.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="dialog-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.dialog', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // DIALOG PLUGIN DEFINITION
  // =======================

  var old = $.fn.dialog

  $.fn.dialog = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.dialog')
      var options = $.extend({}, Dialog.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.dialog', (data = new Dialog(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.dialog.Constructor = Dialog


  // DIALOG NO CONFLICT
  // =================

  $.fn.dialog.noConflict = function () {
    $.fn.dialog = old
    return this
  }


  // DIALOG DATA-API
  // ==============

  $(document).on('click.bs.dialog.data-api', '[data-toggle="dialog"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('dialog') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .dialog(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.dialog',  '.dialog', function () { $(document.body).addClass('dialog-open') })
    .on('hidden.bs.dialog', '.dialog', function () { $(document.body).removeClass('dialog-open') })

}(jQuery);
