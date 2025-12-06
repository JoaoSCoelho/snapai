type Point<T> = {
  coords: number[];
  value: T;
};

class KDNode<T> {
  point: Point<T>;
  axis: number;
  left: KDNode<T> | null = null;
  right: KDNode<T> | null = null;

  constructor(point: Point<T>, axis: number) {
    this.point = point;
    this.axis = axis;
  }
}

export class KDTree<T> {
  private root: KDNode<T> | null = null;
  private k: number;

  constructor(k: number) {
    this.k = k;
  }

  // -----------------------------
  // INSERT
  // -----------------------------
  protected _insert(point: Point<T>) {
    if (point.coords.length !== this.k)
      throw new Error("Ponto inválido: dimensão incorreta.");

    const insertRec = (
      node: KDNode<T> | null,
      point: Point<T>,
      depth: number,
    ): KDNode<T> => {
      if (node === null) return new KDNode(point, depth % this.k);

      const axis = node.axis;

      if (point.coords[axis] < node.point.coords[axis]) {
        node.left = insertRec(node.left, point, depth + 1);
      } else {
        node.right = insertRec(node.right, point, depth + 1);
      }
      return node;
    };

    this.root = insertRec(this.root, point, 0);
  }

  // -----------------------------
  // REMOVE
  // -----------------------------
  protected _remove(point: Point<T>) {
    const areEqual = (a: Point<T>, b: Point<T>) =>
      a.coords.length === b.coords.length &&
      a.coords.every((v, i) => v === b.coords[i]);

    const findMin = (
      node: KDNode<T> | null,
      dim: number,
      depth: number,
    ): KDNode<T> => {
      if (!node) throw new Error("Árvore inconsistente.");

      const axis = node.axis;

      if (axis === dim) {
        if (node.left) return findMin(node.left, dim, depth + 1);
        return node;
      }

      const leftMin = node.left ? findMin(node.left, dim, depth + 1) : null;
      const rightMin = node.right ? findMin(node.right, dim, depth + 1) : null;

      let min = node;
      for (const candidate of [leftMin, rightMin]) {
        if (candidate && candidate.point.coords[dim] < min.point.coords[dim]) {
          min = candidate;
        }
      }
      return min;
    };

    const removeRec = (
      node: KDNode<T> | null,
      point: Point<T>,
      depth: number,
    ): KDNode<T> | null => {
      if (node === null) return null;

      const axis = node.axis;

      if (areEqual(node.point, point)) {
        // Caso 1: tem filho à direita
        if (node.right) {
          const min = findMin(node.right, axis, depth + 1);
          node.point = min.point;
          node.right = removeRec(node.right, min.point, depth + 1);
          return node;
        }

        // Caso 2: somente filho à esquerda
        if (node.left) {
          const min = findMin(node.left, axis, depth + 1);
          node.point = min.point;
          node.right = removeRec(node.left, min.point, depth + 1);
          node.left = null;
          return node;
        }

        // Caso 3: nó folha
        return null;
      }

      if (point.coords[axis] < node.point.coords[axis]) {
        node.left = removeRec(node.left, point, depth + 1);
      } else {
        node.right = removeRec(node.right, point, depth + 1);
      }
      return node;
    };

    this.root = removeRec(this.root, point, 0);
  }

  // -----------------------------
  // FILTER (range query)
  // limits: [[min0,max0], [min1,max1], ...]
  // -----------------------------
  filter(limits: [number, number][]): T[] {
    if (limits.length !== this.k)
      throw new Error("Dimensão incorreta nos limites.");

    const results: T[] = [];

    const inRange = (p: Point<T>): boolean =>
      p.coords.every(
        (value, dim) => value >= limits[dim][0] && value <= limits[dim][1],
      );

    const searchRec = (node: KDNode<T> | null) => {
      if (!node) return;

      const axis = node.axis;
      const [min, max] = limits[axis];

      // Se o ponto estiver dentro da região
      if (inRange(node.point)) results.push(node.point.value);

      // Explorar esquerda se pode haver pontos lá
      if (min <= node.point.coords[axis]) searchRec(node.left);

      // Explorar direita
      if (max >= node.point.coords[axis]) searchRec(node.right);
    };

    searchRec(this.root);
    return results;
  }
}
