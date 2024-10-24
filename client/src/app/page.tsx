import Image from "next/image";
import React from "react";
import OrderDetails from './components/OrderDetails'
import LookUp from './components/LookUp'
import { GetServerSideProps } from 'next'

async function fetchOrderNumber(orderId: string) {
  const serviceUrl = process.env.SERVICE_URL
  const response = await fetch(`${serviceUrl}/order?orderId=${orderId}`);
  if (response.ok) return response.json();
  return null;
}

type HomeProps = {
  orderInformation: any | null;
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ query, res }) => {
  res.setHeader(
    'Cache-Control',
    'no-cache, no-store, max-age=0, must-revalidate'
  );

  const orderId = query.orderId as string | undefined;
  const orderInformation = orderId ? await fetchOrderNumber(orderId) : null;

  return {
    props: {
      orderInformation,
    },
  };
};

const Home: React.FC<HomeProps> = ({ orderInformation }) => {
  if (!orderInformation) {
    return <LookUp />;
  }

  return <div><OrderDetails Details={orderInformation} /></div>;
};

export default Home;