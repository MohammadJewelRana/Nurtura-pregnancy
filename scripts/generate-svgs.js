const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'images', 'baby-comparisons');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const svgs = {
  'poppy-seed': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="ps-bg" cx="38%" cy="32%" r="65%">
      <stop offset="0%" stop-color="#4A5568" />
      <stop offset="45%" stop-color="#2D3748" />
      <stop offset="100%" stop-color="#1A202C" />
    </radialGradient>
    <filter id="ps-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Tiny seed representation with glow ring indicating microscopic scale -->
  <circle cx="60" cy="60" r="44" fill="#00C99A" opacity="0.08" />
  <circle cx="60" cy="60" r="32" fill="#00C99A" opacity="0.15" />
  <!-- Poppy seed body (kidney shaped) -->
  <path d="M52 42 C64 36, 76 44, 76 56 C76 68, 66 76, 54 74 C44 72, 40 60, 44 50 C46 45, 49 43, 52 42 Z"
        fill="url(#ps-bg)" filter="url(#ps-shadow)" />
  <path d="M54 45 C60 41, 68 47, 68 54 C68 58, 64 62, 58 61 C53 60, 50 54, 52 48"
        stroke="#718096" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.4" />
  <circle cx="56" cy="48" r="3" fill="#E2E8F0" opacity="0.7" />
  <circle cx="70" cy="66" r="6" fill="url(#ps-bg)" />
</svg>`,

  'egg-cell': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="egg-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00C99A" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#00E5AE" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#00C99A" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="zona" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#A7F3D0" />
      <stop offset="40%" stop-color="#34D399" />
      <stop offset="85%" stop-color="#059669" />
      <stop offset="100%" stop-color="#064E3B" />
    </radialGradient>
    <radialGradient id="nucleus" cx="35%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#FDE047" />
      <stop offset="80%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </radialGradient>
    <filter id="egg-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#059669" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Ambient field -->
  <circle cx="60" cy="60" r="54" fill="url(#egg-glow)" />
  <!-- Corona Radiata halo ring -->
  <circle cx="60" cy="60" r="44" stroke="#34D399" stroke-width="2.5" stroke-dasharray="4 3" opacity="0.6" fill="none" />
  <!-- Zona Pellucida membrane -->
  <circle cx="60" cy="60" r="38" fill="url(#zona)" filter="url(#egg-shadow)" />
  <!-- Cytoplasm ring -->
  <circle cx="60" cy="60" r="32" fill="#065F46" opacity="0.5" />
  <!-- Cell Nucleus -->
  <circle cx="56" cy="56" r="16" fill="url(#nucleus)" />
  <circle cx="52" cy="52" r="4" fill="#FFFFFF" opacity="0.8" />
  <circle cx="64" cy="62" r="2.5" fill="#FEF08A" opacity="0.9" />
</svg>`,

  'vanilla-seed': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="pod-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3E2723" />
      <stop offset="40%" stop-color="#1B0F0B" />
      <stop offset="100%" stop-color="#0D0705" />
    </linearGradient>
    <radialGradient id="v-spec" cx="40%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#8D6E63" />
      <stop offset="100%" stop-color="#2D1B15" />
    </radialGradient>
  </defs>
  <!-- Pod curved branch -->
  <path d="M22 96 C36 82, 54 48, 86 26 C94 20, 102 20, 100 24 C84 56, 60 88, 30 102 C24 105, 20 100, 22 96 Z"
        fill="url(#pod-grad)" />
  <!-- Glistening seeds inside split pod -->
  <path d="M42 78 C54 62, 70 45, 84 34" stroke="#5D4037" stroke-width="4" stroke-linecap="round" fill="none" />
  <circle cx="48" cy="72" r="2.5" fill="#110A07" stroke="#8D6E63" stroke-width="0.5" />
  <circle cx="56" cy="64" r="2" fill="#0D0705" stroke="#A1887F" stroke-width="0.5" />
  <circle cx="62" cy="56" r="2.5" fill="#1A110D" stroke="#8D6E63" stroke-width="0.5" />
  <circle cx="70" cy="48" r="2" fill="#0A0604" stroke="#BCAAA4" stroke-width="0.5" />
  <circle cx="78" cy="40" r="2.2" fill="#180E0A" stroke="#8D6E63" stroke-width="0.5" />
  <!-- Highlighting spark -->
  <circle cx="55" cy="63" r="0.8" fill="#FFF" />
  <circle cx="69" cy="47" r="0.8" fill="#FFF" />
</svg>`,

  'apple-seed': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="seed-base" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#D7CCC8" />
      <stop offset="25%" stop-color="#6D4C41" />
      <stop offset="60%" stop-color="#3E2723" />
      <stop offset="100%" stop-color="#1B0000" />
    </linearGradient>
    <filter id="seed-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Background glow circle -->
  <circle cx="60" cy="60" r="42" fill="#E2E8F0" opacity="0.05" />
  <!-- Apple seed teardrop shape -->
  <path d="M60 22 C64 36, 82 56, 80 74 C78 90, 68 98, 60 98 C52 98, 42 90, 40 74 C38 56, 56 36, 60 22 Z"
        fill="url(#seed-base)" filter="url(#seed-shadow)" />
  <!-- Glossy curved reflection -->
  <path d="M68 45 C75 56, 75 72, 70 82" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.45" />
  <!-- Tip apex tint -->
  <polygon points="60,22 57,28 63,28" fill="#EFEBE9" />
</svg>`,

  'sweet-pea': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="pea-pod" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#86EFAC" />
      <stop offset="45%" stop-color="#22C55E" />
      <stop offset="100%" stop-color="#15803D" />
    </linearGradient>
    <radialGradient id="pea-ball" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#BBF7D0" />
      <stop offset="40%" stop-color="#4ADE80" />
      <stop offset="90%" stop-color="#16A34A" />
      <stop offset="100%" stop-color="#14532D" />
    </radialGradient>
    <filter id="pea-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#14532D" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Pea pod shell behind -->
  <path d="M18 92 C32 94, 60 96, 94 66 C102 58, 108 42, 104 36 C98 34, 82 46, 62 60 C38 76, 22 84, 18 92 Z"
        fill="url(#pea-pod)" filter="url(#pea-shadow)" />
  <!-- 3 plump sweet peas in pod -->
  <circle cx="48" cy="74" r="13" fill="url(#pea-ball)" />
  <circle cx="44" cy="70" r="3" fill="#FFF" opacity="0.6" />
  
  <circle cx="68" cy="60" r="12" fill="url(#pea-ball)" />
  <circle cx="64" cy="56" r="3" fill="#FFF" opacity="0.6" />

  <circle cx="86" cy="46" r="10.5" fill="url(#pea-ball)" />
  <circle cx="83" cy="43" r="2.5" fill="#FFF" opacity="0.6" />

  <!-- Pod calyx stem -->
  <path d="M18 92 C14 96, 12 102, 10 106" stroke="#166534" stroke-width="3" stroke-linecap="round" fill="none" />
</svg>`,

  'blueberry': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bb-skin" cx="38%" cy="32%" r="65%">
      <stop offset="0%" stop-color="#818CF8" />
      <stop offset="35%" stop-color="#4F46E5" />
      <stop offset="70%" stop-color="#312E81" />
      <stop offset="100%" stop-color="#1E1B4B" />
    </radialGradient>
    <filter id="bb-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1E1B4B" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Large main blueberry -->
  <circle cx="58" cy="62" r="38" fill="url(#bb-skin)" filter="url(#bb-shadow)" />
  <!-- Calyx crown indentation -->
  <ellipse cx="58" cy="38" rx="14" ry="7" fill="#1E1B4B" />
  <polygon points="58,33 62,37 66,32 65,38 71,38 66,41 68,46 63,43 59,47 57,41 52,44 54,39 49,37 54,36" fill="#312E81" stroke="#4338CA" stroke-width="0.8" />
  <circle cx="58" cy="38" r="3.5" fill="#0F172A" />
  <!-- Waxy bloom highlight -->
  <path d="M38 52 C34 64, 40 78, 52 86" stroke="#A5B4FC" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.35" />
  <circle cx="44" cy="48" r="3" fill="#E0E7FF" opacity="0.5" />
</svg>`,

  'raspberry': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="drupelet" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FB7185" />
      <stop offset="45%" stop-color="#E11D48" />
      <stop offset="90%" stop-color="#881337" />
      <stop offset="100%" stop-color="#4C0519" />
    </radialGradient>
    <filter id="rb-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#4C0519" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Cluster of drupelets -->
  <g filter="url(#rb-shadow)">
    <!-- Bottom row -->
    <circle cx="60" cy="88" r="9" fill="url(#drupelet)" />
    <!-- Row 4 -->
    <circle cx="48" cy="80" r="9.5" fill="url(#drupelet)" />
    <circle cx="72" cy="80" r="9.5" fill="url(#drupelet)" />
    <!-- Row 3 -->
    <circle cx="38" cy="68" r="10" fill="url(#drupelet)" />
    <circle cx="60" cy="71" r="10" fill="url(#drupelet)" />
    <circle cx="82" cy="68" r="10" fill="url(#drupelet)" />
    <!-- Row 2 -->
    <circle cx="34" cy="53" r="10" fill="url(#drupelet)" />
    <circle cx="52" cy="55" r="10" fill="url(#drupelet)" />
    <circle cx="70" cy="55" r="10" fill="url(#drupelet)" />
    <circle cx="86" cy="53" r="10" fill="url(#drupelet)" />
    <!-- Top row -->
    <circle cx="42" cy="40" r="9.5" fill="url(#drupelet)" />
    <circle cx="60" cy="42" r="9.5" fill="url(#drupelet)" />
    <circle cx="78" cy="40" r="9.5" fill="url(#drupelet)" />
  </g>
  <!-- Green leafy calyx on top -->
  <path d="M60 22 C62 30, 60 34, 60 38" stroke="#15803D" stroke-width="3" stroke-linecap="round" fill="none" />
  <polygon points="60,35 48,30 52,38 38,38 48,43 60,40 72,43 82,38 68,38 72,30" fill="#22C55E" />
</svg>`,

  'green-olive': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="olive-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#BEF264" />
      <stop offset="40%" stop-color="#84CC16" />
      <stop offset="75%" stop-color="#4D7C0F" />
      <stop offset="100%" stop-color="#365314" />
    </radialGradient>
    <filter id="ol-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1A2E05" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Olive Leaf -->
  <path d="M64 36 C74 24, 96 22, 102 24 C100 36, 86 46, 70 42 Z" fill="#4D7C0F" stroke="#365314" stroke-width="1" />
  <!-- Olive Stem -->
  <path d="M58 48 C56 34, 64 26, 68 22" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Oval Olive Fruit tilted -->
  <g transform="rotate(-18 60 68)" filter="url(#ol-shadow)">
    <ellipse cx="60" cy="68" rx="26" ry="38" fill="url(#olive-skin)" />
    <!-- Shiny specular reflection -->
    <ellipse cx="48" cy="52" rx="6" ry="14" fill="#FFFFFF" opacity="0.45" transform="rotate(-15 48 52)" />
    <circle cx="50" cy="46" r="3" fill="#FFFFFF" opacity="0.75" />
  </g>
</svg>`,

  'prune': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="prune-skin" cx="32%" cy="28%" r="70%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="30%" stop-color="#4C1D95" />
      <stop offset="70%" stop-color="#2E1065" />
      <stop offset="100%" stop-color="#0F051D" />
    </radialGradient>
    <filter id="pr-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Wrinkled Dried Prune shape -->
  <path d="M54 28 C74 25, 92 40, 90 64 C88 86, 76 96, 56 94 C38 92, 28 80, 28 58 C28 40, 40 30, 54 28 Z"
        fill="url(#prune-skin)" filter="url(#pr-shadow)" />
  <!-- Wrinkle folds & texture -->
  <path d="M46 36 C42 48, 44 64, 48 78" stroke="#581C87" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />
  <path d="M60 38 C64 54, 62 70, 58 84" stroke="#581C87" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6" />
  <path d="M72 44 C76 56, 74 72, 70 82" stroke="#3B0764" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.8" />
  <!-- Highlighting gloss -->
  <path d="M38 44 C35 52, 35 62, 38 70" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.4" />
</svg>`,

  'lime': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="lime-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#A3E635" />
      <stop offset="45%" stop-color="#65A30D" />
      <stop offset="85%" stop-color="#3F6212" />
      <stop offset="100%" stop-color="#1A2E05" />
    </radialGradient>
    <filter id="lime-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1A2E05" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Leaf -->
  <path d="M68 34 C82 22, 102 24, 106 28 C104 42, 88 48, 74 42 Z" fill="#4D7C0F" />
  <!-- Stem -->
  <path d="M58 40 C58 30, 64 24, 68 20" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Lime sphere with subtle citrus tip -->
  <path d="M60 32 C78 32, 94 46, 94 66 C94 84, 80 98, 60 98 C40 98, 26 84, 26 66 C26 46, 42 32, 60 32 Z"
        fill="url(#lime-skin)" filter="url(#lime-shadow)" />
  <circle cx="60" cy="33" r="2.5" fill="#365314" />
  <!-- Gloss highlight -->
  <ellipse cx="46" cy="50" rx="8" ry="14" fill="#FFFFFF" opacity="0.3" transform="rotate(-20 46 50)" />
  <circle cx="48" cy="46" r="3" fill="#FFFFFF" opacity="0.6" />
</svg>`,

  'plum': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="plum-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#C084FC" />
      <stop offset="35%" stop-color="#9333EA" />
      <stop offset="70%" stop-color="#6B21A8" />
      <stop offset="100%" stop-color="#3B0764" />
    </radialGradient>
    <filter id="plum-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#3B0764" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Leaf -->
  <path d="M60 28 C74 16, 92 18, 98 24 C94 36, 80 40, 68 34 Z" fill="#15803D" />
  <!-- Stem -->
  <path d="M56 34 C54 22, 60 16, 62 12" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Plum heart-round shape with cleft -->
  <path d="M58 34 C74 30, 92 46, 92 68 C92 88, 76 98, 60 98 C44 98, 28 88, 28 68 C28 46, 44 30, 58 34 Z"
        fill="url(#plum-skin)" filter="url(#plum-shadow)" />
  <!-- Vertical cleft line -->
  <path d="M58 36 C55 52, 55 76, 59 96" stroke="#4C1D95" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5" />
  <!-- Velvety highlight -->
  <ellipse cx="44" cy="52" rx="7" ry="14" fill="#E9D5FF" opacity="0.35" transform="rotate(-15 44 52)" />
  <circle cx="46" cy="48" r="3" fill="#FFF" opacity="0.6" />
</svg>`,

  'lemon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="lemon-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="45%" stop-color="#FACC15" />
      <stop offset="85%" stop-color="#CA8A04" />
      <stop offset="100%" stop-color="#854D0E" />
    </radialGradient>
    <filter id="lem-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#713F12" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Green leaf -->
  <path d="M72 32 C88 20, 106 24, 110 30 C106 44, 90 48, 76 40 Z" fill="#22C55E" />
  <!-- Lemon stem -->
  <path d="M66 36 C64 26, 68 20, 72 16" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Lemon tilted with characteristic pointy ends -->
  <g transform="rotate(-25 60 64)" filter="url(#lem-shadow)">
    <path d="M60 22 C78 28, 94 44, 94 64 C94 84, 78 100, 60 106 C42 100, 26 84, 26 64 C26 44, 42 28, 60 22 Z"
          fill="url(#lemon-skin)" />
    <!-- Pointy tip nubs -->
    <path d="M60 22 C59 18, 61 18, 60 22 Z" stroke="#CA8A04" stroke-width="2" />
    <path d="M60 106 C59 110, 61 110, 60 106 Z" stroke="#854D0E" stroke-width="2" />
    <!-- Glossy sheen -->
    <ellipse cx="44" cy="52" rx="7" ry="18" fill="#FFFFFF" opacity="0.4" transform="rotate(-15 44 52)" />
    <circle cx="45" cy="46" r="3.5" fill="#FFFFFF" opacity="0.8" />
  </g>
</svg>`,

  'peach': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="peach-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="35%" stop-color="#FB923C" />
      <stop offset="70%" stop-color="#F43F5E" />
      <stop offset="100%" stop-color="#BE123C" />
    </radialGradient>
    <filter id="pch-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#881337" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Fresh leaf -->
  <path d="M58 26 C76 12, 98 16, 102 24 C96 38, 80 40, 66 34 Z" fill="#22C55E" />
  <path d="M66 34 C80 26, 92 22, 102 24" stroke="#15803D" stroke-width="1" fill="none" />
  <!-- Stem -->
  <path d="M54 32 C52 20, 56 14, 58 10" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Peach heart shape -->
  <path d="M56 34 C72 30, 92 46, 92 68 C92 90, 76 98, 60 98 C44 98, 28 90, 28 68 C28 46, 44 30, 56 34 Z"
        fill="url(#peach-skin)" filter="url(#pch-shadow)" />
  <!-- Indented cleft groove -->
  <path d="M56 34 C52 50, 52 74, 58 96" stroke="#9F1239" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.45" />
  <!-- Soft velvety peach blush highlight -->
  <circle cx="46" cy="52" r="14" fill="#FFEDD5" opacity="0.4" />
  <circle cx="44" cy="48" r="4" fill="#FFFFFF" opacity="0.6" />
</svg>`,

  'apple': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="apple-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FCA5A5" />
      <stop offset="35%" stop-color="#EF4444" />
      <stop offset="75%" stop-color="#B91C1C" />
      <stop offset="100%" stop-color="#7F1D1D" />
    </radialGradient>
    <filter id="app-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#7F1D1D" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Leaf -->
  <path d="M60 26 C76 12, 96 16, 102 22 C96 36, 80 38, 68 32 Z" fill="#22C55E" />
  <!-- Stem -->
  <path d="M58 32 C58 20, 66 12, 70 8" stroke="#78350F" stroke-width="3" stroke-linecap="round" fill="none" />
  <!-- Apple body with top dip -->
  <path d="M58 36 C68 32, 94 40, 94 68 C94 92, 76 100, 60 100 C44 100, 26 92, 26 68 C26 40, 50 32, 58 36 Z"
        fill="url(#apple-skin)" filter="url(#app-shadow)" />
  <!-- Top indentation cavity -->
  <ellipse cx="58" cy="36" rx="8" ry="3" fill="#7F1D1D" />
  <!-- Crisp highlight -->
  <ellipse cx="42" cy="54" rx="7" ry="16" fill="#FFFFFF" opacity="0.45" transform="rotate(-20 42 54)" />
  <circle cx="44" cy="46" r="3.5" fill="#FFFFFF" opacity="0.8" />
</svg>`,

  'avocado': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="avo-skin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532D" />
      <stop offset="100%" stop-color="#052E16" />
    </linearGradient>
    <radialGradient id="avo-flesh" cx="50%" cy="60%" r="55%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="55%" stop-color="#A3E635" />
      <stop offset="85%" stop-color="#65A30D" />
      <stop offset="100%" stop-color="#3F6212" />
    </radialGradient>
    <radialGradient id="avo-pit" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#A16207" />
      <stop offset="50%" stop-color="#78350F" />
      <stop offset="100%" stop-color="#451A03" />
    </radialGradient>
    <filter id="avo-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#052E16" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Half avocado sliced open -->
  <!-- Outer skin rim -->
  <path d="M60 20 C76 20, 92 48, 92 76 C92 94, 78 104, 60 104 C42 104, 28 94, 28 76 C28 48, 44 20, 60 20 Z"
        fill="url(#avo-skin)" filter="url(#avo-shadow)" />
  <!-- Creamy green flesh -->
  <path d="M60 24 C73 24, 87 49, 87 75 C87 91, 75 100, 60 100 C45 100, 33 91, 33 75 C33 49, 47 24, 60 24 Z"
        fill="url(#avo-flesh)" />
  <!-- Glossy brown seed / pit -->
  <circle cx="60" cy="74" r="18" fill="url(#avo-pit)" />
  <ellipse cx="54" cy="68" rx="4" ry="7" fill="#FFFFFF" opacity="0.45" transform="rotate(-20 54 68)" />
  <circle cx="55" cy="65" r="2" fill="#FFFFFF" opacity="0.8" />
</svg>`,

  'pomegranate': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="pom-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#F43F5E" />
      <stop offset="40%" stop-color="#E11D48" />
      <stop offset="80%" stop-color="#9F1239" />
      <stop offset="100%" stop-color="#4C0519" />
    </radialGradient>
    <filter id="pom-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#4C0519" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Crown / calyx on top -->
  <polygon points="60,18 64,28 72,20 70,30 80,26 74,34 60,34 46,34 40,26 50,30 48,20 56,28" fill="#9F1239" stroke="#4C0519" stroke-width="1" />
  <!-- Round ruby pomegranate body -->
  <path d="M60 32 C78 30, 94 46, 94 68 C94 90, 78 102, 60 102 C42 102, 26 90, 26 68 C26 46, 42 30, 60 32 Z"
        fill="url(#pom-skin)" filter="url(#pom-shadow)" />
  <!-- Natural angular faceted contours -->
  <path d="M42 46 C38 60, 42 80, 52 92" stroke="#FDA4AF" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.35" />
  <circle cx="45" cy="50" r="3.5" fill="#FFFFFF" opacity="0.6" />
</svg>`,

  'bell-pepper': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="pepper-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#F87171" />
      <stop offset="40%" stop-color="#DC2626" />
      <stop offset="80%" stop-color="#991B1B" />
      <stop offset="100%" stop-color="#450A0A" />
    </radialGradient>
    <filter id="pep-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#450A0A" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Thick curved green stem -->
  <path d="M60 34 C60 20, 66 12, 74 10 C76 12, 74 16, 68 20 C64 24, 64 30, 64 34" stroke="#15803D" stroke-width="5" stroke-linecap="round" fill="none" />
  <!-- Calyx green star cap -->
  <ellipse cx="60" cy="34" rx="14" ry="5" fill="#16A34A" />
  <!-- 3 plump lobes of the bell pepper -->
  <g filter="url(#pep-shadow)">
    <!-- Center lobe -->
    <path d="M48 34 C54 32, 66 32, 72 34 C78 48, 76 84, 68 96 C62 98, 58 98, 52 96 C44 84, 42 48, 48 34 Z" fill="url(#pepper-skin)" />
    <!-- Left lobe -->
    <path d="M48 34 C36 38, 26 52, 26 70 C26 84, 36 94, 52 96 C46 82, 44 54, 48 34 Z" fill="url(#pepper-skin)" opacity="0.95" />
    <!-- Right lobe -->
    <path d="M72 34 C84 38, 94 52, 94 70 C94 84, 84 94, 68 96 C74 82, 76 54, 72 34 Z" fill="url(#pepper-skin)" opacity="0.95" />
  </g>
  <!-- Glossy vertical reflections -->
  <path d="M38 52 C36 64, 38 76, 42 84" stroke="#FECACA" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5" />
  <circle cx="40" cy="50" r="3" fill="#FFFFFF" opacity="0.8" />
</svg>`,

  'mango': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="mango-grad" x1="15%" y1="15%" x2="85%" y2="85%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="70%" stop-color="#EA580C" />
      <stop offset="100%" stop-color="#BE123C" />
    </linearGradient>
    <filter id="mgo-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#7C2D12" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Mango Leaf -->
  <path d="M60 24 C76 14, 98 18, 104 26 C98 38, 80 42, 66 32 Z" fill="#15803D" />
  <!-- Stem -->
  <path d="M58 28 C56 18, 62 12, 64 8" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Mango kidney curve with characteristic beak -->
  <path d="M56 28 C74 24, 94 40, 94 66 C94 88, 76 102, 54 102 C38 102, 28 88, 30 68 C32 50, 42 32, 56 28 Z"
        fill="url(#mango-grad)" filter="url(#mgo-shadow)" />
  <!-- Highlighting shine -->
  <path d="M44 44 C40 56, 44 74, 52 84" stroke="#FEF08A" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.45" />
  <circle cx="48" cy="42" r="3.5" fill="#FFFFFF" opacity="0.75" />
</svg>`,

  'banana': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="ban-skin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="50%" stop-color="#FACC15" />
      <stop offset="100%" stop-color="#EAB308" />
    </linearGradient>
    <filter id="ban-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#713F12" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Banana curved arc -->
  <path d="M26 32 C48 38, 88 56, 96 90 C96 94, 92 96, 88 94 C76 72, 46 54, 22 40 C20 36, 22 32, 26 32 Z"
        fill="url(#ban-skin)" filter="url(#ban-shadow)" />
  <!-- Longitudinal ridge lines -->
  <path d="M25 36 C46 44, 80 62, 90 92" stroke="#CA8A04" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.6" />
  <!-- Green stalk stem at top -->
  <path d="M22 40 C18 36, 16 32, 14 30 C16 28, 20 28, 24 32" fill="#65A30D" stroke="#365314" stroke-width="1" />
  <!-- Dark tip at bottom -->
  <path d="M92 90 C94 92, 96 94, 98 96" stroke="#451A03" stroke-width="3" stroke-linecap="round" />
</svg>`,

  'carrot': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="crt-skin" x1="20%" y1="20%" x2="80%" y2="80%">
      <stop offset="0%" stop-color="#FDBA74" />
      <stop offset="40%" stop-color="#F97316" />
      <stop offset="85%" stop-color="#EA580C" />
      <stop offset="100%" stop-color="#9A3412" />
    </linearGradient>
    <filter id="crt-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#7C2D12" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Leafy green foliage top -->
  <g stroke="#15803D" stroke-width="2.5" stroke-linecap="round">
    <path d="M72 34 C76 22, 84 14, 92 8" />
    <path d="M70 30 C80 24, 88 20, 94 22" />
    <path d="M66 32 C68 18, 74 10, 78 6" />
  </g>
  <!-- Tapered carrot cone body -->
  <g transform="rotate(-30 60 65)" filter="url(#crt-shadow)">
    <path d="M50 30 C58 28, 70 28, 78 30 C76 56, 68 88, 64 104 C62 104, 60 98, 56 74 C52 54, 50 36, 50 30 Z"
          fill="url(#crt-skin)" />
    <!-- Horizontal texture lines -->
    <path d="M54 44 Q64 42 74 44" stroke="#C2410C" stroke-width="1.5" stroke-linecap="round" fill="none" />
    <path d="M56 58 Q64 56 72 58" stroke="#C2410C" stroke-width="1.5" stroke-linecap="round" fill="none" />
    <path d="M58 72 Q64 70 70 72" stroke="#C2410C" stroke-width="1.5" stroke-linecap="round" fill="none" />
    <!-- Highlight strip -->
    <path d="M54 34 C56 50, 60 70, 62 82" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" fill="none" opacity="0.4" />
  </g>
</svg>`,

  'papaya': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="pap-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="45%" stop-color="#F59E0B" />
      <stop offset="75%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#65A30D" />
    </radialGradient>
    <filter id="pap-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#365314" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Stem -->
  <path d="M60 22 C60 14, 64 8, 66 6" stroke="#78350F" stroke-width="3" stroke-linecap="round" fill="none" />
  <!-- Pear-shaped papaya body -->
  <path d="M60 22 C70 22, 78 34, 80 48 C82 60, 92 72, 92 86 C92 98, 78 106, 60 106 C42 106, 28 98, 28 86 C28 72, 38 60, 40 48 C42 34, 50 22, 60 22 Z"
        fill="url(#pap-skin)" filter="url(#pap-shadow)" />
  <!-- Green speckled accents -->
  <path d="M38 52 C32 68, 32 84, 40 94" stroke="#4D7C0F" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
  <!-- Highlighting gloss -->
  <ellipse cx="48" cy="50" rx="5" ry="14" fill="#FFFFFF" opacity="0.35" transform="rotate(-15 48 50)" />
</svg>`,

  'grapefruit': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="gf-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="35%" stop-color="#FB923C" />
      <stop offset="70%" stop-color="#F43F5E" />
      <stop offset="100%" stop-color="#9F1239" />
    </radialGradient>
    <filter id="gf-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#881337" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Stem & small leaf -->
  <path d="M66 26 C78 16, 92 18, 98 22 C94 32, 82 34, 72 30 Z" fill="#15803D" />
  <path d="M60 28 C60 20, 64 14, 66 10" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Large round grapefruit -->
  <circle cx="60" cy="66" r="38" fill="url(#gf-skin)" filter="url(#gf-shadow)" />
  <!-- Citrus rind dimple textures -->
  <circle cx="48" cy="48" r="1.5" fill="#FFFFFF" opacity="0.6" />
  <circle cx="56" cy="44" r="1.5" fill="#FFFFFF" opacity="0.5" />
  <circle cx="44" cy="58" r="1.5" fill="#FFFFFF" opacity="0.5" />
  <!-- Gloss shine -->
  <ellipse cx="46" cy="52" rx="8" ry="16" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 46 52)" />
</svg>`,

  'cantaloupe': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="cant-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#D9F99D" />
      <stop offset="45%" stop-color="#84CC16" />
      <stop offset="85%" stop-color="#4D7C0F" />
      <stop offset="100%" stop-color="#14532D" />
    </radialGradient>
    <filter id="cnt-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#14532D" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Top stem nub -->
  <path d="M60 28 C60 22, 62 16, 64 12" stroke="#78350F" stroke-width="3" stroke-linecap="round" fill="none" />
  <!-- Round melon body -->
  <circle cx="60" cy="66" r="38" fill="url(#cant-skin)" filter="url(#cnt-shadow)" />
  <!-- Characteristic tan netted webbing pattern -->
  <g stroke="#FEF08A" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.55">
    <ellipse cx="60" cy="66" rx="36" ry="36" stroke-dasharray="3 4" />
    <path d="M60 28 C74 42, 74 90, 60 104" />
    <path d="M60 28 C46 42, 46 90, 60 104" />
    <path d="M60 28 C86 46, 86 86, 60 104" />
    <path d="M60 28 C34 46, 34 86, 60 104" />
    <path d="M24 66 C40 54, 80 54, 96 66" />
    <path d="M26 78 C42 66, 78 66, 94 78" />
  </g>
</svg>`,

  'acorn-squash': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="asq-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#15803D" />
      <stop offset="45%" stop-color="#166534" />
      <stop offset="85%" stop-color="#14532D" />
      <stop offset="100%" stop-color="#052E16" />
    </radialGradient>
    <filter id="asq-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#052E16" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Woody Stem -->
  <path d="M60 24 C60 14, 64 8, 66 6" stroke="#78350F" stroke-width="4" stroke-linecap="round" fill="none" />
  <!-- Acorn squash ridged body -->
  <g filter="url(#asq-shadow)">
    <path d="M60 26 C76 26, 94 46, 90 74 C86 94, 74 104, 60 104 C46 104, 34 94, 30 74 C26 46, 44 26, 60 26 Z"
          fill="url(#asq-skin)" />
    <!-- Deep longitudinal ribs / grooves -->
    <path d="M60 26 C70 42, 70 82, 60 104" stroke="#052E16" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M60 26 C50 42, 50 82, 60 104" stroke="#052E16" stroke-width="3" stroke-linecap="round" fill="none" />
    <path d="M60 26 C80 46, 80 82, 60 104" stroke="#052E16" stroke-width="2.5" stroke-linecap="round" fill="none" />
    <path d="M60 26 C40 46, 40 82, 60 104" stroke="#052E16" stroke-width="2.5" stroke-linecap="round" fill="none" />
  </g>
  <!-- Orange squash ripening patch -->
  <ellipse cx="68" cy="80" rx="10" ry="12" fill="#F97316" opacity="0.3" />
</svg>`,

  'zucchini': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="zuc-skin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80" />
      <stop offset="35%" stop-color="#16A34A" />
      <stop offset="75%" stop-color="#166534" />
      <stop offset="100%" stop-color="#052E16" />
    </linearGradient>
    <filter id="zuc-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#052E16" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Elongated curved zucchini -->
  <g transform="rotate(-35 60 60)" filter="url(#zuc-shadow)">
    <path d="M50 20 C60 18, 70 18, 74 24 C82 52, 82 86, 76 100 C72 104, 60 104, 52 98 C42 84, 40 50, 50 20 Z"
          fill="url(#zuc-skin)" />
    <!-- Stem cap -->
    <path d="M58 20 C58 14, 62 10, 64 8" stroke="#14532D" stroke-width="3" stroke-linecap="round" fill="none" />
    <!-- Subtle speckled stripes -->
    <path d="M54 32 C58 54, 60 76, 58 92" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5" />
    <path d="M66 32 C70 54, 72 76, 70 92" stroke="#86EFAC" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.5" />
  </g>
</svg>`,

  'cauliflower': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="floret" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#F1F5F9" />
      <stop offset="90%" stop-color="#CBD5E1" />
      <stop offset="100%" stop-color="#94A3B8" />
    </radialGradient>
    <filter id="cfl-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0F172A" flood-opacity="0.35"/>
    </filter>
  </defs>
  <!-- Outer green leaves enveloping head -->
  <path d="M22 86 C20 62, 34 38, 48 30 C44 54, 40 76, 36 92 Z" fill="#15803D" />
  <path d="M98 86 C100 62, 86 38, 72 30 C76 54, 80 76, 84 92 Z" fill="#15803D" />
  <path d="M36 96 C48 106, 72 106, 84 96 C72 100, 48 100, 36 96 Z" fill="#166534" />
  <!-- Dome of tightly packed creamy ivory florets -->
  <g filter="url(#cfl-shadow)">
    <circle cx="60" cy="44" r="14" fill="url(#floret)" />
    <circle cx="44" cy="50" r="13" fill="url(#floret)" />
    <circle cx="76" cy="50" r="13" fill="url(#floret)" />
    <circle cx="36" cy="66" r="13" fill="url(#floret)" />
    <circle cx="56" cy="62" r="14" fill="url(#floret)" />
    <circle cx="76" cy="64" r="13" fill="url(#floret)" />
    <circle cx="84" cy="68" r="11" fill="url(#floret)" />
    <circle cx="46" cy="78" r="13" fill="url(#floret)" />
    <circle cx="66" cy="78" r="13" fill="url(#floret)" />
  </g>
</svg>`,

  'eggplant': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="egg-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#9333EA" />
      <stop offset="35%" stop-color="#581C87" />
      <stop offset="75%" stop-color="#2E1065" />
      <stop offset="100%" stop-color="#0F051D" />
    </radialGradient>
    <filter id="egp-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#0F051D" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Woody Stem -->
  <path d="M60 24 C60 14, 64 8, 68 6" stroke="#15803D" stroke-width="4" stroke-linecap="round" fill="none" />
  <!-- Teardrop eggplant body -->
  <path d="M60 28 C74 28, 86 52, 90 76 C94 94, 82 106, 60 106 C38 106, 26 94, 30 76 C34 52, 46 28, 60 28 Z"
        fill="url(#egg-skin)" filter="url(#egp-shadow)" />
  <!-- Distinctive spiky green calyx cap -->
  <polygon points="60,26 68,36 82,34 74,44 84,52 70,50 64,58 58,50 48,54 52,44 42,38 54,36" fill="#15803D" stroke="#14532D" stroke-width="1" />
  <!-- Ultra-glossy reflection -->
  <ellipse cx="44" cy="62" rx="7" ry="20" fill="#FFFFFF" opacity="0.4" transform="rotate(-18 44 62)" />
  <circle cx="45" cy="50" r="3.5" fill="#FFFFFF" opacity="0.8" />
</svg>`,

  'butternut-squash': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="bnt-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="45%" stop-color="#F59E0B" />
      <stop offset="85%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#78350F" />
    </radialGradient>
    <filter id="bnt-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#78350F" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Stem -->
  <path d="M60 20 C60 12, 64 6, 66 4" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <!-- Bell-bottomed butternut squash hourglass shape -->
  <path d="M52 22 C68 22, 70 28, 70 44 C70 54, 88 68, 88 86 C88 100, 76 106, 60 106 C44 106, 32 100, 32 86 C32 68, 50 54, 50 44 C50 28, 42 22, 52 22 Z"
        fill="url(#bnt-skin)" filter="url(#bnt-shadow)" />
  <!-- Highlighting shine along column -->
  <path d="M48 30 C46 44, 40 70, 44 88" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.4" />
</svg>`,

  'cabbage': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="cab-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#86EFAC" />
      <stop offset="45%" stop-color="#22C55E" />
      <stop offset="80%" stop-color="#15803D" />
      <stop offset="100%" stop-color="#14532D" />
    </radialGradient>
    <filter id="cab-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#14532D" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Round layered cabbage head -->
  <circle cx="60" cy="64" r="38" fill="url(#cab-skin)" filter="url(#cab-shadow)" />
  <!-- Curved crinkled leaf edges & prominent veins -->
  <path d="M30 46 C44 38, 72 38, 90 52" stroke="#DCFCE7" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.75" />
  <path d="M26 66 C42 60, 68 56, 88 74" stroke="#DCFCE7" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.65" />
  <path d="M34 84 C50 76, 74 76, 88 88" stroke="#DCFCE7" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.65" />
  <!-- Center rosette leaf overlapping -->
  <path d="M50 48 C66 46, 76 56, 72 70 C68 80, 52 82, 46 72 C42 62, 44 52, 50 48 Z" fill="#4ADE80" stroke="#16A34A" stroke-width="1.5" />
</svg>`,

  'coconut': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="coc-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#A16207" />
      <stop offset="45%" stop-color="#78350F" />
      <stop offset="85%" stop-color="#451A03" />
      <stop offset="100%" stop-color="#1C0A00" />
    </radialGradient>
    <filter id="coc-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#1C0A00" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Fibrous brown oval coconut shell -->
  <circle cx="60" cy="62" r="38" fill="url(#coc-skin)" filter="url(#coc-shadow)" />
  <!-- Fibrous hair texture strokes -->
  <g stroke="#D97706" stroke-width="1" stroke-linecap="round" opacity="0.4">
    <path d="M30 46 C34 50, 36 60, 32 72" />
    <path d="M42 34 C46 44, 44 58, 46 70" />
    <path d="M78 36 C74 48, 76 60, 74 76" />
    <path d="M88 50 C84 62, 86 70, 84 80" />
    <path d="M50 82 C56 86, 68 86, 74 82" />
  </g>
  <!-- 3 distinct germination pores ("eyes") -->
  <ellipse cx="50" cy="46" rx="4.5" ry="5.5" fill="#1C0A00" />
  <ellipse cx="64" cy="42" rx="4" ry="5" fill="#1C0A00" />
  <ellipse cx="60" cy="54" rx="4.5" ry="5.5" fill="#1C0A00" />
</svg>`,

  'jicama': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="jic-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#E7E5E4" />
      <stop offset="40%" stop-color="#A8A29E" />
      <stop offset="80%" stop-color="#78716C" />
      <stop offset="100%" stop-color="#44403C" />
    </radialGradient>
    <filter id="jic-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#292524" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Top root stalk -->
  <path d="M60 26 C60 16, 62 10, 64 6" stroke="#57534E" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Turnip/bulb shaped earthy root -->
  <path d="M60 26 C80 26, 94 44, 94 66 C94 88, 74 100, 60 106 C46 100, 26 88, 26 66 C26 44, 40 26, 60 26 Z"
        fill="url(#jic-skin)" filter="url(#jic-shadow)" />
  <!-- Bottom taproot tail -->
  <path d="M60 106 C60 112, 58 116, 56 118" stroke="#78716C" stroke-width="2" stroke-linecap="round" fill="none" />
  <!-- Earthy skin texture rings -->
  <path d="M38 52 C50 48, 72 48, 84 56" stroke="#A8A29E" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6" />
  <path d="M40 72 C52 68, 70 68, 80 76" stroke="#A8A29E" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6" />
</svg>`,

  'pineapple': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="pa-body" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="45%" stop-color="#EAB308" />
      <stop offset="85%" stop-color="#CA8A04" />
      <stop offset="100%" stop-color="#713F12" />
    </radialGradient>
    <filter id="pa-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#713F12" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Spiky crown of leaves on top -->
  <g fill="#15803D" stroke="#14532D" stroke-width="1">
    <path d="M60 44 C56 26, 44 14, 34 8 C48 18, 54 30, 56 44 Z" />
    <path d="M60 44 C64 26, 76 14, 86 8 C72 18, 66 30, 64 44 Z" />
    <path d="M60 44 C60 22, 60 12, 60 4 C64 16, 64 28, 62 44 Z" fill="#22C55E" />
  </g>
  <!-- Oval diamond-patterned pineapple body -->
  <ellipse cx="60" cy="74" rx="28" ry="34" fill="url(#pa-body)" filter="url(#pa-shadow)" />
  <!-- Criss-cross diamond grid pattern -->
  <g stroke="#713F12" stroke-width="1.5" opacity="0.55">
    <line x1="42" y1="50" x2="78" y2="98" />
    <line x1="36" y1="62" x2="72" y2="104" />
    <line x1="48" y1="44" x2="84" y2="88" />
    <line x1="78" y1="50" x2="42" y2="98" />
    <line x1="84" y1="62" x2="48" y2="104" />
    <line x1="72" y1="44" x2="36" y2="88" />
  </g>
  <!-- Tiny center spikes on each diamond -->
  <circle cx="60" cy="74" r="2" fill="#854D0E" />
  <circle cx="50" cy="64" r="2" fill="#854D0E" />
  <circle cx="70" cy="64" r="2" fill="#854D0E" />
  <circle cx="50" cy="84" r="2" fill="#854D0E" />
  <circle cx="70" cy="84" r="2" fill="#854D0E" />
</svg>`,

  'melon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="mel-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#EAB308" />
      <stop offset="75%" stop-color="#65A30D" />
      <stop offset="100%" stop-color="#14532D" />
    </radialGradient>
    <filter id="mel-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#14532D" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Stem -->
  <path d="M60 26 C60 18, 64 12, 66 8" stroke="#78350F" stroke-width="3" stroke-linecap="round" fill="none" />
  <!-- Large oval striped melon body -->
  <ellipse cx="60" cy="66" rx="34" ry="40" fill="url(#mel-skin)" filter="url(#mel-shadow)" />
  <!-- Vertical melon stripe bands -->
  <g stroke="#166534" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.65">
    <path d="M60 26 C66 40, 66 92, 60 106" />
    <path d="M60 26 C48 40, 48 92, 60 106" />
    <path d="M60 26 C76 44, 76 88, 60 106" />
    <path d="M60 26 C38 44, 38 88, 60 106" />
  </g>
</svg>`,

  'honeydew': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="hd-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#F0FDF4" />
      <stop offset="40%" stop-color="#BBF7D0" />
      <stop offset="75%" stop-color="#4ADE80" />
      <stop offset="100%" stop-color="#15803D" />
    </radialGradient>
    <filter id="hd-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#14532D" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Clean stem nub -->
  <path d="M60 28 C60 20, 62 14, 64 10" stroke="#78350F" stroke-width="2.5" stroke-linecap="round" fill="none" />
  <!-- Smooth pale mint-green round honeydew -->
  <circle cx="60" cy="66" r="38" fill="url(#hd-skin)" filter="url(#hd-shadow)" />
  <!-- Soft glossy sheen -->
  <ellipse cx="46" cy="50" rx="9" ry="18" fill="#FFFFFF" opacity="0.45" transform="rotate(-20 46 50)" />
  <circle cx="48" cy="44" r="3.5" fill="#FFFFFF" opacity="0.75" />
</svg>`,

  'romaine-lettuce': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <linearGradient id="rom-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4ADE80" />
      <stop offset="45%" stop-color="#16A34A" />
      <stop offset="100%" stop-color="#14532D" />
    </linearGradient>
    <filter id="rom-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#14532D" flood-opacity="0.4"/>
    </filter>
  </defs>
  <!-- Upright tall bunch of crisp romaine leaves -->
  <g filter="url(#rom-shadow)">
    <!-- Back leaves -->
    <path d="M38 100 C30 70, 30 36, 46 16 C52 38, 52 76, 48 100 Z" fill="#15803D" />
    <path d="M82 100 C90 70, 90 36, 74 16 C68 38, 68 76, 72 100 Z" fill="#15803D" />
    <!-- Center tall leaves -->
    <path d="M46 102 C44 64, 46 30, 60 14 C74 30, 76 64, 74 102 Z" fill="url(#rom-grad)" />
    <!-- White thick center rib -->
    <path d="M60 102 C60 76, 60 52, 60 30" stroke="#DCFCE7" stroke-width="4" stroke-linecap="round" fill="none" />
  </g>
</svg>`,

  'winter-melon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="wm-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#DCFCE7" />
      <stop offset="45%" stop-color="#86EFAC" />
      <stop offset="80%" stop-color="#22C55E" />
      <stop offset="100%" stop-color="#14532D" />
    </radialGradient>
    <filter id="wm-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#14532D" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Top woody stem -->
  <path d="M60 22 C60 14, 62 8, 64 6" stroke="#78350F" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <!-- Large oblong winter melon body -->
  <ellipse cx="60" cy="66" rx="33" ry="42" fill="url(#wm-skin)" filter="url(#wm-shadow)" />
  <!-- Frosted white powdery dusting texture -->
  <ellipse cx="60" cy="66" rx="28" ry="36" fill="#FFFFFF" opacity="0.25" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="6 8" />
  <circle cx="48" cy="50" r="4" fill="#FFFFFF" opacity="0.6" />
</svg>`,

  'pumpkin': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="pmp-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#FED7AA" />
      <stop offset="35%" stop-color="#FB923C" />
      <stop offset="75%" stop-color="#EA580C" />
      <stop offset="100%" stop-color="#9A3412" />
    </radialGradient>
    <filter id="pmp-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#7C2D12" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Curved woody brown stem with tendril -->
  <path d="M60 38 C60 22, 68 14, 76 12 C74 16, 70 24, 64 38" stroke="#78350F" stroke-width="5" stroke-linecap="round" fill="none" />
  <path d="M72 16 C80 18, 84 24, 82 30" stroke="#16A34A" stroke-width="2" stroke-linecap="round" fill="none" />
  <!-- Ribbed pumpkin body -->
  <g filter="url(#pmp-shadow)">
    <!-- Outer lobes -->
    <ellipse cx="38" cy="68" rx="20" ry="32" fill="url(#pmp-skin)" />
    <ellipse cx="82" cy="68" rx="20" ry="32" fill="url(#pmp-skin)" />
    <!-- Mid lobes -->
    <ellipse cx="48" cy="68" rx="18" ry="34" fill="url(#pmp-skin)" />
    <ellipse cx="72" cy="68" rx="18" ry="34" fill="url(#pmp-skin)" />
    <!-- Center lobe -->
    <ellipse cx="60" cy="68" rx="17" ry="35" fill="url(#pmp-skin)" />
  </g>
  <!-- Longitudinal ridge lines between ribs -->
  <path d="M60 34 C54 50, 54 86, 60 102" stroke="#7C2D12" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.6" />
  <!-- Highlighting shine -->
  <ellipse cx="48" cy="54" rx="5" ry="12" fill="#FFFFFF" opacity="0.4" transform="rotate(-15 48 54)" />
</svg>`,

  'mini-watermelon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="mwm-skin" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#4ADE80" />
      <stop offset="50%" stop-color="#16A34A" />
      <stop offset="85%" stop-color="#15803D" />
      <stop offset="100%" stop-color="#052E16" />
    </radialGradient>
    <filter id="mwm-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#052E16" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Curly vine stem -->
  <path d="M60 28 C60 18, 66 12, 70 8" stroke="#166534" stroke-width="3" stroke-linecap="round" fill="none" />
  <path d="M68 12 C74 10, 78 14, 76 20" stroke="#22C55E" stroke-width="2" stroke-linecap="round" fill="none" />
  <!-- Compact round mini watermelon -->
  <circle cx="60" cy="66" r="38" fill="url(#mwm-skin)" filter="url(#mwm-shadow)" />
  <!-- Dark jagged wavy watermelon stripes -->
  <g stroke="#052E16" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.75">
    <path d="M60 28 Q64 46 58 66 Q64 86 60 104" />
    <path d="M60 28 Q74 46 72 66 Q76 86 60 104" />
    <path d="M60 28 Q46 46 48 66 Q44 86 60 104" />
    <path d="M60 28 Q86 50 84 68 Q86 86 60 104" />
    <path d="M60 28 Q34 50 36 68 Q34 86 60 104" />
  </g>
  <!-- Gloss highlight -->
  <ellipse cx="46" cy="50" rx="6" ry="14" fill="#FFFFFF" opacity="0.35" transform="rotate(-20 46 50)" />
</svg>`,

  'watermelon': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <defs>
    <radialGradient id="wm-skin-full" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#4ADE80" />
      <stop offset="45%" stop-color="#16A34A" />
      <stop offset="80%" stop-color="#15803D" />
      <stop offset="100%" stop-color="#052E16" />
    </radialGradient>
    <filter id="wm-shadow-full" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="#052E16" flood-opacity="0.5"/>
    </filter>
  </defs>
  <!-- Curly green vine tendril -->
  <path d="M60 24 C60 14, 66 8, 72 6" stroke="#166534" stroke-width="3.5" stroke-linecap="round" fill="none" />
  <path d="M70 8 C78 6, 84 12, 82 18 C80 24, 74 26, 76 30" stroke="#22C55E" stroke-width="2" stroke-linecap="round" fill="none" />
  <!-- Large grand oval watermelon body -->
  <ellipse cx="60" cy="66" rx="38" ry="42" fill="url(#wm-skin-full)" filter="url(#wm-shadow-full)" />
  <!-- Prominent dark jagged wavy stripes -->
  <g stroke="#052E16" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8">
    <path d="M60 24 Q66 45 58 66 Q66 88 60 108" />
    <path d="M60 24 Q78 45 74 66 Q80 88 60 108" />
    <path d="M60 24 Q42 45 46 66 Q40 88 60 108" />
    <path d="M60 24 Q92 48 88 68 Q90 88 60 108" />
    <path d="M60 24 Q28 48 32 68 Q30 88 60 108" />
  </g>
  <!-- Bright gloss reflection -->
  <ellipse cx="44" cy="50" rx="7" ry="16" fill="#FFFFFF" opacity="0.4" transform="rotate(-20 44 50)" />
  <circle cx="46" cy="44" r="3.5" fill="#FFFFFF" opacity="0.75" />
</svg>`
};

console.log('Generating ' + Object.keys(svgs).length + ' comparison SVGs...');
for (const [key, content] of Object.entries(svgs)) {
  const filePath = path.join(outDir, `${key}.svg`);
  fs.writeFileSync(filePath, content.trim(), 'utf8');
}
console.log('Successfully generated all ' + Object.keys(svgs).length + ' SVG comparison files in: ' + outDir);
