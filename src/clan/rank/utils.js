export const hasItem =
  (item) =>
  ({ collectionLog }) => {
    if (!collectionLog) return false;
    return collectionLog.items.some(({ name }) => item === name);
  };
