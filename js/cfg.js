//cfg.js
// ================================
// Context-Free Grammar (CFG) Engine
// ================================
// This CFG dynamically generates room descriptions.
// See Fitch & Friederici (2012) and ShaggyDev (2022) for details on generative grammars.
// This CFG dynamically generates room descriptions.
// Miller et al.,(2019) "Stories of the Town: Balancing Character Autonomy and Coherent Narrative in Procedurally Generated Worlds"

export const ROOM_CFG = {
  S: {
    default: [
      "You enter a <adjective> <place>. <description> On a pedestal lies the <item>.",
      "A <adjective> <place> unfolds, filled with <object>. You spot a <item> shimmering quietly."
    ],

    EnchantedGardens: [
      "You step through an archway woven with ivy, emerging into a moonlit <place>. <description> A <item> glimmers by the willow trees.",
      "A hush falls over you as you pass under drooping branches in a misty <place>. <description> On a stepping stone near the lotus blossoms rests a <item>."
    ],

    TheArchive: [
      "Towering columns and shelves of ancient tomes line this grand <place>. <description> A <item> lies on a carved pedestal near the center.",
      "You stand at the threshold of a vast <place>, candlelight flickering across worn volumes. <description> A <item> lies open on a reading desk."
    ],

    ClockworkLabyrinth: [
      "You enter a gleaming <place> filled with glass capsules and intricate clock faces. <description> A <item> rests upon a whirring gear console.",
      "A labyrinth of polished brass and ticking machinery sprawls before you. <description> A <item> is displayed behind a glass cylinder."
    ]
  },

  // Thematic descriptions
  description: {
    default: [
      "The air hums with quiet potential.",
      "A sense of timeless wonder fills the space."
    ],
    EnchantedGardens: [
      "Soft lanterns and luminous lotus blossoms bathe the scene in ethereal light.",
      "The moon’s glow filters through the hanging willows, revealing dancing silhouettes in the mist."
    ],
    TheArchive: [
      "Flickering candles and the scent of old parchment create a solemn atmosphere.",
      "A labyrinth of knowledge stretches beyond the shelves, secrets hidden in every dusty volume."
    ],
    ClockworkLabyrinth: [
      "Steam hisses and metallic clinks echo in this marvel of engineering.",
      "Rows of gears and rotating cogs gleam under warm, mechanical lights."
    ]
  },

  // Adjective expansions.
  adjective: {
    default: ["quiet", "vast", "mysterious"],
    stone: ["ancient", "crumbling"],
    science: ["metallic", "glowing", "mechanical"],
    forest: ["lush", "enchanted", "mystical"],
    magic: ["radiant", "glimmering"],
    paper: ["dusty", "historic"]
  },

  // Place expansions.
  place: {
    default: ["hall", "chamber", "room"],
    forest: ["grove", "clearing", "garden"],
    science: ["lab", "chamber", "factory"],
    stone: ["ruin", "sanctum"],
    paper: ["library", "archive"]
  },

  // Object expansions.
  object: {
    default: ["shadows", "echoes"],
    glass: ["broken beakers", "glass shards"],
    stone: ["statues", "glyphs"],
    forest: ["flowers", "vines", "trees"],
    science: ["gears", "wires", "machinery"],
    paper: ["scrolls", "parchments", "books"]
  }
};


const pickFrom = list => list[Math.floor(Math.random() * list.length)];

// Mapping level numbers to theme keys.
export const LEVEL_THEME_MAP = {
  1: "EnchantedGardens",      
  2: "TheArchive",            
  3: "ClockworkLabyrinth"     
};

//Generate room description given collectible and level number
export const generateRoomDescription = (collectible, level = 1) => {
  if (!collectible || !collectible.name || !collectible.symbol) {
    return "You enter a room with strange, indescribable energy.";
  }

  // Determine the theme based on the level
  const themeKey = LEVEL_THEME_MAP[level] || "default";
  console.log(`Generating room for level ${level} using theme: ${themeKey}`);

  // Grab corresponding structure template
  const scenarioPool = ROOM_CFG.S[themeKey] || ROOM_CFG.S.default;
  const template = pickFrom(scenarioPool);
  const tags = collectible.tags || [];

  // Build pools for adjectives, places, and objects from collectible tags
  const adjectivePool = tags.flatMap(tag => ROOM_CFG.adjective[tag] || []);
  const placePool = tags.flatMap(tag => ROOM_CFG.place[tag] || []);
  const objectPool = tags.flatMap(tag => ROOM_CFG.object[tag] || []);

  const adjective = pickFrom(adjectivePool.length ? adjectivePool : ROOM_CFG.adjective.default);
  const place = pickFrom(placePool.length ? placePool : ROOM_CFG.place.default);
  const object = pickFrom(objectPool.length ? objectPool : ROOM_CFG.object.default);

  // Default theme description
  const baseDesc = pickFrom(ROOM_CFG.description[themeKey] || ROOM_CFG.description.default);

  // Text tied to specific tags in each theme, makes each description more collectible-specific
  const COLLECTIBLE_FLAVOR = {
    EnchantedGardens: {
      magic: [
        "A faint shimmer of otherworldly magic dances around the item.",
        "An ethereal glow hints at secret powers."
      ],
      forest: [
        "The rustle of leaves and the scent of earth imbue the space with life.",
        "Nature’s vibrant energy pulses in the background."
      ],
      organic: [
        "The natural essence of the garden seems to converge at this spot."
      ],
      animal: [
        "A whisper of unseen creatures adds an air of mystery."
      ]
    },
    TheArchive: {
      paper: [
        "Faded ink and the rustle of old parchment echo softly.",
        "Whispers of forgotten lore linger in the corners."
      ],
      ancient: [
        "The weight of centuries presses in the silence.",
        "Ancient memories stir with every step."
      ],
      stone: [
        "Cold stone and etched glyphs hint at lost civilizations."
      ],
      writing: [
        "Scratched letters and cryptic notes seem to speak of hidden truths."
      ],
      metal: [
        "A subtle metallic resonance infuses the air."
      ]
    },
    ClockworkLabyrinth: {
      science: [
        "A futuristic hum intertwines with the rhythmic ticking of gears.",
        "Innovative energy sparks between the machinery."
      ],
      metal: [
        "A precise metallic gleam mirrors the item’s craftsmanship."
      ],
      glass: [
        "Glimmering shards catch the light in a mesmerizing display."
      ],
      mechanical: [
        "The steady pulse of clockwork precision vibrates in the space."
      ]
    }
  };

  // Look for tags
  let flavorText = "";
  const flavorMapping = COLLECTIBLE_FLAVOR[themeKey];
  if (flavorMapping) {
    for (let tag of tags) {
      if (flavorMapping[tag]) {
        flavorText = pickFrom(flavorMapping[tag]);
        break; // Use the first tag
      }
    }
  }
  const finalDesc = flavorText || baseDesc;

  // Finally, fill in the template to generate the CFG
  return template
    .replace("<adjective>", adjective)
    .replace("<place>", place)
    .replace("<object>", object)
    .replace("<description>", finalDesc)
    .replace("<item>", `${collectible.symbol} ${collectible.name}`);
};
