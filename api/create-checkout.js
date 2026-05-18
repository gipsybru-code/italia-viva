import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  monthly: 'price_1TXnlu0jyHReTPSJEiDxNVXI',
  yearly: 'price_1TXnly0jyHReTPSJF917CeMc',
  lifetime: 'price_1TYPTa0jyHReTPSJJnAkrycr',
  //lifetime: 'price_1TXnlt0jyHReTPSJZCVTw9Lx',
 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    const { plan, userId } = body;
    const isLifetime = plan === 'lifetime';

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? 'payment' : 'subscription',
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      client_reference_id: userId,
      metadata: { plan },
      success_url: 'https://parlissimo.vercel.app?success=true',
      cancel_url: 'https://parlissimo.vercel.app?cancelled=true',
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
