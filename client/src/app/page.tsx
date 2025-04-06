import Image from "next/image";
import OrderDetails from './components/OrderDetails'
import LookUp from './components/LookUp'

async function fetchOrderNumber(orderId: string) {
  const serviceUrl = process.env.SERVICE_URL as string || 'http://localhost:8080';
  const response = await fetch(`${serviceUrl}/order?orderId=${orderId}`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  if (response.ok) return response.json();
  return null;
}

async function Home({ searchParams }: { searchParams: { orderId?: string } }) {
  const orderId = searchParams.orderId;
  let orderInformation = null;

  if (orderId) {
    orderInformation = await fetchOrderNumber(orderId);
  }

  if (!orderInformation) {
    return <LookUp />;
  }

  return <div><OrderDetails Details={orderInformation} /></div>;
}

export default Home;