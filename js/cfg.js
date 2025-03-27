// ================================
// Context-Free Grammar (CFG) Engine
// ================================
// This CFG dynamically generates room descriptions.
// See Fitch & Friederici (2012) and ShaggyDev (2022) for details on generative grammars.


export const ROOM_CFG = {
  S: [
    "You enter a <adjective> <place>. <description> On a pedestal lies the <item>.",
    "A <adjective> <place> opens before you, filled with <object>. You spot a <item> shimmering in the light.",
  ],
  adjective: {
    default: ["dark", "quiet", "vast", "mysterious"],
    stone: ["dusty", "ancient", "crumbling"],
    science: ["metallic", "glowing", "sterile"],
    forest: ["lush", "misty", "overgrown"],
    magic: ["whispering", "radiant", "glimmering"],
  },
  place: {
    default: ["hall", "chamber", "room", "vault"],
    forest: ["grove", "clearing", "glade"],
    science: ["lab", "containment chamber", "observatory"],
  },
  object: {
    default: ["shadows", "echoes", "dust"],
    glass: ["broken beakers", "glass shards"],
    stone: ["statues", "carved glyphs"],
  }
};

const pickFrom = (list) => list[Math.floor(Math.random() * list.length)];

export const generateRoomDescription = (collectible) => {
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

  const template = pickFrom(ROOM_CFG.S);
  const adjective = pickFrom(adjectivePool);
  const place = pickFrom(placePool);
  const object = pickFrom(objectPool);

  return template
    .replace("<adjective>", adjective)
    .replace("<place>", place)
    .replace("<object>", object)
    .replace("<description>", `The air hums with energy and ${object} scatter the ground.`)
    .replace("<item>", `${collectible.symbol} ${collectible.name}`);
};

  