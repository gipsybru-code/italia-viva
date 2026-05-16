import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  monthly: 'REPLACE_WITH_MONTHLY_PRICE_ID',
  yearly: 'REPLACE_WITH_YEARLY_PRICE_ID',
  lifetime: 'REPLACE_WITH_LIFETIME_PRICE_ID',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { plan } = req.body;

  try {
    const isLifetime = plan === 'lifetime';
    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? 'payment' : 'subscription',
      line_items: [{ price: PRICES[plan], quantity: 1 }],
      success_url: 'https://italia-viva.vercel.app?success=true',
      cancel_url: 'https://italia-viva.vercel.app?cancelled=true',
    });
    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
