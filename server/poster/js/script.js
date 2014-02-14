(function($) {

  var _$grid_blocks;
  var _$grid_container;
  var _cell_w, _cell_h, _gouttiere=0;

  function init(){
    console.log('init | settings', settings);
    _$grid_container = $('<div id="grid-container">').appendTo('body');

    setupLayout();

    _$grid_blocks = $('.grid-item', _$grid_container);

    $('.bigtext').bigtext({ maxfontsize: 50 });

    setupGrid();
    if(!settings.refresh) {
      cleanSRC();
    } else {
      window.callPhantom(); 
    }
  };

  /**
  * define item sizes from item quantity
  */
  function setupLayout(){
    console.log("settings.nb_items = " + settings.nb_items);

    var surface = _$grid_container.width() * _$grid_container.height();
    // console.log("surface = "+surface);
    
    var item_surface = surface / settings.nb_items;
    // console.log("item_surface = "+item_surface);

    cell_w = cell_h = Math.floor(Math.sqrt(item_surface)*0.1);
    // console.log('cell_w = '+cell_w+" | cell_h = "+cell_h);

    var wh, $clone;
    $('#item-list li').each(function() {
      wh = getRandomSize(cell_w);
      
      $clone = $(this)
        .clone()
        .attr("wh", wh)
        .css({
          width:wh,
          // height:wh
        });
        
      // reorder items the bigest before the smaller
      if($('li', _$grid_container).size()){
        var $before = false;
        $('li', _$grid_container).each(function(index, el){
          if ($(this).attr('wh') < wh ){
            $before = $(this);
            return false;
          }
        });
        if($before){
          $before.before($clone);
        }else{
          $clone.appendTo(_$grid_container);
        }
      }else{
        $clone.appendTo(_$grid_container);
      }
            
      $(this).remove();
    });
  };

  function getRandomSize(d){
    var max = 15, min = 1;
    var rand = Math.floor(Math.random() * (max - min) + min)*d;
    // console.log('rand = '+rand); 
    return rand;
  };

  function setupGrid(){
    _$grid_blocks.addClass('grid-block');
    _grid = new Grid(_$grid_container, {
      cell_w:_cell_w,
      cell_h:_cell_h,
      padding:{t:0,r:0,b:0,l:0},
      // centered:false,
      gouttiere: _gouttiere,
      // augmentable:true,
      // fillfreecells:true
      dispatch_mode:"random"
    });  
  };

  function cleanSRC(){
    var itemsToClean = [];
    $('.grid-block:not(.outside)', _$grid_container).each(function(){
      itemsToClean.push($(this).attr('file'));
    });

    $.ajax({
      url: 'cleaner.php',
      // type: 'default GET (Other values: POST)',
      // dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
      data: {items: itemsToClean},
    })
    .done(function(data) {
      console.log("success | data", data);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
      try{
        window.callPhantom(); 
      }catch(error){
        console.log('no phantom');
      }
    });
    
  };

  /**
  * ready
  */
  $(document).ready(function() {
    init();
  });


  /**
  * Grid()
  */
  function Grid($f, settings){
    
    var _defaults = {
          padding:{t:20,r:25,b:20,l:25},
          centered:false,
          gouttiere: 20,
          cell_w: 155,
          cell_h: 50,
          lines: 0,
          columns: 0,
          grille: false,
          decalage: false,
          latitude: 0,
          augmentable:false,
          fillfreecells:false,
          dispatch_mode:"linear"
        },
        $fiche = $f,
        _cells = new Array(),
        _positions = new Array(),
        _thisgrid = this,
        _prePlacedBlocks = 0,
        _placedBlocks = 0,
        _allBlocks = 0,
        _grilleInterval;
    

    this.fiche = $fiche;
    this.settings = $.extend({}, _defaults, settings);
    
    // console.log("this.settings", this.settings);

    this.settings.lines = Math.floor(($f.height() - this.settings.padding.t  - this.settings.padding.b) / (this.settings.cell_h + this.settings.gouttiere));
    
    var innerWidth = $f.width() - this.settings.padding.r  - this.settings.padding.l;
    this.settings.columns = 1; 
    var widthUtil;
    while(this.settings.columns == 1 || innerWidth > widthUtil + this.settings.cell_w + this.settings.gouttiere){
      this.settings.columns ++;
      widthUtil = this.settings.columns*(this.settings.cell_w+this.settings.gouttiere)-this.settings.gouttiere;
    }
    // this.settings.columns = Math.floor(($f.width() - this.settings.padding.r  - this.settings.padding.l) / (this.settings.cell_w + this.settings.gouttiere));

    this.maxheight = this.maxwidth = 0;

    // if(this.settings.centered){
    this.settings.side_marge = (innerWidth - widthUtil)/2;
    // }
    
    // console.log('w = '+$f.width()+' | h = '+$f.height());
    // console.log('lines = '+this.settings.lines+' | columns = '+this.settings.columns);

    if (this.settings.grille) {
      $fiche.prepend('<div class="grille"><div>');
      $('.grille', $fiche).css({
        'width': '100%',
        'height': '100%',
        'position': 'relative'
      });
    }
    
    for (var l = 0; l < this.settings.lines; l++) {
      _cells[l] = new Array();
      for (var c = 0; c < this.settings.columns; c++) {
        _cells[l][c] = new Cell(this, c, l);
      };
    };
    
    // console.log('_cells', _cells);

    _allBlocks = $('.grid-block', $fiche).length;
    if (this.settings.grille) {
      _grilleInterval = setInterval(function(){
        if(_prePlacedBlocks < _allBlocks){
          _placeBlock($('.grid-block', $fiche).eq(_prePlacedBlocks));
          _prePlacedBlocks ++;
        }else{
          clearInterval(_grilleInterval);
        }
      },500);
    }else{
      $('.grid-block', $fiche).each(function() {
        // _allBlocks++;    
        _placeBlock(this);
      });
      if(this.settings.fillfreecells)
        _fillFreeCells();
    }
    
    
    function _block_placed(){
      // console.log('_block_placed _allBlocks = '+_allBlocks+' _placedBlocks = '+_placedBlocks)
      _placedBlocks++;
      if(_placedBlocks == _allBlocks){
        var event = jQuery.Event('grid_ready');
        event.grid = _thisgrid;
        $fiche.trigger(event);
      }
    };
    
    /**
    *
    */
    function _placeBlock(_this){
      //console.log('_placeBlock', _this);

      var $this = $(_this),
          this_cells_w = 0,
          this_cells_h = 0,
          free_cells = [];

      // if($this.hasClass('image')){
      //  var sizes     = [155, 330, 505],
      //      i         = sizes.length,
      //      $img      = $('img', $this),
      //      $legende  = $('.legende', $this);
      // 
      //  while(free_cells.length == 0 && i > 0){
      //    i--;
      //    $img.width(sizes[i]);
      //    $this.width(sizes[i]+$legende.outerWidth()+2);
      //    this_cells_w = Math.ceil($this.width() / (_thisgrid.settings.cell_w + _thisgrid.settings.gouttiere)),
      //    this_cells_h = Math.ceil($this.height() / (_thisgrid.settings.cell_h + _thisgrid.settings.gouttiere));
      //    free_cells = getFreeCells(this_cells_w, this_cells_h);
      //  }
      // }else{
        this_cells_w = Math.ceil(($this.width() + _thisgrid.settings.gouttiere) / (_thisgrid.settings.cell_w + _thisgrid.settings.gouttiere)),
        this_cells_h = Math.ceil(($this.height() + _thisgrid.settings.gouttiere) / (_thisgrid.settings.cell_h + _thisgrid.settings.gouttiere));
        free_cells = getFreeCells(this_cells_w, this_cells_h);
      // }

      if(free_cells.length > 0){
        // choose the cell to place
        switch(_thisgrid.settings.dispatch_mode){
          case 'linear':
            // les une apres les autre en partant du haut
            var cell_num = 0;
            break;
          case 'linear random':
            // les unes après les autre avec un peu de random
            var cell_num = Math.round(Math.random()*4);
            break;
          case 'random':
            // random pure
            var cell_num = Math.round(Math.random() * (free_cells.length - 1));
            break;
          case 'radiant':
            // random en partant du centre
            var cell_num = Math.floor((free_cells.length-1)*0.5 + (-2+Math.random()*4));
            cell_num = cell_num > free_cells.length-1 ? free_cells.length-1 : ( cell_num < 0 ? 0 : cell_num );
            break;
        }
        
        // update the newly occupied and neihbourg cells status
        var cell = free_cells[cell_num];
        var line_limit_loop = cell.getPos().l + (this_cells_h);
        var column_limit_loop = cell.getPos().c + (this_cells_w);

        for (var l = cell.getPos().l; l < line_limit_loop; l++) {
            for (var c = cell.getPos().c; c < column_limit_loop; c++) {
                var temp_cell = _cells[l][c];
                temp_cell.setFull();
            };
        };

        // place the plock
        var top = cell.getPos().l * (_thisgrid.settings.cell_h + _thisgrid.settings.gouttiere);
        var left = cell.getPos().c * (_thisgrid.settings.cell_w + _thisgrid.settings.gouttiere) + (_thisgrid.settings.centered ? _thisgrid.settings.side_marge : 0);
        var latitude = _thisgrid.settings.latitude;

        top = !_thisgrid.settings.decalage ? top: top + Math.round(Math.random() * latitude - latitude / 2)
        left = !_thisgrid.settings.decalage ? left: left + Math.round(Math.random() * latitude - latitude / 2);

        $this.css({
            'top': top+_thisgrid.settings.padding.t,
            'left': left+_thisgrid.settings.padding.l
        });

        var grid_height = _thisgrid.fiche.height();
        if(grid_height < top + this_cells_h*_thisgrid.settings.cell_h +_thisgrid.settings.padding.t+150 )
          _thisgrid.fiche.height(top+this_cells_h*_thisgrid.settings.cell_h+_thisgrid.settings.padding.t+150);

        _thisgrid.maxheight = Math.max(top+_thisgrid.settings.padding.t+$this.height(), _thisgrid.maxheight);
        _thisgrid.maxwidth = Math.max(left+_thisgrid.settings.padding.l+$this.width(), _thisgrid.maxwidth);

        _block_placed();

      } else {
         
        if(!_thisgrid.settings.augmentable){
          $this
            .addClass('outside');
            // .css({
            //   'border': '2px solid red',
            //   'opacity': 0.2
            // });//.remove();
          _block_placed();
        }else{
          _augmenteGrid();
          //console.log('re placeblock');
          _placeBlock(_this);
        }

      }
    };
    
    function _fillFreeCells(){
      var cell, cell_col, cell_line;
      var top, left;
      var arround;
      var h, w;
      var $elmt
      var line_limit_loop, column_limit_loop;

      var free_cells = getAllEmptyCells();
      while(free_cells){
        cell = free_cells[0];
        cell_col = cell.getPos().c;
        cell_line = cell.getPos().l;
        top = _thisgrid.settings.padding.t + cell_line * (_thisgrid.settings.cell_h + _thisgrid.settings.gouttiere);
        left = _thisgrid.settings.padding.l + cell_col * (_thisgrid.settings.cell_w +  _thisgrid.settings.gouttiere) + (_thisgrid.settings.centered ? _thisgrid.settings.side_marge : 0);
        arround = cell.getAround();
        h = (arround.bottom+1)*_thisgrid.settings.cell_h;
        w = (arround.right+1)*(_thisgrid.settings.cell_w+_thisgrid.settings.gouttiere)-_thisgrid.settings.gouttiere;
        $elmt = $('<article>').css({
              width:w+"px",
              height:h+"px",
              top: top+"px",
              left:left+"px"
            })
          .addClass('empty-block grid-block');
          
        _$grid_container.append($elmt);

        line_limit_loop = cell_line + arround.bottom +1;
        column_limit_loop = cell_col + arround.right +1;
        for (var l = cell_line; l < line_limit_loop; l++) {
            for (var c = cell_col; c < column_limit_loop; c++) {
                var temp_cell = _cells[l][c];
                temp_cell.setFull();
            };
        };

        free_cells = getAllEmptyCells();
      }

      /* this algorythme simlpy fill all free cells with a block sized as one cell */
      // for (var i = 0 ; i <= free_cells.length - 1; i++) {
      //   var cell = free_cells[i]; 
      //   var top = _thisgrid.settings.padding.t + cell_line * (_thisgrid.settings.cell_h + _thisgrid.settings.gouttiere);
      //   var left = _thisgrid.settings.padding.l + cell_col * (_thisgrid.settings.cell_w +  _thisgrid.settings.gouttiere) + (_thisgrid.settings.centered ? _thisgrid.settings.side_marge : 0);
      //   var $elmt = $('<article>').css({
      //       width:_thisgrid.settings.cell_w+"px",
      //       height:_thisgrid.settings.cell_h+"px",
      //       top: top+"px",
      //       left:left+"px"
      //     })
      //   .addClass('empty-block grid-block');
        
      //   _$grid_container.append($elmt);
      // }
    };

    function _augmenteGrid(){

      // for (var l = 0; l < this.settings.lines; l++) {
        var l = _thisgrid.settings.lines ;
        _thisgrid.settings.lines ++;
        _cells[l] = new Array();
        for (var c = 0; c < _thisgrid.settings.columns; c++) {
          _cells[l][c] = new Cell(_thisgrid, c, l);
        };
      // };
      _refreshCells();

      // console.log('lines = '+_thisgrid.settings.lines+' | columns = '+_thisgrid.settings.columns);
    };
    
    function _refreshCells(){
      for (var l = _thisgrid.settings.lines-1; l >= 0 ; l--) {
        for (var c = _thisgrid.settings.columns-1; c >= 0 ; c--) {
          _cells[l][c].refresh();
        }
      }
    };

    /**
    * getFreeCells()
    */
    function getFreeCells(this_cells_w, this_cells_h){
      var free_cells = new Array();
      for (var l = 0; l < _thisgrid.settings.lines; l++) {
        for (var c = 0; c < _thisgrid.settings.columns; c++) {
          var cell = _cells[l][c];
          if (cell.isFree() && (cell.getAround().right + 1) >= this_cells_w && (cell.getAround().bottom + 1) >= this_cells_h) {
            var good = true;
            for (var i = 1; i < this_cells_w; i++) {
              var temp_cell = _cells[l][c + i];
              if ((temp_cell.getAround().bottom + 1) < this_cells_h) {
                good = false;
                break;
              }
            };
            if (good) free_cells.push(cell);
          }
        };
      };
              
      return free_cells;
    };
    
    function getAllEmptyCells(){
      var free_cells = new Array();
      var thereisFreeCells = false;
      for (var l = 0; l < _thisgrid.settings.lines; l++) {
        for (var c = 0; c < _thisgrid.settings.columns; c++) {
          var cell = _cells[l][c];
          if (cell.isFree()) {
            free_cells.push(cell);
            thereisFreeCells = true;
          }
        };
      };
      
      if(thereisFreeCells){
        return free_cells;
      }else{
        return false;
      }
    };
    /**
    * Cell()
    */
    function Cell(g, c, l) {
      var _g = g,
          _column = c,
          _line = l,
          _free = true,
          _free_cell_right = _g.settings.columns - 1 - c,
          _free_cell_bottom = _g.settings.lines - 1 - l;

      if (_g.settings.grille) {
          var _table = '<table>';
          _table += '<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>';
          // _table += '<tr><td>&nbsp;</td><td class="state">'+_free+'</td><td class="fr">'+_free_cell_right+'</td></tr>';
          _table += '<tr><td>&nbsp;</td><td>&nbsp;</td><td class="fr">' + _free_cell_right + '</td></tr>';
          _table += '<tr><td>&nbsp;</td><td class="fb">' + _free_cell_bottom + '</td><td>&nbsp;</td></tr>';
          _table += '</table>';
          _g.fiche.find('.grille').append('<div class="cell-' + l + '-' + c + '">' + _table + '<div>');
          var _dom = $('.cell-' + l + '-' + c, _g.fiche.find('.grille'));
          _dom.css({
              'position': 'absolute',
              'top': _line * (_g.settings.cell_h + _g.settings.gouttiere) + _g.settings.padding.t,
              'left': _column * (_g.settings.cell_w + _g.settings.gouttiere) + _g.settings.padding.l,
              'width': _g.settings.cell_w,
              'height': _g.settings.cell_h,
              'backgroundColor': '#00FF00',
              'opacity': 0.6
          }).find('table').css({
            width:'100%',
            height:'100%'
          }).find('td').css({width:"30%"});
          // $('td', _dom).css({
          //     'fontSize': '8px'
          // });
      }

      this.isFree = function() {
          return _free;
      };

      this.getPos = function() {
          return {
              c: _column,
              l: _line
          };
      };

      this.getAround = function() {
          return {
              right: _free_cell_right,
              bottom: _free_cell_bottom
          };
      };

      this.setFull = function() {

          _free = false;
          _free_cell_bottom = -1;
          _free_cell_right = -1;

          if (_g.settings.grille) {
              _dom.css({
                  'backgroundColor': '#0000FF'
              });
              $('.fb', _dom).html(_free_cell_bottom);
              $('.fr', _dom).html(_free_cell_right);
          }

          _propageFreeCells();
      };

      this.setFreeCellsRight = function(right) {
          if (_free) {
              // console.log('_setFreeCellRigth | _free_cell_right = ' + _free_cell_right + ' | new right = ' + right);
              _free_cell_right = right;
              if (_g.settings.grille) $('.fr', _dom).html(_free_cell_right);
              _propageFreeCellsLeft();
          }
      };

      this.setFreeCellsBottom = function(bottom) {
          if (_free) {
              // console.log('_setFreeCellsBottom | _free_cell_bottom = ' + _free_cell_bottom + ' | new right = ' + bottom);
              _free_cell_bottom = bottom;
              if (_g.settings.grille) $('.fb', _dom).html(_free_cell_bottom);
              _propageFreeCellsTop();
          }
      };

      this.refresh = function(){
        if(_free)
          _propageFreeCellsTop();
      };

      function _propageFreeCells() {
          // console.log('_propageFreeCells');
          _propageFreeCellsLeft();
          _propageFreeCellsTop();
      };

      function _propageFreeCellsLeft() {
          // console.log('_propageFreeCellsLeft | _column = '+_column);
          if (_column > 0) {
              var left_cel = _cells[_line][_column - 1];
              left_cel.setFreeCellsRight(_free_cell_right + 1);
          }
      };

      function _propageFreeCellsTop() {
          // console.log('_propageFreeCellsTop | _line = '+_line);
          if (_line > 0) {
              var top_cel = _cells[_line - 1][_column];
              top_cel.setFreeCellsBottom(_free_cell_bottom + 1);
          }
      };

      if (typeof Cell.initialized == "undefined") {
          Cell.prototype.infos = function() {
              //console.log('cell | column = ' + this.getPos().c + ', line = ' + this.getPos().l + ', free = ' + this.isFree() + ', free cell right = ' + this.getAround().right + ', free cell bottom = ' + this.getAround().bottom);
          };

          Cell.initialized = true;
      }
    }; // cell()
    
    this.clear = function(){
      $('.grille', $fiche).fadeOut(200, function() {
        $(this).remove();
      });
    };
  }; // GRIB


})(jQuery);