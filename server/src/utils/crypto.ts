import { SimpleCrypto } from "simple-crypto-js"
import dotenv from "dotenv"
dotenv.config();

const CryptoUtil = () => {

    const init = () => {
        const secretKey = process.env.MAIL_PASS;
        return new SimpleCrypto(secretKey);
    }

    const encrypt = (message:string) => {
        const crypto = init();
        const crypticText = crypto.encrypt(message)
        return crypticText
    }

    const decrypt = (crypticText:string) => {
        const crypto = init();
        return crypto.decrypt(crypticText)
    }

    return { encrypt,decrypt}
}

export default CryptoUtil