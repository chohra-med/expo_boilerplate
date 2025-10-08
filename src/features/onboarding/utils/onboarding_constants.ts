export interface QuestionnaireStep {
  stepId: string;
  stepTitle: string;
  stepOptions: QuestionnaireOption[];
  multiple: boolean;
  isSkippable: boolean;
  hasOtherOption?: boolean;
  otherOptionPlaceholder?: string;
}

export interface QuestionnaireOption {
  id: string;
  label: string;
  value: string;
}

export interface OnboardingQuestionnaire {
  en: QuestionnaireStep[];
  fr: QuestionnaireStep[];
}

export const ONBOARDING_QUESTIONNAIRE: OnboardingQuestionnaire = {
  en: [
    {
      stepId: 'primary_use_case',
      stepTitle: 'What is your primary use case for this app?',
      stepOptions: [
        { id: 'personal', label: 'Personal use', value: 'personal' },
        { id: 'work', label: 'Work productivity', value: 'work' },
        { id: 'entertainment', label: 'Entertainment', value: 'entertainment' },
        { id: 'education', label: 'Education & Learning', value: 'education' },
        { id: 'fitness', label: 'Health & Fitness', value: 'fitness' },
        { id: 'social', label: 'Social & Communication', value: 'social' },
      ],
      multiple: false,
      isSkippable: true,
    },
    {
      stepId: 'app_usage_frequency',
      stepTitle: 'How often do you use mobile apps?',
      stepOptions: [
        { id: 'multiple_daily', label: 'Multiple times daily', value: 'multiple_daily' },
        { id: 'once_daily', label: 'Once or twice daily', value: 'once_daily' },
        { id: 'few_weekly', label: 'A few times a week', value: 'few_weekly' },
        { id: 'occasionally', label: 'Occasionally', value: 'occasionally' },
        { id: 'rarely', label: 'Rarely', value: 'rarely' },
      ],
      multiple: false,
      isSkippable: true,
    },
    {
      stepId: 'interests',
      stepTitle: 'What are your main interests? (Select all that apply)',
      stepOptions: [
        { id: 'technology', label: 'Technology & Innovation', value: 'technology' },
        { id: 'business', label: 'Business & Finance', value: 'business' },
        { id: 'lifestyle', label: 'Lifestyle & Wellness', value: 'lifestyle' },
        { id: 'creative', label: 'Creative & Arts', value: 'creative' },
        { id: 'sports', label: 'Sports & Fitness', value: 'sports' },
        { id: 'travel', label: 'Travel & Adventure', value: 'travel' },
        { id: 'gaming', label: 'Gaming', value: 'gaming' },
        { id: 'news', label: 'News & Current Events', value: 'news' },
        { id: 'other', label: 'Other', value: 'other' },
      ],
      multiple: true,
      isSkippable: true,
      hasOtherOption: true,
      otherOptionPlaceholder: 'Please specify your interests...',
    },
    {
      stepId: 'notification_preferences',
      stepTitle: 'How would you like to receive notifications?',
      stepOptions: [
        { id: 'all', label: 'All notifications', value: 'all' },
        { id: 'important', label: 'Important only', value: 'important' },
        { id: 'minimal', label: 'Minimal notifications', value: 'minimal' },
        { id: 'none', label: 'No notifications', value: 'none' },
        { id: 'other', label: 'Other', value: 'other' },
      ],
      multiple: false,
      isSkippable: true,
      hasOtherOption: true,
      otherOptionPlaceholder: 'Please specify your notification preferences...',
    },
  ],
  fr: [
    {
      stepId: 'primary_use_case',
      stepTitle: "Quel est votre cas d'usage principal pour cette application ?",
      stepOptions: [
        { id: 'personal', label: 'Usage personnel', value: 'personal' },
        { id: 'work', label: 'Productivité au travail', value: 'work' },
        { id: 'entertainment', label: 'Divertissement', value: 'entertainment' },
        { id: 'education', label: 'Éducation et apprentissage', value: 'education' },
        { id: 'fitness', label: 'Santé et fitness', value: 'fitness' },
        { id: 'social', label: 'Social et communication', value: 'social' },
      ],
      multiple: false,
      isSkippable: true,
    },
    {
      stepId: 'app_usage_frequency',
      stepTitle: 'À quelle fréquence utilisez-vous les applications mobiles ?',
      stepOptions: [
        { id: 'multiple_daily', label: 'Plusieurs fois par jour', value: 'multiple_daily' },
        { id: 'once_daily', label: 'Une ou deux fois par jour', value: 'once_daily' },
        { id: 'few_weekly', label: 'Quelques fois par semaine', value: 'few_weekly' },
        { id: 'occasionally', label: 'Occasionnellement', value: 'occasionally' },
        { id: 'rarely', label: 'Rarement', value: 'rarely' },
      ],
      multiple: false,
      isSkippable: true,
    },
    {
      stepId: 'interests',
      stepTitle:
        "Quels sont vos principaux centres d'intérêt ? (Sélectionnez tout ce qui s'applique)",
      stepOptions: [
        { id: 'technology', label: 'Technologie et innovation', value: 'technology' },
        { id: 'business', label: 'Business et finance', value: 'business' },
        { id: 'lifestyle', label: 'Mode de vie et bien-être', value: 'lifestyle' },
        { id: 'creative', label: 'Créatif et arts', value: 'creative' },
        { id: 'sports', label: 'Sports et fitness', value: 'sports' },
        { id: 'travel', label: 'Voyage et aventure', value: 'travel' },
        { id: 'gaming', label: 'Jeux', value: 'gaming' },
        { id: 'news', label: 'Actualités et événements', value: 'news' },
        { id: 'other', label: 'Autre', value: 'other' },
      ],
      multiple: true,
      isSkippable: true,
      hasOtherOption: true,
      otherOptionPlaceholder: "Veuillez préciser vos centres d'intérêt...",
    },
    {
      stepId: 'notification_preferences',
      stepTitle: 'Comment souhaitez-vous recevoir les notifications ?',
      stepOptions: [
        { id: 'all', label: 'Toutes les notifications', value: 'all' },
        { id: 'important', label: 'Important seulement', value: 'important' },
        { id: 'minimal', label: 'Notifications minimales', value: 'minimal' },
        { id: 'none', label: 'Aucune notification', value: 'none' },
        { id: 'other', label: 'Autre', value: 'other' },
      ],
      multiple: false,
      isSkippable: true,
      hasOtherOption: true,
      otherOptionPlaceholder: 'Veuillez préciser vos préférences de notification...',
    },
  ],
};

export const getQuestionnaireByLanguage = (language: 'en' | 'fr'): QuestionnaireStep[] => {
  return ONBOARDING_QUESTIONNAIRE[language];
};
