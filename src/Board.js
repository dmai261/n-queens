// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({
    //time complexity: best case: O(1), worst case O(n); 
    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },
    
    //time complexity: O(n);
    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },
    
    //time complexity: O(1);
    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },
    
    //time complexity: O(1);
    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },
    
    //time complexity: O(1);
    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },
    
    //time complexity: O(n);
    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },
    
    //time complexity: O(n);
    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },
    //time complexity: O(n);
    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },
    
    //time complexity: O(1);
    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

  */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    
    //time complexity: O(n^2);
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      const currentRow = this.get(rowIndex);
      for (let i = 0; i < currentRow.length; i++) {
        if (currentRow[i] === 1) {
          for (let j = i + 1; j < currentRow.length; j++) {
            if (currentRow[j] === 1) {
              return true;
            }
          }
        }
      }
      return false;
    },
    
    //time complexity: O(n^2);
    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      const rows = this.rows();
      for (let i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }    
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    //time complexity: O(n);
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      const cache = [];
      const rows = this.rows();
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][colIndex] === 1) {
          cache.push(1);
        }
      }
      if (cache.length > 1) {
        return true;
      }
      return false;
    },
    
    //time complexity: O(n);
    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      const rows = this.rows();
      if (rows.length) {
        for (let i = 0; i < rows[0].length; i++) {
          if (this.hasColConflictAt(i)) {
            return true;
          }
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    //time complexity: O(n);
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(indexInFirstRow) {
      var rows = this.rows();
      var cache = [];
      var newColIndex = indexInFirstRow;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][newColIndex] && rows[i][newColIndex] === 1) {
          cache.push(1);
        }
        newColIndex++;
      }
      if (cache.length > 1) {
        return true;
      }
      return false;
    },
    
    //time complexity: O(n^2)
    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rows = this.rows();
      for (let i = 0; i < rows.length; i++) {
        var currentRow = rows[i];
        for (let j = 0; j < currentRow.length; j++) {
          if (currentRow[j] === 1) {
            if (this.hasMajorDiagonalConflictAt(j - i)) {
              return true;
            }
          }
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    
    //time complexity: O(n)
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(indexInFirstRow) {
      var rows = this.rows();
      var cache = [];
      var newColIndex = indexInFirstRow;
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][newColIndex] && rows[i][newColIndex] === 1) {
          cache.push(1);
        }
        newColIndex--;
      }
      if (cache.length > 1) {
        return true;
      }
      return false;
    },

    //time complexity: O(n^2);
    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var rows = this.rows();
      for (let i = 0; i < rows.length; i++) {
        var currentRow = rows[i];
        for (let j = 0; j < currentRow.length; j++) {
          if (currentRow[j] === 1) {
            if (this.hasMinorDiagonalConflictAt(j + i)) {
              return true;
            }
          }
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });
  
  
  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
