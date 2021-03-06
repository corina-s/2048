import React from 'react';
import * as Puzzle from '../2048';

import Board from './board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        const board = new Puzzle.Board();
       
        this.state = {
            board: board,
            lost: false,
            won: false,
            score: 0,
            bestScore: 0
        };

        this.restartGame = this.restartGame.bind(this);
        this.saveGame = this.saveGame.bind(this);

        this.handleLeft = this.handleLeft.bind(this);
        this.handleUp = this.handleUp.bind(this);
        this.handleRight = this.handleRight.bind(this);
        this.handleDown = this.handleDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress); 
        const best = localStorage.getItem('bestScore') || 0;
        this.setState({ score: localStorage.getItem('lastScore'), bestScore: best});

    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleLeft() {
   
        this.state.board.moveLeft(this.state.board);
        this.updateGame(this.state.board);
    }
    handleUp() {
  
        this.state.board.moveUp(this.state.board)
        this.updateGame(this.state.board);
    }
    handleRight() {
        
        this.state.board.moveRight(this.state.board)
        this.updateGame(this.state.board);
    }
    handleDown() {
      
        this.state.board.moveDown(this.state.board)
        this.updateGame(this.state.board);
    }
    handleKeyPress(event) {
        var map = {
            38: 0, // Up
            39: 1, // Right
            40: 2, // Down
            37: 3, // Left
            75: 0, // Vim up
            76: 1, // Vim right
            74: 2, // Vim down
            72: 3, // Vim left
            87: 0, // W
            68: 1, // D
            83: 2, // S
            65: 3  // A
        };
        if (map[event.keyCode] === 3) {
            event.preventDefault();
            this.handleLeft();
        } else if (map[event.keyCode] === 1) {
            event.preventDefault();
            this.handleRight();
        } else if (map[event.keyCode] === 0) {
            event.preventDefault();
            this.handleUp();
        } else if (map[event.keyCode] === 2) {
            event.preventDefault();
            this.handleDown();
        }
    }

    restartGame() {
        localStorage.removeItem('lastGame');
        const board = new Puzzle.Board();
        this.setState({ board: board, score: 0, bestScore:localStorage.getItem('bestScore') });
    }

    updateGame(newBoard) {
        // check if lost
        if (newBoard.lost(newBoard.grid)){
            this.setState({ lost: true });
            // update bestScore
            if (this.state.score > this.state.bestScore){
                localStorage.setItem('bestScore', this.state.score);
            }
            // reset the score
            this.setState({ score: 0 });
            // erase lastGame
            localStorage.removeItem('lastGame');
            // need to return
            return;
        // check if won
        } else if (newBoard.won(newBoard.grid)){
            this.setState({ won: true });
        }
        // every time
        this.setState({ board: newBoard, score: newBoard.score });
        this.saveGame(this.state.board, this.state.score);
       
    }
    saveGame(board, score){
        const currBoard = JSON.stringify(this.state.board, (key, value) => {
            if (key == 'board') {
                return null;
            } else {
                return value;
            };
        });
        localStorage.setItem('lastGame', currBoard);
        localStorage.setItem('lastScore', score);
    }
    message(){
        if (this.state.lost) {
            return (<p>You Lost!</p>)
        }
        if (this.state.won){
            return (<p>YOU WON !!!</p>)
        }
    }
   
    render() {
        // console.log("ls", JSON.parse(localStorage.getItem('lastGame')))
        // const currBoard =  || this.state.board;
        return (
            <div>
                <div className="header">
                    <h1 className="title"> 2048</h1>
                </div>
                <div className="game-container">
                    <div className="heading">
                        <div className="left-container">
                            <button onClick={this.restartGame}>Play Again</button>
                        </div>
                        <div className="right-container">
                            <div className="bestscore">Best Score: {this.state.bestScore}</div>
                            <div className="score">Score: {this.state.score}</div>
                        </div>
                    </div >
                        <div className="message">{this.message()}</div>
                        <Board board={this.state.board}  />
                        <p className="game-explanation">
                            How to play: Use your arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!
                        </p>
                </div>
                <div className="footer">
                    <div>&copy; 2020 Corina Schambacher</div>

                    <div id="footer-link"><a href="https://github.com/corina-s/2048">gitHub</a></div>

                    <div> Based on the open source project 2048 by Gabriele Cirulli.</div>
                </div>
            </div>
        )
    }

}

export default Game;