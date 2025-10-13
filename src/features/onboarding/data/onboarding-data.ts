import type { OnboardingData } from "../types";

export const onboardingData: OnboardingData = {
  steps: [
    {
      id: "welcome",
      title: "onboarding.welcome.title",
      subtitle: "onboarding.welcome.subtitle",
      description: "onboarding.welcome.description",
    },
    {
      id: "features",
      title: "onboarding.features.title",
      subtitle: "onboarding.features.subtitle",
      description: "onboarding.features.description",
    },
    {
      id: "customization",
      title: "onboarding.customization.title",
      subtitle: "onboarding.customization.subtitle",
      description: "onboarding.customization.description",
    },
  ],
  questionnaires: [
    {
      id: "questionnaire1",
      title: "onboarding.questionnaire1.title",
      question: "onboarding.questionnaire1.question",
      options: [
        {
          id: "personal",
          label: "onboarding.questionnaire1.options.personal",
          value: "personal",
        },
        {
          id: "work",
          label: "onboarding.questionnaire1.options.work",
          value: "work",
        },
        {
          id: "entertainment",
          label: "onboarding.questionnaire1.options.entertainment",
          value: "entertainment",
        },
        {
          id: "education",
          label: "onboarding.questionnaire1.options.education",
          value: "education",
        },
      ],
    },
    {
      id: "questionnaire2",
      title: "onboarding.questionnaire2.title",
      question: "onboarding.questionnaire2.question",
      options: [
        {
          id: "daily",
          label: "onboarding.questionnaire2.options.daily",
          value: "daily",
        },
        {
          id: "frequent",
          label: "onboarding.questionnaire2.options.frequent",
          value: "frequent",
        },
        {
          id: "moderate",
          label: "onboarding.questionnaire2.options.moderate",
          value: "moderate",
        },
        {
          id: "occasional",
          label: "onboarding.questionnaire2.options.occasional",
          value: "occasional",
        },
      ],
    },
  ],
};
