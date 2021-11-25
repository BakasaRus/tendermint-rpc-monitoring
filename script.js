const rpc = 'https://umeevengers-1b-rpc-3.nodes.guru:443';

async function load_network() {
    let status = await fetch(`${rpc}/status?`);
    status = await status.json();
    status = status.result;

    const height = status.sync_info.latest_block_height;
    document.getElementById("height").innerText = new Intl.NumberFormat('en-US').format(height);

    const chain = status.node_info.network;
    document.getElementById("network").innerText = chain;

    const is_synced = !status.sync_info.catching_up;
    document.getElementById("synced").innerText = is_synced ? 'synced' : 'not synced';

    let validators = await fetch(`${rpc}/validators?height=${height}&page=1&per_page=5`);
    validators = await validators.json();
    validators = validators.result;

    const validators_count = validators.total;
    document.getElementById("validators").innerText = new Intl.NumberFormat('en-US').format(validators_count);

    let block = await fetch(`${rpc}/blockchain?minHeight=${height}&maxHeight=${height}`);
    block = await block.json();
    block = block.result;

    const txs_count = block.block_metas[0].num_txs;
    document.getElementById("txs").innerText = new Intl.NumberFormat('en-US').format(txs_count);
}

async function load_mempool() {
    let mempool = await fetch(`${rpc}/num_unconfirmed_txs?`);
    mempool = await mempool.json();
    mempool = mempool.result;

    const mempool_count = mempool.n_txs;
    document.getElementById("mempool").innerText = new Intl.NumberFormat('en-US').format(mempool_count);
}

(function() {
    load_network();
    load_mempool();
    let networkTimerId = setInterval(load_network, 5000);
    let mempoolTimerId = setInterval(load_mempool, 1000);
    
    window.onunload = function () {
        clearInterval(networkTimerId);
        clearInterval(mempoolTimerId);
    }
})();
