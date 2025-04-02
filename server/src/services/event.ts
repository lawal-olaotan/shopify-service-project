import {SchedulerClient, CreateScheduleCommand, CreateScheduleCommandInput, DeleteScheduleCommand} from "@aws-sdk/client-scheduler";
import { customerOrderDetails  } from '../interface/order'
import { awsAuthObject} from "./aws";


const eventBridgeClient = new SchedulerClient(awsAuthObject);

export const createEmailSchedule = async(eventData:customerOrderDetails) => {
    const now = new Date();
    const firstEmailTime =  new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    const secondEmailTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const { order_number, email,customer_name} = eventData

    const schedules = [
        { name: `confirmation-email-${order_number}`, time: firstEmailTime, template:'confirmation' },
        { name: `followup-email-${order_number}`, time: secondEmailTime, template:'followup'},
    ];

    for (const schedule  of schedules){
        const payload:CreateScheduleCommandInput = {
            FlexibleTimeWindow: {
                Mode: "OFF",
            },
            Name: schedule.name,
            ScheduleExpression: `at(${schedule.time})`,
            Target: {
                Arn: `arn:aws:lambda:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:function:send-email`,
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
}
