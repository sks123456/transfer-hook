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
    createTransferCheckedInstruction,
    TOKEN_PROGRAM_ID
} = require('@solana/spl-token');

// Token-2022 Program ID (Token Extensions)
const TOKEN_EXT_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');

// Replace these with your actual values
const mintAddress = new PublicKey("2mEQ3Ywf1Q4dn3Q1XLTNg5Rrdb1xSNXpBpi9qpvqsqGQ"); // Token mint address
const fromPrivateKey = Uint8Array.from([30,221,21,130,151,198,56,44,74,209,74,133,7,112,140,17,30,10,61,19,87,70,94,231,215,166,53,171,67,139,129,196,50,166,89,128,52,158,219,145,158,113,107,223,69,244,93,97,181,79,19,136,132,59,100,189,94,15,166,160,25,30,205,76]); // Replace with your actual private key array [A]
const fromKeypair = Keypair.fromSecretKey(fromPrivateKey); // Sender's keypair
const fromTokenAccount = new PublicKey("3aTnrVmArXKrsSSwoTWDXYfm6YApDspoNNytBcUrSFMx"); // Sender's token account address
const recipientPublicKey = new PublicKey("C3JEoLwCkMmrVwycw2mNhnoAXgXHt4TB4uRFZrJ94ZbC"); // Recipient's public key or token account address
const transferAmount = 500; // Replace with the amount to transfer

// Extra accounts required by Transfer Hook
const extraAccountMetaList = new PublicKey("D8ZUg78skXM6mtCL6iLzAdjvcNgW1Civ1zRzR2fs7i1i"); // Derived Extra Account Meta List
const counterAccount = new PublicKey("9ZNDGK7ykXmYYDuS24uJvRezbDnja1j5LTTtVVwQ24mH"); // Derived Counter Account


(async () => {
    try {
        // Create a connection to the Solana devnet
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
        console.log('Connected to Solana devnet');

        // Fetch the associated token account for the recipient (if needed)
        const recipientTokenAccount = await getAssociatedTokenAddress(
            mintAddress,
            recipientPublicKey,
            false, // Whether the associated token account uses a PDA
            TOKEN_EXT_PROGRAM_ID
        );
        console.log('Recipient Token Account:', recipientTokenAccount.toBase58());

        // Create the transfer instruction using `transferChecked`
        const transferInstruction = createTransferCheckedInstruction(
            fromTokenAccount, // Sender's token account
            mintAddress, // Mint address
            recipientTokenAccount, // Recipient's associated token account
            fromKeypair.publicKey, // Sender's public key
            transferAmount * Math.pow(10, 9), // Adjust for decimals (assuming 9 decimals)
            9, // Number of decimals in the mint
            [], // Additional signers (empty in this case)
            TOKEN_EXT_PROGRAM_ID // Use the Token Extensions program ID here
        );

        // Include extra accounts required by Transfer Hook
        transferInstruction.keys.push({
            pubkey: extraAccountMetaList,
            isSigner: false,
            isWritable: true
        });
        transferInstruction.keys.push({
            pubkey: counterAccount,
            isSigner: false,
            isWritable: true
        });

        // Create a transaction and add the transfer instruction
        const transaction = new Transaction().add(transferInstruction);

        // Send and confirm the transaction
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [fromKeypair] // Sign with the sender's keypair
        );

        console.log(`Successfully transferred ${transferAmount} tokens`);
        console.log('Transaction signature:', signature);

    } catch (error) {
        console.error('Error transferring tokens:', error);
    }
})();