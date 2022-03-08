import React from 'react';
import './App.css';


const pageWallet = 'addr_test1wrsm2a8hl809ran3paw999vct5mgcwtzajkntzs8thqkses8gfqln';
const aleWallet = 'addr_test1qrc6fdexcnkmt9xau0e7yv9yaxyscd06klcme4nvj9c8d2gw9vs4u5282ymd67uf666yd6qldlmhn703qgt6lxcwk0qs7mps3y'
const key = process.env.REACT_APP_API_KEY;



class BlockFrostRequest extends React.Component {
    
    fetchInit = {
        method: 'GET',
        headers: {
            project_id: key
        }
    }

    async fetchBlockfrostUnits(fetchInit) {

        //esta funcion se debe mejorar para imprimir todos los units 
        let jsonRes = await (await (fetch('https://cardano-testnet.blockfrost.io/api/v0/addresses/' + aleWallet, fetchInit))).json();
        //console.log('imprimiendo jsonRes')
        //console.log(jsonRes);
        let unit = jsonRes.amount[2].unit;
        console.log(unit);
        let unitMetadataJson = await (await (fetch('https://cardano-testnet.blockfrost.io/api/v0/assets/' + unit, fetchInit))).json();
        console.log(unitMetadataJson);


    }

    async fetchWalletUtxo(fetchInit){
        
        let walletUtxo = await (await (fetch('https://cardano-testnet.blockfrost.io/api/v0/addresses/' + pageWallet + '/utxos', fetchInit))).json();
        console.log('imprimiendo utxo');
        console.log(walletUtxo);
    }
}

export default BlockFrostRequest