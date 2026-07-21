import * as fs from 'fs';
import * as path from 'path';

const dir = path.join(__dirname, 'src', 'lib', 'translations');
const enContent = fs.readFileSync(path.join(dir, 'en.ts'), 'utf-8');

// The new keys to inject
const askAddition = `    listen: "Listen",
    chips: {
      anxiety: "I am feeling anxious about the uncertainty of the future. What wisdom does Lord Krishna give in the Gita for calming the mind?",
      grief: "I have lost something dear to me. How can the Gita help me find solace?",
      dilemma: "I am facing a dilemma at work and don't know what is the right action. Guide me.",
      anger: "I am struggling with anger and impatience. How can I master my emotions?",
      purpose: "I feel lost and without purpose. What is my Dharma?",
    },
  },`;

const journalAddition = `    reflectionNotePlaceholder: "Write your personal reflection or spiritual diary note here...",
    saveNote: "Save Note",
    favorites: "Favorites",
    all: "All",
    noteSaved: "Reflection note saved.",
    shareQuoteCard: "Share Quote Card",
    offlineMode: "Offline Mode - Showing cached guidance",
  },`;

const authAddition = `    verifyEmail: "Verify Your Email",
    verifyEmailSubtitle: "We have sent a verification link to your email address. Please verify to access divine guidance.",
    resendLink: "Resend Link",
    iHaveVerified: "I Have Verified",
    useAnotherEmail: "Use Another Email / Sign Out",
    emailNotVerified: "Email is not verified.",
    forgotPassword: "Forgot Password?",
    resetPassword: "Reset Password",
    resetPasswordSubtitle: "Enter your email to receive a password reset link.",
    resetPasswordSent: "Password reset link sent to your email.",
    resetPasswordError: "Failed to send reset link. Please check your email.",
    checkEmailToVerify: "Check your email for the verification link.",
    openEmailApp: "Open Email App",
    pleaseWait: "Please wait before resending.",
  },
};`;

const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'en.ts' && f !== 'types.ts' && f !== 'index.ts');

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // Replace ask end
    content = content.replace(/    seekFurther: (.*?),?\n  },/, '    seekFurther: $1,\n' + askAddition);
    
    // Replace journal end
    content = content.replace(/    shareWisdom: (.*?),?\n  },/, '    shareWisdom: $1,\n' + journalAddition);
    
    // Replace auth end
    content = content.replace(/    googleSignupError: (.*?),?\n  },\n};/, '    googleSignupError: $1,\n' + authAddition);

    fs.writeFileSync(path.join(dir, file), content);
    console.log("Patched", file);
});
