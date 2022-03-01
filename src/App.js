import logo from './logo.svg';
import './App.css';
import * as wasm from "https://cdn.jsdelivr.net/npm/@emurgo/cardano-serialization-lib-asmjs@10.0.4/cardano_serialization_lib.js";
import React from 'react';

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

class UserInfo extends React.Component {

  render() {
    return (
      <div>
        <h1>Hola</h1>
        <h3>{this.props.value}</h3>
      </div>
    )
  }
}
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      api: null, 
      adaValue: null,
     };
  }

  async apiStart() {
    let api = await window.cardano.nami.enable();
    // this.setState({
    //   api: api
    // });
    this.getAdaValue(api);
  }
  async getAdaValue(api) {
    //const api = this.state.value;
    
    const getBalance = await api.getBalance();
    const balance = wasm.Value.from_bytes(hexToBytes(getBalance));
    const lovelaces = balance.coin().to_str();
    const adaValue = lovelaces / 1000000;
    console.log(adaValue + ' Adas');
    
    this.setState({
      api: api,
      adaValue: adaValue,
    });
  }

  render() {

    return (

      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>

          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
          <body>
            <UserInfo value={this.state.adaValue} />
            <button onClick={() => this.apiStart()}>Conectar</button>
          </body>
        </header>
      </div>
    );
  }
};
export default App;
