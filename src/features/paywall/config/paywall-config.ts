/**
 * Paywall Configuration
 * Based on best practices from paywall design guides
 * Reference: https://qonversion.io/blog/paywall-design-uiux-examples/
 */

import type { Theme } from "#root/ui/style/theme";

export interface PaywallFeature {
  id: string;
  icon: string; // Icon name or emoji
  title: string;
  description: string;
}

export interface PaywallConfig {
  // Visual Design
  backgroundColor: keyof Theme["colors"];
  primaryColor: keyof Theme["colors"];
  textColor: keyof Theme["colors"];
  accentColor: keyof Theme["colors"];
  backgroundImage?: string; // Optional Unsplash image URL

  // Content
  title: string;
  subtitle: string;
  description: string;
  features: PaywallFeature[];

  // CTA Button
  ctaButtonText: string;
  ctaButtonVariant: "primary" | "secondary";
  restoreButtonText: string;

  // Social Proof
  showSocialProof: boolean;
  socialProofText?: string;

  // Trust Indicators
  showTrustBadges: boolean;
  trustBadges?: string[];

  // Pricing Display
  showPricing: boolean;
  highlightBestValue: boolean;

  // Skip Option
  allowSkip: boolean;
  skipButtonText?: string;

  // Trial Reminders
  trialReminders: {
    enabled: boolean;
    twoDayReminderTitle: string;
    twoDayReminderBody: string;
    oneDayReminderTitle: string;
    oneDayReminderBody: string;
  };

  /**
   * Can Continue Without Trial
   * If true, shows a close button to skip paywall.
   * If false, user must start trial to proceed (hard paywall).
   */
  canContinueWithoutTrial: boolean;
}

/**
 * Paywall Configuration by Language
 * Multi-language support for paywall content
 */
export type PaywallConfigByLanguage = Record<"en" | "fr", PaywallConfig>;

/**
 * Default Paywall Configuration by Language
 * This serves as a base template that can be customized via A/B testing
 */
export const defaultPaywallConfigByLanguage: PaywallConfigByLanguage = {
  en: {
    // Visual Design
    backgroundColor: "background",
    primaryColor: "primary",
    textColor: "text",
    accentColor: "secondary",
    backgroundImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=1600&fit=crop&q=80",

    // Content
    title: "Unlock Premium Features",
    subtitle: "Get access to exclusive content and features",
    description: "Join thousands of users who are already enjoying premium benefits",

    // Features List
    features: [
      {
        id: "unlimited",
        icon: "✨",
        title: "Unlimited Access",
        description: "Access all premium features without limits",
      },
      {
        id: "ad-free",
        icon: "🚫",
        title: "Ad-Free Experience",
        description: "Enjoy your app without interruptions",
      },
      {
        id: "priority",
        icon: "⭐",
        title: "Priority Support",
        description: "Get help from our team faster",
      },
      {
        id: "exclusive",
        icon: "🎁",
        title: "Exclusive Content",
        description: "Access content only available to premium members",
      },
    ],

    // CTA Button
    ctaButtonText: "Start Free Trial",
    ctaButtonVariant: "primary",
    restoreButtonText: "Restore Purchases",

    // Social Proof
    showSocialProof: true,
    socialProofText: "Join 10,000+ premium users",

    // Trust Indicators
    showTrustBadges: true,
    trustBadges: ["Cancel anytime", "Secure payment", "7-day free trial"],

    // Pricing Display
    showPricing: true,
    highlightBestValue: true,

    // Skip Option
    allowSkip: true,
    skipButtonText: "Maybe Later",

    // Trial Reminders
    trialReminders: {
      enabled: true,
      twoDayReminderTitle: "Your trial ends in 2 days!",
      twoDayReminderBody: "Don't miss out on premium features. Subscribe now to continue.",
      oneDayReminderTitle: "Last day of your trial!",
      oneDayReminderBody: "Your trial expires tomorrow. Subscribe to keep your premium access.",
    },

    // Default: Allow skipping without trial
    canContinueWithoutTrial: true,
  },
  fr: {
    // Visual Design
    backgroundColor: "background",
    primaryColor: "primary",
    textColor: "text",
    accentColor: "secondary",
    backgroundImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=1600&fit=crop&q=80",

    // Content
    title: "Débloquez les fonctionnalités Premium",
    subtitle: "Accédez à du contenu et des fonctionnalités exclusives",
    description: "Rejoignez des milliers d'utilisateurs qui profitent déjà des avantages premium",

    // Features List
    features: [
      {
        id: "unlimited",
        icon: "✨",
        title: "Accès illimité",
        description: "Accédez à toutes les fonctionnalités premium sans limites",
      },
      {
        id: "ad-free",
        icon: "🚫",
        title: "Expérience sans publicité",
        description: "Profitez de votre application sans interruptions",
      },
      {
        id: "priority",
        icon: "⭐",
        title: "Support prioritaire",
        description: "Obtenez de l'aide de notre équipe plus rapidement",
      },
      {
        id: "exclusive",
        icon: "🎁",
        title: "Contenu exclusif",
        description: "Accédez au contenu uniquement disponible pour les membres premium",
      },
    ],

    // CTA Button
    ctaButtonText: "Commencer l'essai gratuit",
    ctaButtonVariant: "primary",
    restoreButtonText: "Restaurer les achats",

    // Social Proof
    showSocialProof: true,
    socialProofText: "Rejoignez plus de 10 000 utilisateurs premium",

    // Trust Indicators
    showTrustBadges: true,
    trustBadges: ["Annulez à tout moment", "Paiement sécurisé", "Essai gratuit de 7 jours"],

    // Pricing Display
    showPricing: true,
    highlightBestValue: true,

    // Skip Option
    allowSkip: true,
    skipButtonText: "Peut-être plus tard",

    // Trial Reminders
    trialReminders: {
      enabled: true,
      twoDayReminderTitle: "Votre essai se termine dans 2 jours!",
      twoDayReminderBody:
        "Ne manquez pas les fonctionnalités premium. Abonnez-vous maintenant pour continuer.",
      oneDayReminderTitle: "Dernier jour de votre essai!",
      oneDayReminderBody:
        "Votre essai expire demain. Abonnez-vous pour conserver votre accès premium.",
    },

    // Default: Allow skipping without trial
    canContinueWithoutTrial: true,
  },
};

