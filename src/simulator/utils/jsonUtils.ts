/**
 * Removes circular references from an object.
 * If a circular reference is found, it will be replaced with a string of the form `<%Ref *{id}>`.
 * This is useful for serializing objects that contain circular references.
 * @param {any} obj - The object to remove circular references from.
 * @returns {any} The object with circular references removed.
 */
export function removeCircularReferences(obj: any) {
  let count: number = 0;
  const idMap: WeakMap<Record<string, unknown> | Array<unknown>, number> =
    new WeakMap<Record<string, unknown> | Array<unknown>, number>();

  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (idMap.get(value) !== undefined) {
          // Circular reference found, discard key
          return `<%Ref *${idMap.get(value)}>`;
        }
        idMap.set(value, count);
        count++;
      }
      return value;
    }),
  );
}
