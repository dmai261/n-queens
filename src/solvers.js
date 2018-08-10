/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other


//time complexity = O(n^2);
window.findNRooksSolution = function(n) {
  var solution = undefined;
  var fakeBoard = new Board({'n': n});
  var findSolution = function(rowIndex, colIndex) {
    fakeBoard.togglePiece(rowIndex, colIndex);
    if (fakeBoard.hasAnyRooksConflicts()) {
      fakeBoard.togglePiece(rowIndex, colIndex);
      findSolution(rowIndex, colIndex + 1);
    } else {
      if (rowIndex + 1 < fakeBoard.rows().length) {
        findSolution(rowIndex + 1, colIndex);
      }
    }
    solution = fakeBoard.rows();
  };
  
  findSolution(0, 0);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};


//time complexity = O(c^N);
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var fakeBoard = new Board({'n': n});
  var findSolution = function(rowIndex) {
    if (rowIndex === n) {
      solutionCount++;
      return;
    }
    
    fakeBoard.get(0).forEach(function(element, i) {
      fakeBoard.tsogglePiece(rowIndex, i);
      if (!fakeBoard.hasAnyRooksConflicts()) {
        findSolution(rowIndex+1, i);
      }
      fakeBoard.togglePiece(rowIndex, i);
    });
  };
  
  findSolution(0);
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

//time complexity = O(c^N);
window.findNQueensSolution = function(n) {
  var solution;
  var fakeBoard = new Board({'n': n});

  if (n === 0) {
    solution = [];
  }
  
  if (n === 1) {
    return [[1]];
  }
  
  if (n === 2) {
    solution = [[0, 0], [0, 0]];
  }
  
  if (n === 3) {
    return solution = fakeBoard.rows();
  }
  var findSolution = function(rowIndex) {
    if (rowIndex === n) {
      solution = JSON.parse(JSON.stringify(fakeBoard.rows()));
      return;
    }
      
    for (var i = 0; i < n; i++) {
      fakeBoard.togglePiece(rowIndex, i);
      if (!fakeBoard.hasAnyQueensConflicts()) {
        findSolution(rowIndex + 1);
      }
      fakeBoard.togglePiece(rowIndex, i);
    }
  };
  
  findSolution(0);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

//time complexity O(c^N);
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var fakeBoard = new Board({'n': n});
  var findSolution = function(rowIndex) {
    if (rowIndex === n) {
      solutionCount++;
      return;
    }
    
    fakeBoard.get(0).forEach(function(element, i) {
      fakeBoard.togglePiece(rowIndex, i);
      if (!fakeBoard.hasAnyQueensConflicts()) {
        findSolution(rowIndex+1, i);
      }
      fakeBoard.togglePiece(rowIndex, i);
    });
  };
  
  findSolution(0);
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};