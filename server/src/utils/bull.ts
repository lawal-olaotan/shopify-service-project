import {Queue, Worker , Job} from 'bullmq'; 
import dotenv from "dotenv"
import { Mailer } from "../helpers/sendEmail"
import { client } from '../utils/store'
dotenv.config();
import CryptoUtil from './crypto';
import { getPriority } from 'os';

const {REDIS_CLIENT, REDIS_PASS, }= process.env;

// Creates email queue Object
const emailQueue = new Queue('email',{ connection:{ host:REDIS_CLIENT, port: 11516, username:'default', password:REDIS_PASS}})

const worker = new Worker('email',async(job:any)=> {       
    try{
            const mailer = Mailer()
            mailer.sendEmail(job.data)
        }catch(error){
            console.log(error)
    }   
},{connection:{ host:REDIS_CLIENT, port: 11516, username:'default', password:REDIS_PASS}})


worker.on('completed', async(job:any)=> {
        // schedule new email with new payload;
        const crypto = CryptoUtil()
        const {orderId} = job.data

        const orderNumber = crypto.decrypt(orderId as string);
        let orderItem = await client.get(`${orderNumber}`) as any
        if(!orderItem.length) return emailQueue.drain();
})

worker.on('failed', async(job:Job,error:Error)=> {
        // Note: For debugging purpose
        console.log(job); 
        console.log(error);
        emailQueue.drain(); 

})


const createFollowUpEmailQueue = (emailPayload:any) => {

    // clones emailpayload to avoid changing object in the global scope
    const followUpPayload = Object.assign({}, emailPayload); 

    followUpPayload.title = "🌟 Have You Received Your Sizing Kit Yet? Let's Get Your Perfect Fit! 🌟"; 
    followUpPayload.template = 'repeat-email';

    return {
        name:'email',
        data:followUpPayload,
        opts:{repeat: { cron:'0 0 1-31/3 * * '}, 
        removeOnComplete:true,
        removeOnFail:true,
        priority:2
        }
   }
}

    
export const scheduleEmails = async (payload:any) => {

        const confirmationEmail = { name:'email',data:payload,opts:{delay:60 * 60 * 1000, removeOnComplete:true, removeOnFail:true, priority:1}}
        const followUpEmail = createFollowUpEmailQueue(payload)
        await emailQueue.addBulk([confirmationEmail,followUpEmail])
}










