import type { NextApiRequest, NextApiResponse } from 'next';

const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;

const createCheckoutSession = async () => {
  const response = await fetch('https://api.paymongo.com/v1/links', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${PAYMONGO_SECRET_KEY}:`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        attributes: {
          amount: 10000,
          currency: 'PHP',
          description: 'Membership Payment',
          payment_method: 'gcash',
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create PayMongo session');
  }

  const data = await response.json();
  return data.data.attributes.checkout_url;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const paymentUrl = await createCheckoutSession();
      res.status(200).json({ data: { attributes: { checkout_url: paymentUrl } } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create payment link' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