/**
 * Get default paywall config for a language
 */
export const getDefaultPaywallConfig = (language: "en" | "fr" = "en"): PaywallConfig => {
  return defaultPaywallConfigByLanguage[language] || defaultPaywallConfigByLanguage.en;
};

/**
 * A/B Test Variants by Language
 * Different configurations for testing paywall effectiveness
 */
export const paywallVariantsByLanguage: Record<
  "en" | "fr",
  Record<string, Partial<PaywallConfig>>
> = {
  en: {
    control: {
      // Default configuration
      title: "Unlock Premium Features",
      subtitle: "Get access to exclusive content and features",
      description: "Join thousands of users who are already enjoying premium benefits",
    },
    variant_a: {
      // Focus on benefits
      title: "Transform Your Experience",
      subtitle: "Everything you need to succeed",
      description: "Unlock powerful features designed to help you achieve more",
      features: [
        {
          id: "unlimited",
          icon: "✨",
          title: "Unlimited Everything",
          description: "No limits, no restrictions, just pure productivity",
        },
        {
          id: "ad-free",
          icon: "🚫",
          title: "Zero Distractions",
          description: "Focus on what matters with an ad-free experience",
        },
        {
          id: "priority",
          icon: "⭐",
          title: "VIP Support",
          description: "24/7 priority support from our expert team",
        },
        {
          id: "exclusive",
          icon: "🎁",
          title: "Early Access",
          description: "Be the first to try new features and updates",
        },
      ],
    },
    variant_b: {
      // Focus on value
      title: "Start Your Premium Journey",
      subtitle: "Get more done, faster",
      description: "Premium members save an average of 5 hours per week",
      ctaButtonText: "Try Premium Free",
      socialProofText: "Over 50,000 users upgraded this month",
    },
    variant_c: {
      // Minimal approach
      title: "Go Premium",
      subtitle: "Unlock the full potential",
      description: "All features. No limits. Cancel anytime.",
      showSocialProof: false,
      showTrustBadges: false,
    },
  },
  fr: {
    control: {
      title: "Débloquez les fonctionnalités Premium",
      subtitle: "Accédez à du contenu et des fonctionnalités exclusives",
      description: "Rejoignez des milliers d'utilisateurs qui profitent déjà des avantages premium",
    },
    variant_a: {
      title: "Transformez votre expérience",
      subtitle: "Tout ce dont vous avez besoin pour réussir",
      description:
        "Débloquez des fonctionnalités puissantes conçues pour vous aider à en faire plus",
      features: [
        {
          id: "unlimited",
          icon: "✨",
          title: "Tout illimité",
          description: "Aucune limite, aucune restriction, juste une productivité pure",
        },
        {
          id: "ad-free",
          icon: "🚫",
          title: "Zéro distraction",
          description: "Concentrez-vous sur l'essentiel avec une expérience sans publicité",
        },
        {
          id: "priority",
          icon: "⭐",
          title: "Support VIP",
          description: "Support prioritaire 24/7 de notre équipe d'experts",
        },
        {
          id: "exclusive",
          icon: "🎁",
          title: "Accès anticipé",
          description: "Soyez le premier à essayer les nouvelles fonctionnalités et mises à jour",
        },
      ],
    },
    variant_b: {
      title: "Commencez votre parcours Premium",
      subtitle: "Faites plus, plus rapidement",
      description: "Les membres premium économisent en moyenne 5 heures par semaine",
      ctaButtonText: "Essayer Premium gratuitement",
      socialProofText: "Plus de 50 000 utilisateurs ont mis à niveau ce mois-ci",
    },
    variant_c: {
      title: "Passez à Premium",
      subtitle: "Libérez tout le potentiel",
      description: "Toutes les fonctionnalités. Aucune limite. Annulez à tout moment.",
      showSocialProof: false,
      showTrustBadges: false,
    },
  },
};

/**
 * Get Paywall Config for A/B Test Variant and Language
 */
export const getPaywallConfigForVariant = (
  variant: string,
  language: "en" | "fr" = "en"
): PaywallConfig => {
  const baseConfig = getDefaultPaywallConfig(language);
  const variants = paywallVariantsByLanguage[language] || paywallVariantsByLanguage.en;
  const variantConfig = variants[variant] || variants.control;

  return {
    ...baseConfig,
    ...variantConfig,
    features: variantConfig.features || baseConfig.features,
  };
};
