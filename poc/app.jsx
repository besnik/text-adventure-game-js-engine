import React from 'react'
import ReactDOM from 'react-dom'
import {Editor} from './engine/engine'
import {gameJson} from './engine/game_data'
console.log(gameJson)
class App extends React.Component {
  constructor(props) {
    super(props)
    this.game = new Editor(gameJson).from_json().start_game()
    this.state = {
      action: ''
    }
  }
  // static game = Editor()
  updateAction = (e) => {
    this.setState({action: e.target.value})
  }

  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('do validate', this.game.interact(this.state.action));
    }
  }

  render () {
    console.log(this.game)
    return (
      <div>
          <h1>Text Adventure Game</h1>
          <p>{this.state.story}</p>
          <input onChange={this.updateAction} value={this.state.action} onKeyPress={this._handleKeyPress}/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))