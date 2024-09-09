import { getAssociatedTokenAddress, getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID, transferChecked } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, sendAndConfirmRawTransaction, Transaction, TransactionExpiredBlockheightExceededError, TransactionInstruction } from "@solana/web3.js";

(async () =>{
    const c = new Connection("https://api.devnet.solana.com");
    const payer = Keypair.fromSecretKey(Uint16Array.from(JSON.parse(SECRET)))
    const mint = new PublicKey("BuWizvs4JHduqaHYWGkSfsfsw9EH86MWSV3ejZN8PKUu");
    const receiver = new Keypair().publicKey;

    const src = getAssociatedTokenAddressSync(mint, payer.publicKey, undefined,TOKEN_2022_PROGRAM_ID)
    const dst = new PublicKey("hok9d4cUYSbDnBnWhAcc3JB9xKnJYDDaaSSJASRHb2R"); 
    // const sx = await transferChecked(c,payer,src,mint,dst,payer,1,9,undefined)
    const ix = new TransactionInstruction({
        key: [{
            pubKey:src,
            isWritable: true,
            isSigner: false
        },{
            pubKey:mint,
            isWritable: true,
            isSigner: false
        },{
            pubKey:dst,
            isWritable: true,
            isSigner: false
        },{
            pubKey:payer.publicKey,
            isWritable: true,
            isSigner: true
        },],
        programId: TOKEN_2022_PROGRAM_ID,
        data: Buffer.from("2b220d31a758ebeb01000000000e675cb14d841ba1440a355632988f3dbc5f11de46dfe71ee177297d94f1bed30001", "hex")
    });

    const tx = new Transaction();
    tx.add(ix);
    tx.recentBlockhash = (await c.getLatestBlockhash()).blockhash
    tx.feePayer = payer.publicKey;
    tx.sign([payer]);

    const sx = await sendAndConfirmRawTransaction(c, tx, [payer]);
    console.log(sx);  
})