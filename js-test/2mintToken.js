const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');
const {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} = require('@solana/spl-token');

// Use the Token Extensions program ID (TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb)
const TOKEN_EXT_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

// Replace these with your actual values
const mintAddress = new PublicKey("2mEQ3Ywf1Q4dn3Q1XLTNg5Rrdb1xSNXpBpi9qpvqsqGQ"); // Token mint address
const mintAuthorityPrivateKey = Uint8Array.from([159,140,55,224,46,185,28,39,86,188,237,44,49,34,250,253,120,11,84,95,170,62,194,205,34,247,17,204,5,88,172,32,164,7,53,114,152,212,77,16,34,112,212,178,79,202,179,218,250,86,195,185,34,83,182,146,78,253,149,154,26,155,91,23]); // Private key array for mint authority
const mintAuthority = Keypair.fromSecretKey(mintAuthorityPrivateKey); // Create Keypair from the private key
const newRecipientPublicKey = new PublicKey("4QiWJvgj25zhwCM93rRZcKTkhByfnkGQY2BPgtmQeieo"); // New address for token mint
const mintAmount = 5000; // Amount of tokens to mint

(async () => {
    try {
        console.log("Starting token mint process...");
        
        // Create a connection to the Solana devnet
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        console.log("Connected to Solana devnet");

        // Log the mint authority public key
        console.log("Mint Authority Public Key:", mintAuthority.publicKey.toBase58());

        // Get the associated token account for the new recipient (or create one if it doesn't exist)
        console.log("Fetching associated token account for recipient...");
        const newRecipientTokenAccount = await getAssociatedTokenAddress(
            mintAddress,
            newRecipientPublicKey,
            false,
            TOKEN_EXT_PROGRAM_ID, // Use the Token Extensions program ID here
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
        console.log("Associated Token Account for recipient:", newRecipientTokenAccount.toBase58());

        // Check if the new recipient's associated token account exists
        console.log("Checking if associated token account exists...");
        const accountInfo = await connection.getAccountInfo(newRecipientTokenAccount);
        console.log("Account info:", accountInfo ? "Exists" : "Does not exist");

        const transaction = new Transaction();

        if (!accountInfo) {
            // If the associated token account doesn't exist, create it
            console.log("Associated Token Account doesn't exist, creating one...");
            const createTokenAccountIx = createAssociatedTokenAccountInstruction(
                mintAuthority.publicKey, // payer (mint authority)
                newRecipientTokenAccount, // new associated token account
                newRecipientPublicKey, // recipient
                mintAddress, // mint address
                TOKEN_EXT_PROGRAM_ID, // Use the Token Extensions program ID here
                ASSOCIATED_TOKEN_PROGRAM_ID
            );
            transaction.add(createTokenAccountIx);
        }

        // Mint the tokens to the new recipient's associated token account
        console.log(`Minting ${mintAmount} tokens to recipient...`);
        const mintToIx = createMintToInstruction(
            mintAddress,
            newRecipientTokenAccount,
            mintAuthority.publicKey,
            mintAmount * Math.pow(10, 9), // Adjust for decimals (assuming 9 decimals)
            [],
            TOKEN_EXT_PROGRAM_ID // Use the Token Extensions program ID here
        );
        transaction.add(mintToIx);

        // Send and confirm the transaction
        console.log("Sending transaction...");
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [mintAuthority] // Sign with the mint authority
        );

        console.log(`Minted ${mintAmount} tokens to new recipient: ${newRecipientPublicKey.toBase58()}`);
        console.log(`Transaction signature: ${signature}`);

    } catch (error) {
        console.error("Error minting tokens to new address:", error);
    }
})();