import { TextStyle } from '../types';

// Helper to normalize accents for styles that don't support them
const normalizeChar = (char: string): string => {
  return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Core mapping logic
const createMapper = (targetStr: string, useNormalization: boolean = true) => {
  const source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const target = [...targetStr];
  
  return (text: string): string => {
    return [...text].map(char => {
      let index = source.indexOf(char);
      
      if (index === -1 && useNormalization) {
        const base = normalizeChar(char);
        index = source.indexOf(base);
      }
      return index !== -1 && target[index] ? target[index] : char;
    }).join('');
  };
};

// Vaporwave / Fullwidth logic
const toFullWidth = (text: string) => {
  return [...text].map(char => {
    const code = char.codePointAt(0);
    if (!code) return char;
    if (code >= 33 && code <= 126) {
      return String.fromCodePoint(code + 0xFEE0);
    }
    if (code === 32) return '\u3000';
    return char;
  }).join('');
};

// Ransom Note Logic
const toRansomNote = (text: string) => {
  const mappers = [
    createMapper(maps.boldSans),
    createMapper(maps.boldSerif),
    createMapper(maps.monospace),
    createMapper(maps.italicSerif),
    createMapper(maps.inverted),
    createMapper(maps.bubble),
    createMapper(maps.doubleStruck)
  ];
  
  return [...text].map(char => {
    if (char.trim() === '') return char;
    const randomMapper = mappers[Math.floor(Math.random() * mappers.length)];
    return randomMapper(char);
  }).join('');
};

// Decoration Logic: Toggle Mode
// Prevents infinite stacking and allows removal of styles
const toggleDiacritic = (text: string, diacritic: string) => {
  // Check if the text roughly appears to have this diacritic already
  // We check the first few non-whitespace characters
  const sample = text.replace(/\s/g, '');
  const hasDiacritic = sample.length > 0 && sample.includes(diacritic);

  if (hasDiacritic) {
    // REMOVE mode: Strip this specific diacritic
    return text.split(diacritic).join('');
  } else {
    // ADD mode: Add diacritic, but ensure we don't stack if some random chars have it
    // First strip it to be safe, then add it
    const clean = text.split(diacritic).join('');
    return [...clean].map(char => char + diacritic).join('');
  }
};

// Maps definition
const maps = {
  boldSerif: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  boldSans: "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵",
  italicSerif: "𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍0123456789",
  italicSans: "𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡0123456789",
  boldItalicSerif: "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
  boldItalicSans: "𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕0123456789",
  script: "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789",
  boldScript: "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩0123456789",
  fraktur: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅𝔔𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔲𝔳𝔴𝔵𝔶𝔷0123456789",
  boldFraktur: "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅0123456789",
  doubleStruck: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝘅𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
  monospace: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿",
  smallCaps: "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789",
  bubble: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨",
  blackBubble: "🅐𝑩𝓒𝔇🅔𝓕𝔊𝖧🅘𝑱𝓚𝔏𝖬𝓝𝔒𝖯𝑸𝓡𝔖𝖳𝑼𝓥𝔚𝖃𝒀𝔃🅐𝑩𝓒𝔇🅔𝓕𝔊𝖧🅘𝑱𝓚𝔏𝖬𝓝𝔒𝖯𝑸𝓡𝔖𝖳𝑼𝓥𝔚𝖃𝒀𝔃⓿❶❷❸❹❺❻❼❽❾",
  square: "🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789",
  squareBlack: "🅰🅱🅲🅳🅴🅵🅶🅷🅸🉉🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉🅰🅱🅲🅳🅴🅵🅶🅷🅸🉉🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉0123456789",
  inverted: "ɐqɔpǝɟɓɥıɾʞlɯuodbɹsʇnʌʍxʎz∀qƆpƎℲפHIſK˥WNOԀQɹS┴∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86"
};

export const styles: TextStyle[] = [
  { id: 'bold_sans', label: 'Gras (Sans)', category: 'basic', transform: createMapper(maps.boldSans) },
  { id: 'bold_serif', label: 'Gras (Serif)', category: 'serif', transform: createMapper(maps.boldSerif) },
  { id: 'italic_sans', label: 'Italique (Sans)', category: 'basic', transform: createMapper(maps.italicSans) },
  { id: 'italic_serif', label: 'Italique (Serif)', category: 'serif', transform: createMapper(maps.italicSerif) },
  { id: 'bold_italic_sans', label: 'Gras Italique (Sans)', category: 'basic', transform: createMapper(maps.boldItalicSans) },
  { id: 'bold_italic_serif', label: 'Gras Italique (Serif)', category: 'serif', transform: createMapper(maps.boldItalicSerif) },
  { id: 'vaporwave', label: 'Vaporwave', category: 'fancy', transform: toFullWidth },
  { id: 'ransom', label: 'Rançon', category: 'fancy', transform: toRansomNote },
  { id: 'blackboard', label: 'Tableau Noir', category: 'fancy', transform: createMapper(maps.doubleStruck) },
  { id: 'square', label: 'Carré', category: 'fancy', transform: createMapper(maps.square) },
  { id: 'square_black', label: 'Carré Plein', category: 'fancy', transform: createMapper(maps.squareBlack) },
  { id: 'diamonds', label: 'Diamants', category: 'decoration', transform: (t) => [...t].join('♦') },
  { id: 'underline', label: 'Souligné', category: 'decoration', transform: (t) => toggleDiacritic(t, '\u0332') },
  { id: 'double_underline', label: 'Double Souligné', category: 'decoration', transform: (t) => toggleDiacritic(t, '\u0333') },
  { id: 'strikethrough', label: 'Barré', category: 'decoration', transform: (t) => toggleDiacritic(t, '\u0336') },
  { id: 'wave_underline', label: 'Vague', category: 'decoration', transform: (t) => toggleDiacritic(t, '\u0330') },
  { id: 'line_break', label: 'Espacé', category: 'decoration', transform: (t) => [...t].join(' ') },
  { id: 'script', label: 'Manuscrit', category: 'script', transform: createMapper(maps.script) },
  { id: 'bold_script', label: 'Manuscrit Gras', category: 'script', transform: createMapper(maps.boldScript) },
  { id: 'fraktur', label: 'Gothique', category: 'fancy', transform: createMapper(maps.fraktur) },
  { id: 'bold_fraktur', label: 'Gothique Gras', category: 'fancy', transform: createMapper(maps.boldFraktur) },
  { id: 'monospace', label: 'Monospace', category: 'basic', transform: createMapper(maps.monospace) },
  { id: 'small_caps', label: 'Petites Capitales', category: 'fancy', transform: createMapper(maps.smallCaps) },
  { id: 'bubble', label: 'Bulles', category: 'fancy', transform: createMapper(maps.bubble) },
  { id: 'inverted', label: 'Inversé', category: 'fancy', transform: createMapper(maps.inverted, false) },
];

// Clean formatting function (reverse mapping)
export const cleanFormat = (text: string): string => {
  const source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  
  // Construct a giant reverse map
  const reverseMap = new Map<string, string>();
  
  // Exclude styles that reuse standard characters (like Inverted) to avoid corrupting normal text
  const unsafeMaps = ['inverted'];

  Object.entries(maps).forEach(([key, mappedStr]) => {
    if (unsafeMaps.includes(key)) return;

    // We assume mappedStr aligns with source
    [...mappedStr].forEach((char, index) => {
      if (source[index]) {
        reverseMap.set(char, source[index]);
      }
    });
  });
  
  // Add hardcoded diacritics removal
  const diacritics = ['\u0332', '\u0333', '\u0336', '\u0330'];
  
  let cleaned = [...text].map(char => {
      // Handle Fullwidth / Vaporwave manually (unicode offset)
      const code = char.codePointAt(0);
      if (code && code >= 0xFF01 && code <= 0xFF5E) {
        return String.fromCodePoint(code - 0xFEE0);
      }
      if (code === 0x3000) return ' '; // Fullwidth space

      return reverseMap.get(char) || char;
  }).join('');
  
  // Remove diacritics
  diacritics.forEach(d => {
    cleaned = cleaned.split(d).join('');
  });
  
  return cleaned;
};