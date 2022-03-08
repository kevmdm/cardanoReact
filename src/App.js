import React from 'react';
import './App.css';
import logo from './logo.svg';
import * as wasm from "https://cdn.jsdelivr.net/npm/@emurgo/cardano-serialization-lib-asmjs@10.0.4/cardano_serialization_lib.js";
import BlockFrostRequest from './blockFrostRequest.js';

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
class App extends (React.Component,BlockFrostRequest) {

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
    this.fetchBlockfrostUnits(this.fetchInit);
    this.fetchWalletUtxo(this.fetchInit);
  }


  async getAdaValue(api) {

    const getBalance = await api.getBalance();
    console.log(getBalance + "raw");
    const balance = wasm.Value.from_bytes(hexToBytes(getBalance));
    console.log(balance);
    const lovelaces = balance.coin().to_str();
    const adaValue = lovelaces / 1000000;
    console.log(adaValue + ' Adas');
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
  }

  async getData(api) {

    let address = await this.getAdress(api);
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
