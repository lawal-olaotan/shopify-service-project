import dotenv from "dotenv"
dotenv.config();


const {AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env

export const awsAuthObject = {
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID || "",
        secretAccessKey: AWS_SECRET_ACCESS_KEY || "",
    },
}