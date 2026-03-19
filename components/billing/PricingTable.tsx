'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { StripeService } from '../../lib/billing/stripe-service';

const plans = [
  {
    id: 'free',
    name: 'Standard',
    price: '$0',
    description: 'Perfect for starters.',
    features: ['1000 Credits', 'Google Workspace Sync', 'Basic Neural Router'],
    priceId: '',
  },
  {
    id: 'pro',
    name: 'Pro Sovereign',
    price: '$29/mo',
    description: 'The agent that never sleeps.',
    features: ['Unlimited Credits', 'Claude 3.5 & Gemini 1.5 Pro', 'Deep Web Search', 'Priority Support'],
    priceId: 'price_pro_subscription',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Neural Enterprise',
    price: 'Custom',
    description: 'Scale without boundaries.',
    features: ['SLA Support', 'Custom Model Integration', 'Whitelabeling'],
    priceId: 'price_enterprise_subscription',
  }
];

export const PricingTable = () => {
    return (
        <div className="flex flex-wrap justify-center gap-8 p-12 bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl">
            {plans.map((plan) => (
                <motion.div 
                    key={plan.id}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className={`relative w-80 p-8 rounded-2xl border ${plan.popular ? 'border-amber-500/30' : 'border-white/10'} bg-white/5`}
                >
                    {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                            MOST POPULAR
                        </div>
                    )}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-6">{plan.description}</p>
                    <div className="text-4xl font-black mb-8">{plan.price}</div>
                    
                    <ul className="mb-8 space-y-4">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-300">
                                <span className="mr-2 text-amber-500">✓</span> {feature}
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={() => plan.priceId && StripeService.startCheckout(plan.priceId)}
                        className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-amber-500 text-black' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {plan.id === 'free' ? 'Current Plan' : 'Get Started'}
                    </button>
                </motion.div>
            ))}
        </div>
    );
};
