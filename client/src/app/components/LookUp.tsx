'use client'

import React, {useRef} from "react"
import { useRouter } from "next/navigation"
import { processOrder } from "./func"


const LookUp = () => {

    const orderRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const processOrderNo = async() => { 
        const orderInformation = {
            orderId:orderRef?.current?.value,
            orderEmail:emailRef?.current?.value
        }
        const isOrderValid = await processOrder(orderInformation,'order/lookUp');
        if(isOrderValid.ok){
            router.push('/?orderId='+orderRef?.current?.value)
        }
    }

    
    return (

        <div className="lg:flex items-center justify-center lg:space-x-10 sm:space-y-4 w-full">

            

                <div className="p-2">
                    
                    <div>
                        <h2 className="font-bold text-xl">Look up Order</h2>
                        <h6 className="text-sm text-gray-800">Welcome back! Please enter your order no</h6>
                    </div>

                    <div className="my-4">
                        <h6 className="text-sm text-gray-800">Order no</h6>
                        <div className="pl-6 py-4 border text-left border-black">
                            <input className="w-full outline-none" ref={orderRef} type="text" placeholder="1025" required/>
                        </div>
                    </div>
                    <div className="my-4 ">
                        <h6 className="text-sm text-gray-800">Email Address</h6>
                        <div className="pl-6 py-4 border text-left border-black">
                            <input className="w-full outline-none" ref={emailRef} type="text" placeholder="Enter your email" required/>
                        </div>
                    </div>

                    <button onClick={processOrderNo} className="py-4 px-24 bg-red-500 text-white my-4 rounded-md w-full">Lookup Order</button>

                </div>
                
        </div>
    )


}


export default LookUp
