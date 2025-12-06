type Vec2 = { position: { x: number; y: number } };

export class SpatialHash<T extends Vec2> {
  private grid = new Map<string, T[]>();

  constructor(private cellSize: number) {}

  private hash(x: number, y: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return `${cx},${cy}`;
  }

  insert(obj: T) {
    const h = this.hash(obj.position.x, obj.position.y);
    if (!this.grid.has(h)) this.grid.set(h, []);
    this.grid.get(h)!.push(obj);
  }

  remove(obj: T) {
    const h = this.hash(obj.position.x, obj.position.y);
    const arr = this.grid.get(h);
    if (!arr) return;

    const idx = arr.indexOf(obj);
    if (idx !== -1) arr.splice(idx, 1);

    if (arr.length === 0) this.grid.delete(h);
  }

  move(obj: T, newX: number, newY: number) {
    const oldHash = this.hash(obj.position.x, obj.position.y);
    const newHash = this.hash(newX, newY);

    obj.position.x = newX;
    obj.position.y = newY;

    if (oldHash !== newHash) {
      // remove do slot antigo
      const arr = this.grid.get(oldHash);
      if (arr) {
        const idx = arr.indexOf(obj);
        if (idx !== -1) arr.splice(idx, 1);
        if (arr.length === 0) this.grid.delete(oldHash);
      }

      // add no novo
      if (!this.grid.has(newHash)) this.grid.set(newHash, []);
      this.grid.get(newHash)!.push(obj);
    }
  }

  // Retorna todos os objetos na célula atual + vizinhas
  queryNeighbors(obj: Vec2): T[] {
    const cx = Math.floor(obj.position.x / this.cellSize);
    const cy = Math.floor(obj.position.y / this.cellSize);

    const results: T[] = [];

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const h = `${cx + dx},${cy + dy}`;
        const bucket = this.grid.get(h);
        if (bucket) results.push(...bucket);
      }
    }

    return results;
  }
}
