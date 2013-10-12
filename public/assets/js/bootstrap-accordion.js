/* ============================================================
 * bootstrap-accordion.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#accordions
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var parentSelector = '[data-toggle="accordion"]'
    , activeClass = 'active'
    , Accordion = function ($element, options) {
        var self = this
          , $items
        _extend(this, options)
        this.$parent = $element
        // this.bindEvents(['spread', 'fold'])
        $items = this.getItems()
        var $selected = $items.find('.selected')
        this.$selected = $selected.length ? $selected : $items.eq(0)
        $items.not(this.$selected).css('display','none')
        $items.bind('click', function(e){
          self.selectByClick.apply(self, arguments)
          self.toggle.apply(self, arguments)
          e.preventDefault()
          e.stopPropagation()
        })
        this.initStyle()
      }

  function _extend(obj) {
    var prop, source, args
    if(source = arguments[1]){
      for (prop in source) {
        obj[prop] = source[prop]
      }
      args = Array.prototype.slice.call(arguments ,2)
      args.unshift(obj)
      return _extend.apply(this, args)
    }else{
      return obj      
    }
  }

  Accordion.prototype = {

    constructor: Accordion

  , initStyle: function () {
      var itemHeight = this.getItemHeight()
        , $parent = this.getParent()
        , currentHeight = 0
        , $items = this.getItems()
        , i = 0
        , position = $parent.css('position')
        , $item = $($items[0])

      this.originItemCss = {
        position: $item.css('position'),
        left: $item.css('left'),
        right: $item.css('right'),
        top: $item.css('top'),
        bottom: $item.css('bottom')
      }

      this.originParentCss = {
        position: $parent.css('position')
      }

      this.marginTop = +($item.css('margin-top').replace('px',''))
      this.marginLeft = +($item.css('margin-left').replace('px',''))
      this.marginBottom = +($item.css('margin-bottom').replace('px',''))
      this.marginRight = +($item.css('margin-right').replace('px',''))

      this.paddingTop = +($parent.css('padding-top').replace('px',''))
      this.paddingLeft = +($parent.css('padding-left').replace('px',''))
      this.paddingBottom = +($parent.css('padding-bottom').replace('px',''))
      this.paddingRight = +($parent.css('padding-right').replace('px',''))

      if(position == 'static') $parent.css('position','relative')

    }

  , getItemHeight: function () {
      var itemHeight = this.itemHeight

      if(!itemHeight) itemHeight = this.itemHeight = this.getItems().first().outerHeight()
      return itemHeight
    }

  , getSelectClasses: function() {
      if(!this.selectClasses){
        var items = this.getItems()
          , i , classArr = [] , selectClass

        for ( i=0 ; i<items.length ; i++ ) {
          if(selectClass = $(items[i]).data('select-class')) classArr.push(selectClass)
        }
        this.selectClasses = classArr.join(' ')
      }
      return this.selectClasses
    }

  , selectByClick: function(e) {
    this._changeSelected($(e.currentTarget))
  }

  , _select: function() {
      var $parent = this.getParent()
        , $items = this.getItems()
        , $target = this.$selected
        , len = $items.length
        , i = 0

      $parent.find('.selected').removeClass('selected')
      $target.addClass('selected')
      for ( ; i < len ; i++ ) {
        $($items[i]).css({'z-index': len - i})
      }
      $target.css({'z-index': len + 1})
      this.$selected = $target
    }

  , _changeSelected: function($item){
      if(!$item.is(this.$selected))
        this.$items.not($item).hide();
        $item.show();
        this.$selected = $item
    }

  , select: function(item) {
    var $parent = this.getParent()
      , type = typeof item
      , $target

    if(type === 'object'){
      $target = item
    }
    if(type === 'string'){
      $target = $(item)
    }else if(type === 'number'){
      $target = $(this.getItems()[item])
    }

    this._changeSelected($target);
  }

  , close: function() {
    this.fold()
  }

  , bindEvents: function(type) {
      if(type instanceof Array){
        for(var i=0,l=type.length;i<l;i++){
          this.bindEvents(type[i])
        }
      }else{
        var $target = this.getToggleElement(type)
          , self = this
        $target.bind('click', function(){
          self.toggle.apply(self, arguments)
        })
      }
    }

  , getItems: function() {
      var $parent = this.getParent()
        , $items = this.$items

      if(!$items) $items = this.$items = $parent.find(this.itemSelector)
      return $items
    }

  , getToggleElement: function(type) {
      var $element
        , $parent = this.getParent()
        , selector = type + 'Selector'

      if(this[selector] === 'first'){
        $element = $parent.find(this.itemSelector).first()
      }else{
        $element = $parent.find(this[selector])
      }
      return $element
    }

  , toggle: function () {
      var $this = $(this)
        , $parent = this.getParent()
      if ($this.is('.disabled, :disabled')) return
      if (this.animateRunning()) return
      this.prohibitAnimate()
      if(this.isActive()){
        this.fold()
      }else{
        this.spread()
      }
    }

  , fold: function () {
      var $parent = this.getParent()
        , $items = this.getItems()
        , len = $items.length
        , self = this
        , itemHeight = this.getItemHeight()

      this.timer && clearTimeout(this.timer)
      this._select()
      this.onAnimateStart()
      $parent.removeClass(self.activeClass)
      $items.not('.selected').animate({top: this.paddingTop,opacity: 0}, 'fast')
      this.$selected.animate({top: this.paddingTop}, 'fast', null, function(){
        self.permitAnimate()
        self.$parent.trigger('change', self.$selected)
      })
      $parent.animate({height: itemHeight}, 'fast')
    }

  , spread: function () {
      var $parent = this.getParent()
        , $items = this.getItems()
        , len = $items.length
        , self = this
        , itemHeight = this.getItemHeight()
        , i = 0
        , self = this

      this.timer = setTimeout(function(){
        self.fold.apply(self)
      }, 10000)
      $parent.animate({height: itemHeight*len + this.paddingTop + this.paddingBottom}, 'fast')
      for ( ; i < len ; i++ ) {
        $($items[i]).animate({top: itemHeight*i + this.paddingTop, opacity: 1}, 'fast', null, function(){
          if(!--len){
            self.permitAnimate()
            self.onAnimateEnd()
            $parent.addClass(self.activeClass)
          }
        })
      }
    }

  , animateRunning: function () {
      return this.running
    }

  , prohibitAnimate: function () {
      this.$parent.addClass('animating')
      this.onAnimateStart()
      this.running = true
    }

  , permitAnimate: function () {
      this.$parent.removeClass('animating')
      this.running = false
    }

  , onAnimateStart: function () {
      var itemHeight = this.getItemHeight()
        , $parent = this.getParent()
        , currentHeight = 0
        , $items = this.getItems()
        , i = 0

      if(this.isActive()){
        currentHeight += this.paddingTop
        for ( ; i < $items.length ; i++ ) {
          currentHeight += this.marginTop
          $($items[i]).css({top: currentHeight})
          currentHeight += itemHeight + this.marginBottom
        }
      }else{
        $items.css({top: this.paddingTop}).show()
      }
      $items.css({
        position: 'absolute',
        left: this.paddingLeft,
        right: this.paddingRight
      })
      $parent.css({height: currentHeight || itemHeight})
    }

  , onAnimateEnd: function (){
      this.getItems().css(this.originItemCss)
      this.getParent().css(this.originParentCss)
    }

  , getParent: function () {
      return this.$parent
    }

  , isActive: function () {
      var $parent = this.getParent()
      if($parent.hasClass(this.activeClass)){
        return true
      }else{
        return false
      }
    }

  , animateOneByOne: function (type,items,callback) {
      var args = arguments
        , $item
        , params
        , self = this
      if(items.length){
        $item = $(Array.prototype.shift.apply(items))
        $item[type](50,function(){
          setTimeout(function(){
            self.animateOneByOne.apply(self,args)
          }, 50)
        })
      }else{
        callback.call(this)
      }
    }

  , destroy: function () {}

  }

  var old = $.fn.accordion

  $.fn.accordion = function (option) {

    return this.each(function () {
      var $this = $(this)
        , data = $this.data('accordion')
        , options = typeof option == 'object' && assembleOptions($this, option)
      if (!data) $this.data('accordion', (data = new Accordion($this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  function assembleOptions($el, options) {
    options = options || {};
    options.itemSelector = options.itemSelector || $el.data('item-selector') || 'li'
    options.activeClass = options.activeClass || $el.data('active-class') || activeClass
    return options
  }

  function autoSetup(e) {
    var $this = $(this)
      , $target = $(e.target)

    $this.attr('data-toggle', '').accordion()
    $target.click()
    return false
  }

  $.fn.accordion.Constructor = Accordion

  $.fn.accordion.noConflict = function () {
    $.fn.accordion = old
    return this
  }

  $(document)
    .on('click.accordion.data-api' , parentSelector, autoSetup)

}(window.jQuery);
