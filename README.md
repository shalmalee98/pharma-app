# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Directory - PharmaSCDapp which has 2 directories - 1) pharmaSC-contract 2) pharma-app
cd pharma-app
npm install 
npm start (react app will run on localhost://3000)

cd pharmaSC-contract
truffle migrate --reset\
paste the smart contract address from the delpoyed contract to the constants file in the src folder inside the pharma-app

Open a Ganache node
Copy & paste private key of first address on the node to import an account on metamask
Also, copy the address and paste it in the address of the firebase admin account

Bingo! you are live on our website (launch it on localhost://3000)


### Deploy smart contract on truffle
=> npm install -g truffle
Open project directory of smart contract in terminal with truffle project created
=> npm intsall @truffle/hdwallet-provider
create the .env file
=> npm install dotenv
.env file shoulkd contain the following:
INFURA_API_KEY = "https://sepolia.infura.io/v3/<Your-API-Key>"
MNEMONIC = "<Your-MetaMask-Secret-Recovery-Phrase>"
Add the following to truffle-config.js:
=> require('dotenv').config();
=> const HDWalletProvider = require('@truffle/hdwallet-provider');
=> const { INFURA_API_KEY, MNEMONIC } = process.env;
=> module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    sepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY),
      network_id: '11155111',
      gas: 4465030
    }
  }
};

Compile the smart contract 
=> truffle compile
Deploy the smart contract
=> truffle migrate --network sepolia

### Changes in react app(node js):
Use web3, copy abi file into abi folder under src directory
Declare web3 to access wallet inside our dapp
=> const web3 = new Web3(Web3.givenProvider);
Change contract address from constants file
Run the frontend 
=> npm start

### Hosting react app on firebase:
Create a project in firebase console online
=> npm install -g firebase-tools
Login to firebase in your terminal
=> firebase login
=> npm run build
=> firebase init
1. Select option hosting: configure and deploy Firebase hosting using GitHub
2. Answer build to deploy assets
3. Single page application? Yes
4. Overwrite existing index.html? No
5. You'll see two new files .firebaserc, firebase.json
Deploy react app
=> firebase deploy
Once it is deployed, firebase will give you a unique hosting URL where the deployed app is located

### Admin details
email - admin@gmail.com
password = 123456


