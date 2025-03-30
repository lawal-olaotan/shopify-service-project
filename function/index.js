import dotenv from "dotenv";
dotenv.config();

const sendEmail = async(body) => {

    try{
        const apiEndpoint = process.env.API_ENDPOINT
        const params = {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(body)
        };

        const isProcessSuccessful = await fetch(apiEndpoint,params);

        if(!isProcessSuccessful.ok){
            throw new Error('Error occured');
        }

        return isProcessSuccessful.ok;

    }catch(error){

    }


}


exports.handler = async(event)=> {

    try{
        const isEmailSent = await sendEmail(event);

        if(isEmailSent){
            return{
                statusCode: 200,
                body: JSON.stringify({
                    message: 'success'
                })
            }
        }
    }catch(error){
        return{
            statusCode: 500,
            body: JSON.stringify({
                message: error
            })
        }
    }

}