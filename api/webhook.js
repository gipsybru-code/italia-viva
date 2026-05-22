// api/webhook.js
const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

module.exports.config = {
  api: { bodyParser: false },
};

module.exports.default = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    // Read raw body
    let rawBody = '';
    await new Promise((resolve, reject) => {
      req.on('data', chunk => { rawBody += chunk; });
      req.on('end', resolve);
      req.on('error', reject);
    });

    // Verify Stripe signature
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        req.headers['stripe-signature'],
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Signature verification failed:', err.message);
      return res.status(400).json({ error: `Webhook error: ${err.message}` });
    }

    console.log('Event type:', event.type, '| Event ID:', event.id);

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const isLifetime = session.mode === 'payment';

      console.log('User ID:', userId);
      console.log('Customer:', session.customer);
      console.log('Subscription:', session.subscription);
      console.log('SUPABASE_URL exists:', !!process.env.VITE_SUPABASE_URL);
      console.log('SERVICE_ROLE exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

      if (!userId) {
        console.error('No client_reference_id in session!');
        return res.status(200).json({ received: true, warning: 'no user id' });
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription || 'lifetime',
          plan: isLifetime ? 'lifetime' : (session.metadata?.plan || 'monthly'),
          status: 'active',
          current_period_end: isLifetime
            ? new Date('2099-12-31').toISOString()
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }, { onConflict: 'user_id' });

      console.log('Supabase data:', JSON.stringify(data));
      console.log('Supabase error:', JSON.stringify(error));
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id);

      console.log('Cancellation error:', JSON.stringify(error));
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('Fatal error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
