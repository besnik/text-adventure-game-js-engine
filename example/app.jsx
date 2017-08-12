"use strict"
import React from 'react'
import ReactDOM from 'react-dom'
import GameEngine from 'text-adventure-game'
import {gameJson} from './data/game_data'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.game = new GameEngine(gameJson).from_json().start_game()
    this.state = {
      action: '',
      error: '',
      location: {texts: {}, state: ''}
    }
  }

  componentDidMount() {
    const location = this.game.location()
    this.setState({location })
  }

  updateAction = (e) => {
    this.setState({action: e.target.value})
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const location = this.game.interact(this.state.action)
      console.log(location.state)
      if (location.state == 'non-response') {
        console.log(location.state)
        this.setState({error: location.texts['non-response']})
      } else {
        this.setState({location, error: ''})
      }
      
    }
  }

  render () {
    return (
      <div>
          <h1>Text Adventure Game</h1>
          <p>{this.state.location.texts['default']}</p>
          <p>{this.state.error}</p>
          <input onChange={this.updateAction} value={this.state.action} onKeyPress={this._handleKeyPress}/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))