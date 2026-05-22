/*import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;
  let rawBody = '';

  await new Promise((resolve, reject) => {
    req.on('data', chunk => { rawBody += chunk; });
    req.on('end', resolve);
    req.on('error', reject);
  });

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const isLifetime = session.mode === 'payment';

    await supabase.from('subscriptions').upsert({
      user_id: userId,
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription || 'lifetime',
      plan: isLifetime ? 'lifetime' : session.metadata?.plan || 'monthly',
      status: 'active',
      current_period_end: isLifetime
        ? new Date('2099-12-31').toISOString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }, { onConflict: 'user_id' });
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', subscription.id);
  }
*/
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    let rawBody = '';
    await new Promise((resolve, reject) => {
      req.on('data', chunk => { rawBody += chunk; });
      req.on('end', resolve);
      req.on('error', reject);
    });

    const event = JSON.parse(rawBody);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const isLifetime = session.mode === 'payment';

      const { error } = await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription || 'lifetime',
        plan: isLifetime ? 'lifetime' : session.metadata?.plan || 'monthly',
        status: 'active',
        current_period_end: isLifetime
          ? new Date('2099-12-31').toISOString()
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'user_id' });

      if (error) console.error('Supabase error:', error);
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
}
  res.status(200).json({ received: true });
}
