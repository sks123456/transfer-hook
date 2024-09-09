const {
    Connection,
    PublicKey,
    clusterApiUrl,
} = require('@solana/web3.js');

(async () => {
    // Constants: Replace these with your actual values
    const tokenAccountAddress = new PublicKey('3aTnrVmArXKrsSSwoTWDXYfm6YApDspoNNytBcUrSFMx'); // Token account address
    const mintAddress = new PublicKey('2mEQ3Ywf1Q4dn3Q1XLTNg5Rrdb1xSNXpBpi9qpvqsqGQ'); // Mint address

    // Connect to the Solana devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    console.log('Connected to Solana devnet');

    try {
        // Fetch the token account information
        const tokenAccountInfo = await connection.getParsedAccountInfo(tokenAccountAddress);
        
        if (!tokenAccountInfo || !tokenAccountInfo.value) {
            console.log('Token account not found or invalid.');
            return;
        }

        const tokenAccountData = tokenAccountInfo.value.data.parsed;
        
        // Display token account details
        console.log('Token Account Information:');
        console.log('Owner (User):', tokenAccountData.info.owner);
        console.log('Mint Address:', tokenAccountData.info.mint);
        console.log('Token Balance:', tokenAccountData.info.tokenAmount.uiAmountString);

        // Manually fetch the mint account information
        console.log("\nFetching Mint Info...");

        const mintAccountInfo = await connection.getParsedAccountInfo(mintAddress);
        if (!mintAccountInfo || !mintAccountInfo.value) {
            console.log('Mint account not found.');
            return;
        }

        const mintData = mintAccountInfo.value.data.parsed.info;
        console.log('Mint Information:');
        console.log('Decimals:', mintData.decimals);
        console.log('Supply:', mintData.supply);

    } catch (error) {
        console.error('Error fetching token account or mint information:', error);
    }
})();