if (process.env.BROWSER) {
  require('../sass/style.scss');
}

import React, { Component } from 'react';
import Modal from './modal';
import Footer from './footer';
import Box from './box';

import { findMoves, minimax, isWinner } from '../utility/functions';

export default class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {
      size: window.innerHeight,
      user: undefined,
      computer: undefined,
      game: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      result: 'None',
    };
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillMount() {
    this.adjustSize();
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.adjustSize();
    });
  }
  /**
   * Called when the user clicks on an empty box, set this box as
   * the user's label and then let the computer take a turn
   * @param  {any} id
   */
  onSelect(id) {
    const { game } = this.state;
    const xy = id.replace('box', '');
    const x = parseInt(xy[0], 10);
    const y = parseInt(xy[1], 10);

    // check to make sure box isn't filled in already
    if (game[x][y] === '') {
      game[x][y] = this.state.user;
      this.setState({ game });
      this.makeMove();
    }
  }

  /**
   * Set the user as X or O, and set the computer as the opposite. Then
   * let the computer make the first move.
   * @param  {string} user
   */
  setUser(user) {
    const computer = user === 'X' ? 'O' : 'X';
    const game = this.state.game;
    const x = Math.floor(Math.random() * 2);
    const y = Math.floor(Math.random() * 2);
    game[x][y] = computer;
    this.setState({ user, computer, game });
  }

  adjustSize() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    const smallest = height < width ? height : width;
    this.setState({ size: (smallest * 0.6) / 3 });
  }

  makeMove() {
    const { game, computer } = this.state;
    const moves = findMoves(game);
    console.log(moves);
    const miniMaxVals = moves.map(move => {
      const possibleGame = JSON.parse(JSON.stringify(game));
      possibleGame[move[0]][move[1]] = computer;
      return minimax(possibleGame, computer, computer, 0);
    });
    console.log(miniMaxVals);
    let max = -1000;
    let move;
    for (let i = 0; i < miniMaxVals.length; i++) {
      if (miniMaxVals[i] > max) {
        move = moves[i];
        max = miniMaxVals[i];
      }
    }
    game[move[0]][move[1]] = computer;
    if (max === 10) {      
      this.setState({ game, result: 'YOU LOSE' });
    } else {      
      this.setState({ game });
    }
    
  }

  render() {
    const { game, size, user, labels, result } = this.state;
    const modal = (
      <Modal choice={(input) => this.setUser(input)} text={'Choose which player you want to be:'} />
    );
    const props = { size, labels, select: this.onSelect };

    return (
      <div>
        {!user ? modal : ''}
        <div id="app-container" style={!user ? { opacity: '0.3', width: size * 3 } : { width: size * 3 }} >
          {result}
          <div className="box-row">
            <Box id="box00" val={game[0][0]} {...props} />
            <Box id="box01" val={game[0][1]} {...props} />
            <Box id="box02" val={game[0][2]} {...props} />
          </div>
          <div className="box-row">
            <Box id="box10" val={game[1][0]} {...props} />
            <Box id="box11" val={game[1][1]} {...props} />
            <Box id="box12" val={game[1][2]} {...props} />
          </div>
          <div className="box-row">
            <Box id="box20" val={game[2][0]} {...props} />
            <Box id="box21" val={game[2][1]} {...props} />
            <Box id="box22" val={game[2][2]} {...props} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
