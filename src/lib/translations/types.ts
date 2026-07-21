export type LanguageCode = 
  | "en" 
  | "hi" 
  | "gu" 
  | "mr" 
  | "ne" 
  | "bn" 
  | "pa" 
  | "te" 
  | "ta" 
  | "kn" 
  | "ml";

export interface LanguageInfo {
  id: LanguageCode;
  name: string;
  nativeName: string;
}

export interface TranslationDictionary {
  navbar: {
    title: string;
    home: string;
    guidance: string;
    about: string;
    signIn: string;
    signOut: string;
    seeker: string;
  };
  themeSelector: {
    changeTheme: string;
    cosmicNight: string;
    pureLight: string;
    monasticForest: string;
    sunsetSaffron: string;
  };
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    seekGuidance: string;
    learnMore: string;
  };
  home: {
    featuresTitle: string;
    featuresSubtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    testimonial1Quote: string;
    testimonial1Author: string;
    testimonial2Quote: string;
    testimonial2Author: string;
    testimonial3Quote: string;
    testimonial3Author: string;
    footerDesc: string;
    platform: string;
    seekGuidance: string;
    yourJournal: string;
    aboutUs: string;
    legal: string;
    privacyPolicy: string;
    termsOfService: string;
    rightsReserved: string;
    securedByFirebase: string;
  };
  ask: {
    quotes: string[];
    history: string;
    title: string;
    subtitle: string;
    placeholder: string;
    yourQuestion: string;
    errorMessage: string;
    seekFurther: string;
    listen: string;
    chips: {
      anxiety: string;
      grief: string;
      dilemma: string;
      anger: string;
      purpose: string;
    };
  };
  sidebar: {
    recentGuidance: string;
    signInPrompt: string;
    noGuidancePrompt: string;
    readReflection: string;
    seeAllChats: string;
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    missionTitle: string;
    missionP1: string;
    missionP2: string;
    wisdomTitle: string;
    wisdomP1: string;
    wisdomP2: string;
    techTitle: string;
    techP1: string;
    techP2: string;
    beginJourney: string;
  };
  journal: {
    backToGuidance: string;
    title: string;
    subtitle: string;
    emptyText: string;
    seekGuidance: string;
    readFullGuidance: string;
    share: string;
    delete: string;
    justNow: string;
    copiedAlert: string;
    copyFailedAlert: string;
    deleteFailedAlert: string;
    backToJournal: string;
    reflection: string;
    shareWisdom: string;
    reflectionNotePlaceholder: string;
    saveNote: string;
    favorites: string;
    all: string;
    noteSaved: string;
    shareQuoteCard: string;
    offlineMode: string;
  };
  auth: {
    welcomeBack: string;
    continueJourney: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    passwordMinPlaceholder: string;
    namePlaceholder: string;
    signIn: string;
    createAccount: string;
    beginJourney: string;
    createAccountSubtitle: string;
    orContinueWith: string;
    orSignUpWith: string;
    google: string;
    noAccount: string;
    signUpLink: string;
    hasAccount: string;
    signInLink: string;
    loginError: string;
    googleLoginError: string;
    emailExistsError: string;
    weakPasswordError: string;
    signupError: string;
    googleSignupError: string;
    verifyEmail: string;
    verifyEmailSubtitle: string;
    resendLink: string;
    iHaveVerified: string;
    useAnotherEmail: string;
    emailNotVerified: string;
    forgotPassword: string;
    resetPassword: string;
    resetPasswordSubtitle: string;
    resetPasswordSent: string;
    resetPasswordError: string;
    checkEmailToVerify: string;
    openEmailApp: string;
    pleaseWait: string;
  };
}
