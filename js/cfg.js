// cfg.js

export const ROOM_CFG = {
  S: {
    default: [
      "You enter a <adjective> <place>. <description> On a pedestal lies the <item>.",
      "A <adjective> <place> unfolds, filled with <object>. You spot a <item> shimmering quietly."
    ],
    EnchantedGardens: [
      "A lush <place> bursts with color. <description> A <item> sits among the vines.",
      "You step into a radiant <place> brimming with life. <description> A <item> catches your eye."
    ],
    TheArchive: [
      "You enter a <adjective> <place> lined with towering shelves. <description> A <item> lies on a nearby table.",
      "A <adjective> <place> extends before you, filled with dusty tomes and <object>. <description> A <item> stands out."
    ],
    ClockworkLabyrinth: [
      "You arrive in a <adjective> <place> of shifting gears. <description> A <item> glints in the machinery.",
      "A <adjective> <place> of ticking cogs surrounds you. <description> There's a <item> near the whirring pistons."
    ]
  },

  // Description alternatives for each level theme.
  description: {
    default: [
      "The air hums with quiet potential.",
      "A sense of timeless wonder fills the space."
    ],
    EnchantedGardens: [
      "The gentle fragrance of blooming flora envelops you.",
      "Whispers of nature and magic intertwine in the air."
    ],
    TheArchive: [
      "Dusty memories and forgotten lore linger in every corner.",
      "Ancient secrets and worn pages beckon you closer."
    ],
    ClockworkLabyrinth: [
      "The rhythmic ticking of gears creates an eerie symphony.",
      "Mechanical precision and ceaseless motion permeate the space."
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

// Simple random picker.
const pickFrom = list => list[Math.floor(Math.random() * list.length)];

// Mapping level numbers to theme keys.
export const LEVEL_THEME_MAP = {
  1: "EnchantedGardens",      // Level 1: Enchanted Gardens
  2: "TheArchive",            // Level 2: The Archive
  3: "ClockworkLabyrinth"     // Level 3: Clockwork Labyrinth
};

export const generateRoomDescription = (collectible, level = 1) => {
  if (!collectible || !collectible.name || !collectible.symbol) {
    return "You enter a room with strange, indescribable energy.";
  }

  // Determine the theme based on the provided level.
  const themeKey = LEVEL_THEME_MAP[level] || "default";
  console.log(`Generating room for level ${level} using theme: ${themeKey}`);

  // Retrieve the scenario pool for the determined theme.
  const scenarioPool = ROOM_CFG.S[themeKey] || ROOM_CFG.S.default;
  const template = pickFrom(scenarioPool);
  const tags = collectible.tags || [];

  // Build pools for adjectives, places, and objects from collectible tags.
  const adjectivePool = tags.flatMap(tag => ROOM_CFG.adjective[tag] || []);
  const placePool = tags.flatMap(tag => ROOM_CFG.place[tag] || []);
  const objectPool = tags.flatMap(tag => ROOM_CFG.object[tag] || []);

  const adjective = pickFrom(adjectivePool.length ? adjectivePool : ROOM_CFG.adjective.default);
  const place = pickFrom(placePool.length ? placePool : ROOM_CFG.place.default);
  const object = pickFrom(objectPool.length ? objectPool : ROOM_CFG.object.default);

  // Randomly choose a description that explicitly matches the level's theme.
  const descStr = pickFrom(ROOM_CFG.description[themeKey] || ROOM_CFG.description.default);

  // Replace placeholders in the chosen template.
  return template
    .replace("<adjective>", adjective)
    .replace("<place>", place)
    .replace("<object>", object)
    .replace("<description>", descStr)
    .replace("<item>", `${collectible.symbol} ${collectible.name}`);
};
