const express = require('express');
const Blockfrost = require('@blockfrost/blockfrost-js');

const wallet = 'addr_test1wrsm2a8hl809ran3paw999vct5mgcwtzajkntzs8thqkses8gfqln'
const API = new Blockfrost.BlockFrostAPI({
    projectId: 'testnet5SF8ZLNrk7uvhbB3yG2pAWgyHq4h866V', // see: https://blockfrost.io
});

const app = express();

async function runExample() {
    try {
        // const latestBlock = await API.blocksLatest();
        // const networkInfo = await API.network();
        // const latestEpoch = await API.epochsLatest();
        // const health = await API.health();
        const address = await API.addresses(wallet);
        const cardanoAssets = await API.assets(wallet);


        
        // const pools = await API.pools({ page: 1, count: 10, order: 'asc' });

        // console.log('pools', pools);
        console.log(address);
        
        //console.log('XD',cardanoAssets);
        // console.log('networkInfo', networkInfo);
        // console.log('latestEpoch', latestEpoch);
        // console.log('latestBlock', latestBlock);
        // console.log('health', health);
    } catch (err) {
        console.log('error', err);
    }
}

app.listen(3001);

runExample();




