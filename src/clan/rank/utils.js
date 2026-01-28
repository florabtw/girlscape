export const hasItem =
  (item) =>
  ({ collectionLog }) => {
    if (!collectionLog) return false;
    return collectionLog.items.some(({ name }) => item === name);
  };

export const hasVerified =
  (milestone) =>
  ({ verifieds }) => {
    if (!verifieds) return false;
    return Boolean(verifieds[milestone]);
  };

export const verifiedOptions = [
  { name: "Quest Cape", value: "quest_cape" },
  { name: "Music Cape", value: "music_cape" },
  { name: "Achievement Diary Cape", value: "achievement_cape" },
  { name: "Medium Diaries", value: "diaries_medium" },
  { name: "Hard Diaries", value: "diaries_hard" },
  { name: "Hard CAs", value: "cas_hard" },
  { name: "Elite CAs", value: "cas_elite" },
  { name: "Master CAs", value: "cas_master" },
  { name: "Grandmaster CAs", value: "cas_grandmaster" },
  { name: "Blood Torva", value: "blood_torva" },
  { name: "Radiant Oathplate", value: "radiant_oathplate" },
];
