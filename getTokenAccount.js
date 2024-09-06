const { Connection, clusterApiUrl, PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

async function getTokenAccountsByMint(mintAddress) {
    // Connect to the Solana devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Convert the mint address to a PublicKey
    const mintPublicKey = new PublicKey(mintAddress);

    // Fetch all parsed token accounts related to the mint address
    const tokenAccounts = await connection.getParsedAccountInfo(mintPublicKey, {
        programId: TOKEN_PROGRAM_ID
    });

    // Parse the results
    console.log(`Found ${tokenAccounts.value.length} token account(s) for mint: ${mintAddress}`);
    tokenAccounts.value.forEach((accountInfo, index) => {
        const pubkey = accountInfo.pubkey.toString();
        console.log(`Account ${index + 1}: ${pubkey}`);
    });
}

// Replace with your mint address
const mintAddress = '2mEQ3Ywf1Q4dn3Q1XLTNg5Rrdb1xSNXpBpi9qpvqsqGQ';
getTokenAccountsByMint(mintAddress).catch(console.error);
