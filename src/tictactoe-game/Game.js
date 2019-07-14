import React from 'react'
import '../tictactoe-game/Game.css';
function Square(props) {
    return (
      <button className={"square " + props.highlighted} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return <Square highlighted={this.props.highlightedSquares[i]} onClick={() => this.props.onClick(i)} value={this.props.squares[i]}/>;
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history : [{squares : new Array(9).fill(null)}],
        xIsNext : true,
        stepNumber: 0,
        highlightedSquares : new Array(9).fill("")
      };
    }
    jumpTo(e,step){
          let allListItemButtons = document.querySelectorAll('.listItem button');
          for(let listItemButton of allListItemButtons){
            listItemButton.classList.remove('bold');
          }
          let currentListItemButton = e.target;
          currentListItemButton.classList.add('bold');
          this.setState({stepNumber : step, xIsNext : step%2 === 0, highlightedSquares : new Array(9).fill("")})
    }
    getLocation(step){
      const history = this.state.history;
      const current = history[step];
      const previous = history[step-1];
      const location = []
      current.squares.forEach((el,i)=>{
              if(current.squares[i] !== previous.squares[i]){
                  if(i == 0 || i == 1 || i == 2){
                      location.push(1,i+1)
                  }else if(i == 3 || i == 4 || i == 5){
                      location.push(2,i+1)
                  }
                  else{
                      location.push(3,i+1)
                  }
              }                
      })
      return location;
    }
    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const highlightedSquares = this.state.highlightedSquares;
      if(calculateWinner(squares) || squares[i]){
        return;
      }else{
        this.state.xIsNext ? squares[i] = 'X' : squares[i] = 'O';
        let winningLine = getWinningLine(squares)
        if(winningLine.length > 0){
          winningLine.forEach(line=>highlightedSquares[line]="winner")
        }
        this.setState({history: history.concat({squares : squares}), 
                       xIsNext : !this.state.xIsNext, 
                       stepNumber : history.length,highlightedSquares : highlightedSquares});
      }
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const squares = current.squares;
      const winner = calculateWinner(squares);
      const highlightedSquares = this.state.highlightedSquares
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move  + ' You played at location ' + this.getLocation(move):
          'Go to game start';
        return (
          <li className="listItem">
            <button onClick={(e) => this.jumpTo(e,move)}>{desc}</button>
          </li>
        );
      });
      let status;
      if (winner) {
        let winningLine = getWinningLine(squares);
        status = 'Winner: ' + winner;
      }
      else if(winner === null && this.state.stepNumber == 9){
        status = `Its a Draw`;
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <div className="game">
          <div className="game-board">
            <Board highlightedSquares={highlightedSquares} squares={squares}
              onClick={(i) => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  function getWinningLine(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    return [];
  }
  // ========================================
  
export default Game;
  // Display the location for each move in the format (col, row) in the move history list. DONE
  // Bold the currently selected item in the move list.
  // Rewrite Board to use two loops to make the squares instead of hardcoding them.
  // Add a toggle button that lets you sort the moves in either ascending or descending order.
  // When someone wins, highlight the three squares that caused the win.
  // When no one wins, display a message about the result being a draw.  DONE