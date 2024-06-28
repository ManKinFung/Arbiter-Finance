const walletConfig =
{
    1: {
        chainId: '0x1',
        switchLabel: 'Click here to use BSC Chain',
        networkName: 'Ethereum Mainnet',
        mainnet: true,
        network: "mainnet",
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://mainnet.infura.io/v3/7535811d19b1410e98c261fbb638651a'],
        blockUrls: ['https://etherscan.io/'],
    },
    97: {
        chainId: '0x61',
        switchLabel: 'Click here to use ETH Chain',
        networkName: 'Binance Smart Chain Testnet',
        mainnet: true,
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
        },
        rpcUrls: ['https://data-seed-prebsc-1-s3.binance.org:8545/'],
        // rpcUrls: ['https://speedy-nodes-nyc.moralis.io/129fb60c557f500721cfea1f/bsc/mainnet'],
        blockUrls: ['https://testnet.bscscan.com/'],
    },
    42161: {
        chainId: '0xA4B1',
        switchLabel: '',
        networkName: 'Arbitrum One',
        mainnet: true,
        nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
        },
        rpcUrls: ['https://endpoints.omniatech.io/v1/arbitrum/one/public'],
        blockUrls: ['https://arbiscan.io/'],
    },
}

export default walletConfig
