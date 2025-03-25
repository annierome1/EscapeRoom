

export const THEMES = {
    ruins: {
      name: "Ancient Ruins",
      symbols: ['🗿', '🧱', '⚱️', '📜', '🔑'],
      artifactWords: ['idol', 'brick', 'urn', 'scroll', 'key'],
      cfgRules: {
        S: ["You are in a <adjective> <place> filled with <object>."],
        adjective: ["crumbling", "ancient", "mossy", "dark"],
        place: ["hall", "chamber", "temple", "vault"],
        object: ["statues", "rubble", "glyphs", "bones"]
      }
    },
    sciFi: {
      name: "Futuristic Lab",
      symbols: ['🧪', '💾', '🔋', '🧬', '🛰️'],
      artifactWords: ['serum', 'disk', 'battery', 'gene', 'drone'],
      cfgRules: {
        S: ["You step into a <adjective> <place> with <object>."],
        adjective: ["sterile", "metallic", "glowing", "abandoned"],
        place: ["lab", "containment pod", "data core", "observation room"],
        object: ["wires", "tubes", "panels", "screens"]
      }
    },
    forest: {
      name: "Mystic Forest",
      symbols: ['🍄', '🦉', '🌲', '🧚‍♀️', '🔮'],
      artifactWords: ['mushroom', 'feather', 'bark', 'dust', 'orb'],
      cfgRules: {
        S: ["You wander into a <adjective> <place> glowing with <object>."],
        adjective: ["misty", "enchanted", "shadowy", "sun-dappled"],
        place: ["grove", "clearing", "thicket", "glade"],
        object: ["fairy light", "fungi", "runes", "fog"]
      }
    }
  };
  
  // Maps specific keywords to symbols (used to generate collectible meaningfully)
  export const artifactSymbolMap = {
    idol: '🗿', brick: '🧱', urn: '⚱️', scroll: '📜', key: '🔑',
    serum: '🧪', disk: '💾', battery: '🔋', gene: '🧬', drone: '🛰️',
    mushroom: '🍄', feather: '🦉', bark: '🌲', dust: '🧚‍♀️', orb: '🔮'
  };
  
