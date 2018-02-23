const mochaGasSettings = {
  reporter: 'eth-gas-reporter',
  reporterOptions : {
    currency: 'USD',
    gasPrice: 20
  }
}

const mocha = process.env.GAS_REPORTER ? mochaGasSettings : {}


module.exports = {
  networks: {
    rpc: {
      network_id: 15,
      host: 'localhost',
      port: 8111,
      gas: 6.9e6,
    },
    coverage: {
      host: "localhost",
      network_id: "*",
      port: 8555,
      gas: 0xffffffffff,
      gasPrice: 0x01
    }
  },
  build: {},
  mocha
}