const { Keypair } = require('@solana/web3.js');

// Replace with the generated private key
const privateKey = Uint8Array.from(
    [30,221,21,130,151,198,56,44,74,209,74,133,7,112,140,17,30,10,61,19,87,70,94,231,215,166,53,171,67,139,129,196,50,166,89,128,52,158,219,145,158,113,107,223,69,244,93,97,181,79,19,136,132,59,100,189,94,15,166,160,25,30,205,76]);

const keypair = Keypair.fromSecretKey(privateKey);
console.log('Public Key:', keypair.publicKey.toBase58());