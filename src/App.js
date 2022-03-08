import React from 'react';
import './App.css';
import logo from './logo.svg';
import * as wasm from "https://cdn.jsdelivr.net/npm/@emurgo/cardano-serialization-lib-asmjs@10.0.4/cardano_serialization_lib.js";

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

const pageWallet = 'addr_test1wrsm2a8hl809ran3paw999vct5mgcwtzajkntzs8thqkses8gfqln';
const aleWallet = 'addr_test1qrc6fdexcnkmt9xau0e7yv9yaxyscd06klcme4nvj9c8d2gw9vs4u5282ymd67uf666yd6qldlmhn703qgt6lxcwk0qs7mps3y'
const key = process.env.REACT_APP_API_KEY;

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
    this.fetchBlockfrost();

  }

  async fetchBlockfrost() {

    var fetchInit = {
      method: 'GET',
      headers: {
        project_id: key
      }
    }
    //funciona 
    // fetch('https://cardano-testnet.blockfrost.io/api/v0/addresses/'+ pageWallet , fetchInit)
    //   .then((res) => res.json())
    //   .then((json) => {
    //     console.log(json.amount[1].unit)
    //   });
    //nuevo codigo 
    // este funciona mejor tengo acceso a las variables
    let jsonRes = await (await (fetch('https://cardano-testnet.blockfrost.io/api/v0/addresses/' + aleWallet, fetchInit))).json();
    //console.log('imprimiendo jsonRes')
    //console.log(jsonRes);
    let unit = jsonRes.amount[2].unit;
    console.log(unit);
    let unitMetadataJson = await (await (fetch('https://cardano-testnet.blockfrost.io/api/v0/assets/' + unit, fetchInit))).json();
    console.log(unitMetadataJson);

    let walletUtxo = await (await (fetch('https://cardano-testnet.blockfrost.io/api/v0/addresses/'+pageWallet+'/utxos', fetchInit))).json();
    console.log('imprimiendo utxo');
    console.log(walletUtxo);
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
