import { deriveEtfTokenMintAccount } from "./api/address";
import { useDefaultWallet } from "./api/const";
import { createETF, tokenMint, tokenBurn } from "./api/etf_token"
import * as anchor from "@coral-xyz/anchor";

(async () => {
    const defaultWallet = useDefaultWallet();
    // const [name, symbol, description, url] = [
    //     "Sonia",
    //     "Sonia",
    //     "This is my Sonia",
    //     "https://my-etf.com",
    // ];
    // const assets = [
    //     {
    //         // ata:G6qmascGXsiNgBq62mEe7UVbDwFibigVPT5BUruDQdwK
    //         token: new anchor.web3.PublicKey("76EV8QxLELcs63zrjwu9o1ifeX9LaYMixrzwmSHp7EHH"),
    //         weight: 90,
    //     },
    //     {
    //         // ata: 3WU9oy5up6Wfd2i7UdgHQx763i76ufWShmavCE49sBkd
    //         token: new anchor.web3.PublicKey("HhGykz9QW6hTZ4kcfcfGPDVxmRQ2hGAFtAehBrwxdDNE"),
    //         weight: 10,
    //     },
    // ];
    // const tx = await createETF(defaultWallet, name, symbol, description, url, assets);
    // console.log(tx);

    const [etf,] = deriveEtfTokenMintAccount("Sonia")
    console.log(etf.toString())

    // const r2 = await tokenMint(defaultWallet, etf, 100000000000)
    // console.log(r2)

    const r3 = await tokenBurn(defaultWallet, etf, 100000000000)
    console.log(r3)

})();
