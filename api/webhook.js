import { createClient } from '@supabase/supabase-js';

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
    console.log('Event type:', event.type);
    console.log('User ID:', event.data?.object?.client_reference_id);
    console.log('SUPABASE_URL:', !!process.env.VITE_SUPABASE_URL);
    console.log('SERVICE_ROLE:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;

      if (!userId) {
        console.error('No user ID!');
        return res.status(200).json({ received: true });
      }

      const supabase = createClient(
        process.env.VITE_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const { data, error } = await supabase.from('subscriptions').upsert({
        user_id: userId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription || 'lifetime',
        plan: session.metadata?.plan || 'monthly',
        status: 'active',
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'user_id' });

      console.log('Supabase data:', JSON.stringify(data));
      console.log('Supabase error:', JSON.stringify(error));
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Fatal:', err.message);
    res.status(500).json({ error: err.message });
  }
}
