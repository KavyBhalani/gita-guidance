const fs = require('fs');
const files = fs.readdirSync('src/lib/translations').filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');
const trans = {
  en: "Blog",
  hi: "ब्लॉग",
  gu: "બ્લોગ",
  mr: "ब्लॉग",
  ne: "ब्लग",
  bn: "ব্লগ",
  pa: "ਬਲੌਗ",
  te: "బ్లాగ్",
  ta: "வலைப்பதிவு",
  kn: "ಬ್ಲಾಗ್",
  ml: "ബ്ലോഗ്"
};
for (const file of files) {
  const code = file.replace('.ts', '');
  const content = fs.readFileSync(`src/lib/translations/${file}`, 'utf-8');
  if (!content.includes('blog:')) {
    const word = trans[code] || "Blog";
    const newContent = content.replace(/about:\s*"[^"]+",/, `$&
    blog: "${word}",`);
    fs.writeFileSync(`src/lib/translations/${file}`, newContent);
    console.log(`Updated ${file} with "${word}"`);
  }
}
