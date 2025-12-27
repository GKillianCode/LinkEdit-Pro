import { TextStyle } from '../types';

// Helper to generate a sequence of Unicode characters from a starting point
const genRange = (start: number, length: number): string[] => {
  return Array.from({ length }, (_, i) => String.fromCodePoint(start + i));
};

const normalizeChar = (char: string): string => {
  return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

/**
 * Robust Mapper
 * Instead of index-based string mapping, we use direct character code ranges
 * to ensure lowercase stays lowercase and uppercase stays uppercase.
 */
const createSafeMapper = (lower: string[], upper: string[], digits: string[], useNormalization = true) => {
  return (text: string): string => {
    return Array.from(text).map(char => {
      const code = char.charCodeAt(0);
      
      // a-z: 97-122
      if (code >= 97 && code <= 122) return lower[code - 97] || char;
      // A-Z: 65-90
      if (code >= 65 && code <= 90) return upper[code - 65] || char;
      // 0-9: 48-57
      if (code >= 48 && code <= 57) return digits[code - 48] || char;

      // Handle accented characters
      if (useNormalization) {
        const norm = normalizeChar(char);
        if (norm !== char) {
          const nCode = norm.charCodeAt(0);
          if (nCode >= 97 && nCode <= 122) return lower[nCode - 97] || char;
          if (nCode >= 65 && nCode <= 90) return upper[nCode - 65] || char;
        }
      }
      
      return char;
    }).join('');
  };
};

/**
 * UNICODE DEFINITIONS
 */

// Bold Sans-Serif (The most readable for LinkedIn titles)
const boldSansLower = genRange(0x1D5EE, 26); // a-z
const boldSansUpper = genRange(0x1D5D4, 26); // A-Z
const boldSansDigits = genRange(0x1D7EC, 10); // 0-9

// Bold Serif
const boldSerifLower = genRange(0x1D41A, 26);
const boldSerifUpper = genRange(0x1D400, 26);
const boldSerifDigits = genRange(0x1D7CE, 10);

// Italic Sans
const italicSansLower = genRange(0x1D656, 26);
const italicSansUpper = genRange(0x1D63C, 26);
const standardDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Bold Italic Sans
const boldItalicSansLower = genRange(0x1D68A, 26);
const boldItalicSansUpper = genRange(0x1D670, 26);

// Monospace (Clean, no spaces)
const monoLower = genRange(0x1D68A + 208, 26); // 1D756
const monoUpper = genRange(0x1D670 + 208, 26); // 1D73C
const monoDigits = genRange(0x1D7F6, 10);

// Script / Cursive (Handle missing chars in Unicode ranges)
const scriptLower = Array.from("𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏");
const scriptUpper = Array.from("𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵");

// Small Caps (Only lowercase mapping)
const smallCapsLower = Array.from("ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ");
const smallCapsUpper = Array.from("ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ");

// Superscript
const superLower = Array.from("ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ");
const superUpper = Array.from("ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾ︦ᴿˢᵀᵁⱽᵂˣʸᶻ");
const superDigits = Array.from("⁰¹²³⁴⁵⁶⁷⁸⁹");

export const styles: TextStyle[] = [
  { id: 'bold_sans', label: 'Gras (Sans)', category: 'basic', transform: createSafeMapper(boldSansLower, boldSansUpper, boldSansDigits) },
  { id: 'bold_serif', label: 'Gras (Serif)', category: 'serif', transform: createSafeMapper(boldSerifLower, boldSerifUpper, boldSerifDigits) },
  { id: 'italic_sans', label: 'Italique', category: 'basic', transform: createSafeMapper(italicSansLower, italicSansUpper, standardDigits) },
  { id: 'bold_italic_sans', label: 'Gras Italique', category: 'basic', transform: createSafeMapper(boldItalicSansLower, boldItalicSansUpper, standardDigits) },
  { id: 'script', label: 'Manuscrit', category: 'script', transform: createSafeMapper(scriptLower, scriptUpper, standardDigits) },
  { id: 'monospace', label: 'Code', category: 'basic', transform: createSafeMapper(monoLower, monoUpper, monoDigits) },
  { id: 'small_caps', label: 'Petites Caps', category: 'fancy', transform: createSafeMapper(smallCapsLower, smallCapsUpper, standardDigits) },
  { id: 'superscript', label: 'Exposant', category: 'decoration', transform: createSafeMapper(superLower, superUpper, superDigits) },
  { id: 'underline', label: 'Souligné', category: 'decoration', transform: (t) => Array.from(t).map(c => c + '\u0332').join('') },
  { id: 'strikethrough', label: 'Barré', category: 'decoration', transform: (t) => Array.from(t).map(c => c + '\u0336').join('') },
];

/**
 * Reverses all transformations to get back to original text
 */
export const cleanFormat = (text: string): string => {
  const sourceChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const reverseMap = new Map<string, string>();

  const register = (lower: string[], upper: string[], digits: string[]) => {
    lower.forEach((c, i) => reverseMap.set(c, sourceChars[i]));
    upper.forEach((c, i) => reverseMap.set(c, sourceChars[26 + i]));
    digits.forEach((c, i) => reverseMap.set(c, sourceChars[52 + i]));
  };

  register(boldSansLower, boldSansUpper, boldSansDigits);
  register(boldSerifLower, boldSerifUpper, boldSerifDigits);
  register(italicSansLower, italicSansUpper, standardDigits);
  register(boldItalicSansLower, boldItalicSansUpper, standardDigits);
  register(monoLower, monoUpper, monoDigits);
  register(scriptLower, scriptUpper, standardDigits);
  register(smallCapsLower, smallCapsUpper, standardDigits);
  register(superLower, superUpper, superDigits);
  
  const diacritics = ['\u0332', '\u0333', '\u0336', '\u0330'];
  let cleaned = Array.from(text).map(char => reverseMap.get(char) || char).join('');
  
  diacritics.forEach(d => {
    cleaned = cleaned.split(d).join('');
  });
  
  return cleaned;
};