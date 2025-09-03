export const PLANS = {
  FREE: {
    name: 'FREE',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for getting started with AI emoji generation',
    features: [
      '5 emoji generations per month',
      'Basic 3D-style Fluent emojis',
      '768x768 resolution',
      'Standard generation speed',
      'Community support',
      'Basic emoji styles',
      'Download in PNG format',
      'Share via social media'
    ],
    limitations: [
      'Limited to 5 generations/month',
      'No priority generation',
      'Basic support only',
      'No custom branding',
      'No API access'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline',
    popular: false
  },
  PREMIUM: {
    name: 'PREMIUM',
    price: { monthly: 9.99, annual: 99.99 },
    description: 'Unlimited access to advanced AI emoji generation',
    features: [
      'Unlimited emoji generations',
      'Premium 3D-style Fluent emojis',
      'High-resolution (1024x1024)',
      'Priority generation queue',
      'Priority customer support',
      'Advanced emoji styles & themes',
      'Multiple export formats (PNG, SVG, WebP)',
      'Custom branding options',
      'API access for developers',
      'Bulk generation (up to 50 at once)',
      'Advanced prompt suggestions',
      'Emoji history & favorites',
      'Team collaboration features',
      'White-label solutions',
      'Analytics & insights'
    ],
    limitations: [],
    buttonText: 'Start Premium',
    buttonVariant: 'primary',
    popular: true
  }
} as const;

export type PlanKey = keyof typeof PLANS;
