'use client'

import React, { useState, useEffect } from "react"
import Image from "next/image"
import {OrderInformation } from '../interface';
import Lottie from "lottie-react";
import AnimationData from "../../../public/order.json";
import { useRouter } from "next/navigation"
import { processOrder } from "./func";

type OrderProps = {
        Details : {image: string,
        size: [],
        color: [],
        value:string
        title: string
        orderId:string
}}

const OrderDetails: React.FC<OrderProps> = ({Details}) => {

    const { image, size, color, value, title,orderId } = Details
    const [choosedSize,setSize] = useState<string>(''); 
    const [active,setActiveColor] = useState<string>('');
    const [orderCreated,setOrderStatus] = useState<boolean>(false)

    const router = useRouter()

    useEffect(()=> {
        const currentColor = value.split(' / ')[1]
        setActiveColor(currentColor)
    },[value,Details])

    const handleRingSizeChange = (event:React.SyntheticEvent) => {
        const target = event.target as HTMLSelectElement;
        setSize(target.value);
    }

    const handleOrderCreation = async(event:React.SyntheticEvent) => {
        
        const orderData:OrderInformation= {
            size:choosedSize,
            color:active,
            orderId:orderId
        }
        const isOrderCreated = await processOrder(orderData,'order')

        if(!isOrderCreated.ok) return router.push('/')
        setOrderStatus(true);
    }

    return (
        (
            orderCreated ? (
            <div className="my-6 p-8">

                <div className="p-8">
                    <h2 className="text-center font-bold text-2xl">Order Recieved </h2>
                    <p className="text-center">Your order has been recieved and will be delivered to you soon</p>
                </div>
                
                <div className="w-[400px] flex items-center justify-center">
                            <Lottie animationData={AnimationData} />
                </div>

            </div>
            ) : 
            (<div className="lg:flex lg:flex-row sm:flex-col items-center justify-center lg:space-x-10 sm:space-y-4 w-full">

                <div className="w-[375px] h-[375px] flex items-center justify-center relative my-6">
                    <Image fill={true} src={image} alt="image"/>
                </div>
    
                <div>
                <h6 className="font-bold text-2xl">{title}</h6>
    
                <div className="my-4 w-full">
                    <p className="font-semibold text-sm">Select size</p>
                    <select onChange={handleRingSizeChange} className="px-6 py-2 border-2 border-black rounded-md">
                    <option value=''>select Size</option>
                    {
                        size.map((si:string, index:number) => ( 
                        si !== "DONT KNOW - Send a Sizing Kit" && (<option key={index} value={si}>{si}</option>)
                        ))
                    }
                    </select>
                </div>
    
                <div className="my-4 w-full ">
                    <p className="font-semibold text-sm">Color</p>
                    <div className="flex flex-wrap items-center w-full h-full">
                    {
                    color.map((col:string, index:number) => (
                        <button onClick={()=> {setActiveColor(col)}} key={index} className={`sm:text-sm lg:text-xs border border-black rounded-full m-1 px-6 py-2 ${active === col ? 'bg-black text-white': 'bg-transparent'}`}>{col}</button>))
                    }
                    </div>
                </div>
                    <button onClick={handleOrderCreation} className="py-4 px-12 bg-red-500 text-white my-4 w-full rounded-md"> Confirm Ring Size</button>
                </div>
            </div>)
        )
        
    )
}


export default OrderDetails
