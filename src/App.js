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
        <p>Mi wallet:</p>
        <text>{this.props.address}</text>
        <h3>Tienes un saldo de: {this.props.value} ADAS </h3>
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
      address: null,
    };
  }

  async apiStart() {
    let api = await window.cardano.nami.enable();
    this.getData(api);
    // this.getAdaValue(api);
    // this.getAdress(api);
  }

  async getAdaValue(api) {
    //const api = this.state.value;

    const getBalance = await api.getBalance();
    const balance = wasm.Value.from_bytes(hexToBytes(getBalance));
    const lovelaces = balance.coin().to_str();
    const adaValue = lovelaces / 1000000;
    console.log(adaValue + ' Adas');

    // this.setState({
    //   api: api,
    //   adaValue: adaValue,
    // });
    return adaValue;
  }

  async getAdress(api) {

    const cborAdress = (await api.getUsedAddresses())[0];
    console.log(cborAdress);
    const decodeAdress = wasm.Address.from_bytes(hexToBytes(cborAdress));
    console.log(decodeAdress);
    const address = decodeAdress.to_bech32();
    console.log(address);

    return (address);

    // this.setState({
    //   api: api,
    //   adaValue: null,
    //   adress: address,
    // });
  }

  async getData(api) {
  
    let address  = await this.getAdress(api);
    let adaValue = await this.getAdaValue(api);
    this.setState({
      api: api,
      adaValue: adaValue,
      address: address,
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
          <UserInfo
            value={this.state.adaValue}
            address={this.state.address}
          />
          <button onClick={() => this.apiStart()}>Conectar</button>
        </header>
      </div>
    );
  }
};
export default App;
