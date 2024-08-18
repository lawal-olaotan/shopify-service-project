import Image from "next/image";
import React from "react";
import OrderDetails from './components/OrderDetails'
import LookUp from './components/LookUp'


async function fetchOrderNumber (orderId:string){
  const serviceUrl = process.env.SERVICE_URL
  const response = await fetch(`${serviceUrl}/order?orderId=${orderId}`);
  if(response.ok) return response.json();
}


type HomeProps = {
  searchParams: { [key: string]: string | undefined };
};


const Home: React.FC<HomeProps> = async({ searchParams }) => {
  
  const orderId = searchParams['orderId'];
  const orderInformation = orderId ? await fetchOrderNumber(orderId) : null;


  if(!orderInformation){
    return (
     <LookUp/>
    )
  }

  return ( <div><OrderDetails Details={orderInformation}/></div>);
}

export default Home;
