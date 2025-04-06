import {SchedulerClient, CreateScheduleCommand, CreateScheduleCommandInput, DeleteScheduleCommand} from "@aws-sdk/client-scheduler";
import { customerOrderDetails  } from '../interface/order'
import { awsAuthObject} from "./aws";
import dotenv from "dotenv";
dotenv.config();


const eventBridgeClient = new SchedulerClient(awsAuthObject);

export const createEmailSchedule = async(eventData:customerOrderDetails) => {

    try{
        const { CONFIRMATION_EMAIL_WAIT_HRS, FOLLOWUP_EMAIL_WAIT_HRS} = process.env
        let now = new Date();
        const firstEmailTime = new Date(now.setHours(now.getHours() + Number(CONFIRMATION_EMAIL_WAIT_HRS))).toISOString().replace(/\.\d{3}Z$/,'');
        const secondEmailTime = new Date(now.setHours(now.getHours()+ Number(FOLLOWUP_EMAIL_WAIT_HRS))).toISOString().replace(/\.\d{3}Z$/,'');

        console.log(firstEmailTime);
        console.log(secondEmailTime);

        const { order_number, email,customer_name} = eventData

        const schedules = [
            { name: `confirmation-email-${order_number}`, time:firstEmailTime, template:'confirmation' },
            { name: `followup-email-${order_number}`, time:secondEmailTime, template:'followup'},
        ];

        for (const schedule  of schedules){
            const payload:CreateScheduleCommandInput = {
                FlexibleTimeWindow: {
                    Mode: "OFF",
                },
                Name: schedule.name,
                ScheduleExpression: `at(${firstEmailTime})`,
                Target: {
                    Arn: `arn:aws:lambda:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:function:Shopify`,
                    RoleArn: `arn:aws:iam::${process.env.AWS_ACCOUNT_ID}:role/scheduler_role`,
                    Input: JSON.stringify({
                        order_number,
                        template:schedule.template,
                        schedule_name: schedule.name,
                        email,
                        name:customer_name
                    }),
                    RetryPolicy: {
                        MaximumEventAgeInSeconds: 300,
                        MaximumRetryAttempts: 1,
                    },
                },
                ScheduleExpressionTimezone: "Europe/London",
            };
            try{
                const command = new CreateScheduleCommand(payload);
                const response = await eventBridgeClient.send(command);
                console.log(`Schedule ${schedule.name} created:`, response);
            }catch(err){
                console.error(err)
            }
        }
        return true;
    }catch(error){
        throw new Error(error.message);
    }

}


export const deleteSchedule = async(scheduleName: string) => {
    const params = { Name: scheduleName };

    try {
        const command = new DeleteScheduleCommand(params);
        await eventBridgeClient.send(command);
        console.log(`Schedule "${scheduleName}" deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting schedule "${scheduleName}":`, error);
    }
}
