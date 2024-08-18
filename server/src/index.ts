// Imports dependencies and set up http server
import express from "express";
import  bodyParser from 'body-parser';
import webhook from "./routes/webhook";
import order from "./routes/order";
import cors from 'cors'
import morgan from 'morgan'
import dotenv from "dotenv"
dotenv.config(); 


const app = express();


app.use(cors());
app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit:'200mb', extended:false}));

app.use("/webhook", webhook);
app.use("/order", order);


// listen to port from environment variable
app.listen(process.env.PORT, async() =>{
    console.log("Payment API is listening to:", process.env.PORT)
}
    
);