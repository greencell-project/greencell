// Emoji and punctuation mojibake fixer (runs after DOM ready)
(function () {
  const pairs = [
    // Emoji (mojibake -> intended)
    ['ðŸŒ±','🌱'],['ðŸ”¬','🔬'],['ðŸ†','🏆'],['ðŸ“…','📅'],['ðŸ—“ï¸','🗓️'],['ðŸ—“','🗓'],
    ['ðŸ“Š','📊'],['ðŸ“š','📚'],['ðŸŽ“','🎓'],['ðŸ‘¥','👥'],['ðŸŽ¯','🎯'],
    ['ðŸ“‹','📋'],['ðŸ“£','📣'],['ðŸ¤','🤝'],['ðŸ‘‹','👋'],['ðŸŽ‰','🎉'],['ðŸ…','🏅'],
    ['ðŸŽš','🎚'],
    // Common punctuation and symbols
    ['â€¢','•'],['â€“','–'],['â€”','—'],['â€¦','…'],
    ['â€˜','‘'],['â€™','’'],['â€œ','“'],['â€�','”'],
    ['Â ','\u00A0'],['Â ',' '],
    ['Ã—','×'],['â†’','→'],['â†','←'],
    ['â±ï¸','⏱️'],['â±','⏱'],
    ['âš™ï¸','⚙️'],['âš™','⚙'],
    ['âœ”','✔'],['âœ…','✅'],['âœï¸','✏️'],['âœ','✏'],
    ['â™»ï¸','♻️'],['â™»','♻'],['â˜€ï¸','☀️'],['â˜€','☀'],
    ['â‚‚','₂'],['Â²','²'],['Â°','°']
  ];

  function fixString(s){
    if (!s || typeof s !== 'string') return s;
    let out = s;
    for (const [bad, good] of pairs) {
      if (out.includes(bad)) out = out.split(bad).join(good);
    }
    return out;
  }

  function walk(node){
    if (node.nodeType === 3) { // text
      const t = fixString(node.nodeValue);
      if (t !== node.nodeValue) node.nodeValue = t;
      return;
    }
    if (node.nodeType !== 1) return;
    if (node.attributes) {
      for (const a of Array.from(node.attributes)) {
        const v = fixString(a.value);
        if (v !== a.value) a.value = v;
      }
    }
    for (const c of Array.from(node.childNodes)) walk(c);
  }

  function run(){
    if (!document.body) return;
    walk(document.body);
    if (document.title) document.title = fixString(document.title);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  new MutationObserver(ms => {
    for (const m of ms) {
      if (m.type === 'characterData' && m.target.nodeType === 3) {
        const t = m.target, v = fixString(t.nodeValue);
        if (v !== t.nodeValue) t.nodeValue = v;
      }
      for (const n of m.addedNodes || []) walk(n);
    }
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
