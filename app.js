var app = angular.module('app', []);

app.controller('TTTController', ['$scope',
    function ($scope) {


        $scope.N = 3; //N x N board
        $scope.playerX = 'x';
        $scope.playerO = 'o';
        $scope.currentPlayer = $scope.playerX;
        $scope.HORIZ = 'horiz';
        $scope.VERT = 'vert';
        $scope.DIAG = 'diag';
        $scope.ANTI_DIAG = 'anti';
        $scope.gameover = false;
        $scope.previousWinner = $scope.currentPlayer;
        $scope.draw = false;


        // x o x
        // x x o
        // x o _

        var Cell = function (token, x, y) {
            this.token = token;
            this.x = x;
            this.y = y;
            this.winner = false;
        }
        $scope.board = [[new Cell('x', 0, 0), new Cell('', 0, 1), new Cell('x', 0, 2)], [new Cell('x', 1, 0), new Cell('x', 1, 1), new Cell('o', 1, 2)], [new Cell('x', 2, 0), new Cell('o', 2, 1), new Cell('x', 2, 2)]];

        //reset
        $scope.setup = function () {
            $scope.gameover = false;
            $scope.draw = false;
            $scope.currentPlayer = $scope.previousWinner;
            $scope.win = {};
            $scope.board = new Array($scope.N);
            for (var i = 0; i < $scope.N; i++) {
                $scope.board[i] = new Array($scope.N);
                for (var j = 0; j < $scope.N; j++) {
                    $scope.board[i][j] = new Cell('', i, j);
                }
            }
        };

        // Diagnoal: /  col == N-1-row
        // only check diagonal if center (odd) or middle 2 (even) have matches
        var shouldCheckDiagonal = function (board, player, N) {
            var result = false;
            var mid = Math.floor(N / 2);
            if (N % 2 == 0) { //even check 2 positions
                if (board[mid - 1][mid].token == player && board[mid][mid - 1].token == player) {
                    result = true;
                }
            } else if (board[mid][mid].token == player) { //odd check middle
                result = true;
            }
            return result;
        };

        // Anti diagnoal: \ col==row
        // only check diagonal if center (odd) or middle 2 (even) have matches
        var shouldCheckAntiDiagonal = function (board, player, N) {
            var result = false;
            var mid = Math.floor(N / 2);
            if (N % 2 == 0) { //even check 2 positions
                if (board[mid - 1][mid - 1].token == player && board[mid][mid].token == player) {
                    result = true;
                }
            } else if (board[mid][mid].token == player) { //odd check middle
                result = true;
            }


            return result;

        }
        var checkSingleHoriz = function (player, x, board, N) {
            var win = true;
            for (var col = 0; col < N; col++) {
                if (board[x][col].token != player) {
                    win = false;
                    break;
                }
            }
            return win;
        };


        var checkSingleVert = function (player, y, board, N) {
            var win = true;
            for (var row = 0; row < N; row++) {
                if (board[row][y].token != player) {
                    win = false;
                    break;
                }
            }
            return win;
        }
        var checkDiag = function (player, board, N) {
            var win = true;
            for (var i = 0; i < N; i++) {
                if (board[i][N - 1 - i].token != player) {
                    win = false;
                    break;
                }
            }
            return win;
        }
        var checkAnti = function (player, board, N) {
            var win = true;
            for (var i = 0; i < N; i++) {
                if (board[i][i].token != player) {
                    win = false;
                    break;
                }
            }
            return win;
        }

        var move = function (player, x, y, board) {
            var win = {};
            $scope.board[x][y] = new Cell(player, x, y);


            win[$scope.HORIZ] = checkSingleHoriz(player, x, $scope.board, $scope.N);
            win[$scope.VERT] = checkSingleVert(player, y, $scope.board, $scope.N);


            if (shouldCheckDiagonal($scope.board, player, $scope.N)) {
                win[$scope.DIAG] = checkDiag(player, $scope.board, $scope.N);
            } else {
                win[$scope.DIAG] = false;
            }

            if (shouldCheckAntiDiagonal($scope.board, player, $scope.N)) {
                win[$scope.ANTI_DIAG] = checkAnti(player, $scope.board, $scope.N);
            } else {
                win[$scope.ANTI_DIAG] = false;
            }
            return win;
        };

        var markWinner = function (direction, x, y, N) {
            if (direction === $scope.HORIZ) {
                for (var col = 0; col < N; col++) {
                    $scope.board[x][col].winner = true;
                }
            } else if (direction === $scope.VERT) {
                for (var row = 0; row < N; row++) {
                    $scope.board[row][y].winner = true;
                }
            } else if (direction === $scope.DIAG) {
                for (var i = 0; i < N; i++) {
                    $scope.board[i][N - 1 - i].winner = true;
                }
            } else if (direction === $scope.ANTI_DIAG) {
                for (var i = 0; i < N; i++) {
                    if ($scope.board[i][i].winner = true);
                }
            }
        }
        var checkForFull = function (board) {
            var full = true;
            for (var i = 0; i < board.length; i++) {
                for (var j = 0; j < board.length; j++) {
                    if (board[i][j].token === '') {
                        full = false;
                        break;
                    }
                }
                if (full === false) {
                    break;
                }
            }
            return full;
        }

        $scope.move = function (cell) {
            if (!$scope.gameover) {
                if (cell.token != '') {
                    return;
                }
                var winOnMove = move($scope.currentPlayer, cell.x, cell.y, $scope.board);

                for (var w in winOnMove) {
                    if (winOnMove[w] === true) {
                        $scope.gameover = true;
                        markWinner(w, cell.x, cell.y, $scope.N);
                    }
                    console.log(w + " -> " + winOnMove[w]);
                }
                if (!$scope.gameover) {
                    if (checkForFull($scope.board)) {
                        $scope.draw = true;
                    } else {
                        $scope.currentPlayer = ($scope.currentPlayer === $scope.playerX) ? $scope.playerO : $scope.playerX;
                    }
                } else {
                    $scope.previousWinner = $scope.currentPlayer;
                }
            }
        }
        $scope.setup();
            }]);