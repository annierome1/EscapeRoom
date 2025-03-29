//cfg.js
// ================================
// Context-Free Grammar (CFG) Engine
// ================================
// This CFG dynamically generates room descriptions.
// See Fitch & Friederici (2012) and ShaggyDev (2022) for details on generative grammars.
// Dahlskog & Togelius (2014) for theme-based expansions in game text generation
// This CFG dynamically generates room descriptions.


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

  // Object expansion.
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

export const generateRoomDescription = (collectible, theme = null) => {
  if (!collectible || !collectible.name || !collectible.symbol) {
    console.warn("[CFG WARNING] Malformed collectible:", collectible);
    return "You enter a room with strange, indescribable energy.";
  }

  let themeSKey = "default";
  if (theme && theme.name) {
    // remove spaces/punctuation from theme.name
    const normalized = theme.name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    if (ROOM_CFG.S[normalized]) {
      themeSKey = normalized;
    }
  }

  // Collect the expansions.
  const scenarioPool = ROOM_CFG.S[themeSKey] || ROOM_CFG.S.default;
  const template = pickFrom(scenarioPool);

  // Use tags from the collectible to build adjective/place/object pools
  const tags = collectible.tags || [];

  const adjectivePool = tags.flatMap(tag => ROOM_CFG.adjective[tag] || []).length
    ? tags.flatMap(tag => ROOM_CFG.adjective[tag] || [])
    : ROOM_CFG.adjective.default;

  const placePool = tags.flatMap(tag => ROOM_CFG.place[tag] || []).length
    ? tags.flatMap(tag => ROOM_CFG.place[tag] || [])
    : ROOM_CFG.place.default;

  const objectPool = tags.flatMap(tag => ROOM_CFG.object[tag] || []).length
    ? tags.flatMap(tag => ROOM_CFG.object[tag] || [])
    : ROOM_CFG.object.default;

  const adjective = pickFrom(adjectivePool);
  const place = pickFrom(placePool);
  const object = pickFrom(objectPool);

  const descStr = theme && theme.name
    ? `The air hums with the essence of ${theme.name.toLowerCase()}.`
    : "The air hums with quiet potential.";

  return template
    .replace("<adjective>", adjective)
    .replace("<place>", place)
    .replace("<object>", object)
    .replace("<description>", descStr)
    .replace("<item>", `${collectible.symbol} ${collectible.name}`);
};
