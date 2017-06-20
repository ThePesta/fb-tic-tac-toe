import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
  return (
    <button className={"square" + props.winner} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i, win) {
    return (<Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            winner={win}
          />
        );
  }

  render() {
    let squares = [];
    let row = [];
    let num = 0;
    let win = '';

    for(let x=0; x<=2; x+=1) {
        row = [];
        for (let y = 0; y <=2; y+=1) {
          if (this.props.squares.winningSquares) {
            win = this.props.squares.winningSquares.indexOf(num) != -1 ? ' win-square' : '';
          }
            row.push(this.renderSquare(num, win));
            num += 1;
        }
        squares.push(<div key={num} className="board-row">{row}</div>);
    }

    return (
      <div>{squares}</div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrder: true,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        clicked: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  translateLocation(location) {
    switch(location) {
      case 0:
        return '(0,0)';
      case 1:
        return '(1,0)';
      case 2:
        return '(2,0)';
      case 3:
        return '(0,1)';
      case 4:
        return '(1,1)';
      case 5:
        return '(2,1)';
      case 6:
        return '(0,2)';
      case 7:
        return '(1,2)';
      case 8:
        return '(2,2)';
    }
  }

  toggleOrder() {
    this.setState({
      ascendingOrder: !this.state.ascendingOrder
    });
  }

  render() {
     const history = this.state.history;
     const current = history[this.state.stepNumber];
     const winner = calculateWinner(current.squares);

     const moves = history.map((step, move) => {
      let bold = (move === this.state.stepNumber ? 'bold' : '');
      const clicked = history[move].clicked;
      const desc = move ? 'Move location ' + this.translateLocation(clicked) : 'Game start';
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)} className={bold}>{desc}</a>
        </li>
      );
    });

     let status;
     if (winner) {
       status = 'Winner: ' + winner[0];
       current.squares.winningSquares = winner[1];
     } else {
       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
     }

     if (!this.state.ascendingOrder) {
     		moves.sort(function(a,b) {
      			return b.key - a.key;
      		});
     	}

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.toggleOrder()}>Change order</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return [squares[a], lines[i]];
    }
  }
  return null;
}
