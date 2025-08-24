import { useDefaultWallet } from "./api/const";
import { createETF } from "./api/etf_token"
import * as anchor from "@coral-xyz/anchor";

(async () => {
    const defaultWallet = useDefaultWallet();
    const [name, symbol, description, url] = [
        "MyETF3",
        "MYETF3",
        "This is my ETF3",
        "https://my-etf.com",
    ];
    const assets = [
        {
            token: new anchor.web3.PublicKey("FGNSbKTiKd4d1Zv97c2iQACADB8N7MnDnDsv5auHGAHo"),
            weight: 90,
        },
        {
            token: new anchor.web3.PublicKey("GTzKipZ6PcTEV2iV4LP1Yowwc4QPt1hvKmk6vuqY8ywp"),
            weight: 10,
        },
    ];
    const tx = await createETF(defaultWallet, name, symbol, description, url, assets);
    console.log(tx);
})();
