// CONERTED BY CHATGPT from https://github.com/ubilabs/kd-tree-javascript

// kdtree.ts
// TypeScript class-based rewrite of ubilabs/kd-tree-javascript
// Behaviour preserved; adds support for dot paths in dimension names.

export interface KdNodeSerialized<T> {
  obj: T;
  left: KdNodeSerialized<T> | null;
  right: KdNodeSerialized<T> | null;
  dimension: number;
  parent: null; // parent removed to make JSON-serializable (like original)
}

class Node<T> {
  obj: T;
  left: Node<T> | null = null;
  right: Node<T> | null = null;
  parent: Node<T> | null = null;
  dimension: number;

  constructor(obj: T, dimension: number, parent: Node<T> | null) {
    this.obj = obj;
    this.dimension = dimension;
    this.parent = parent;
  }
}

export type MetricFunction<T> = (a: T, b: T) => number;

export class KdTree<T> {
  root: Node<T> | null = null;
  metric: MetricFunction<T>;
  dimensions: string[];

  constructor(
    points: T[] | Node<T>,
    metric: MetricFunction<T>,
    dimensions: string[],
  ) {
    this.metric = metric;
    this.dimensions = dimensions.slice();

    // If points is not an array, assume we loaded serialized tree
    if (!Array.isArray(points)) {
      this.loadTree(points as unknown as Node<T>);
    } else {
      this.root = this.buildTree(points as T[], 0, null);
    }
  }

  // Helper: get value by dimension string, supports dot paths ("position.x") and plain keys
  private getValueByDimension(obj: any, dimension: string): any {
    if (obj == null) return undefined;
    // dot path
    if (dimension.indexOf(".") !== -1) {
      const parts = dimension.split(".");
      let cur: any = obj;
      for (const p of parts) {
        if (cur == null) return undefined;
        cur = cur[p];
      }
      return cur;
    }
    return obj[dimension];
  }

  private buildTree(
    points: T[],
    depth: number,
    parent: Node<T> | null,
  ): Node<T> | null {
    if (points.length === 0) return null;

    const dimIndex = depth % this.dimensions.length;

    if (points.length === 1) {
      return new Node(points[0], dimIndex, parent);
    }

    const dimensionKey = this.dimensions[dimIndex];

    // Sort in place by the coordinate in current dimension
    points.sort((a, b) => {
      const va = this.getValueByDimension(a as any, dimensionKey);
      const vb = this.getValueByDimension(b as any, dimensionKey);
      // numeric comparison expected; if undefined, fallback to 0
      const na = typeof va === "number" ? va : va == null ? 0 : Number(va);
      const nb = typeof vb === "number" ? vb : vb == null ? 0 : Number(vb);
      return na - nb;
    });

    const median = Math.floor(points.length / 2);
    const node = new Node<T>(points[median], dimIndex, parent);
    node.left = this.buildTree(points.slice(0, median), depth + 1, node);
    node.right = this.buildTree(points.slice(median + 1), depth + 1, node);

    return node;
  }

  // load a previously serialized tree (like original)
  private loadTree(data: any) {
    // data is expected to be the serialized shape (no parent)
    // We will set root to the provided structure but must restore parent pointers
    const restore = (obj: any, parent: Node<T> | null): Node<T> | null => {
      if (obj == null) return null;
      const node = new Node<T>(obj.obj, obj.dimension, parent);
      node.left = restore(obj.left, node);
      node.right = restore(obj.right, node);
      return node;
    };

    this.root = restore(data as any, null);
  }

  // Convert tree to JSON-serializable structure (parent removed) — behaviour same as original
  toJSON(src?: Node<T> | null): KdNodeSerialized<T> | null {
    if (!src) src = this.root;
    if (!src) return null;

    const dest: any = {
      obj: src.obj,
      left: null,
      right: null,
      dimension: src.dimension,
      parent: null,
    };

    if (src.left) dest.left = this.toJSON(src.left);
    if (src.right) dest.right = this.toJSON(src.right);
    return dest as KdNodeSerialized<T>;
  }

  insert(point: T): void {
    const innerSearch = (
      node: Node<T> | null,
      parent: Node<T> | null,
    ): Node<T> | null => {
      if (node === null) return parent;
      const dimensionKey = this.dimensions[node.dimension];
      const val = this.getValueByDimension(point as any, dimensionKey);
      const nodeVal = this.getValueByDimension(node.obj as any, dimensionKey);
      const nVal =
        typeof val === "number" ? val : val == null ? 0 : Number(val);
      const noVal =
        typeof nodeVal === "number"
          ? nodeVal
          : nodeVal == null
            ? 0
            : Number(nodeVal);
      if (nVal < noVal) {
        return innerSearch(node.left, node);
      } else {
        return innerSearch(node.right, node);
      }
    };

    const insertPosition = innerSearch(this.root, null);

    if (insertPosition === null) {
      this.root = new Node(point, 0, null);
      return;
    }

    const newNode = new Node(
      point,
      (insertPosition.dimension + 1) % this.dimensions.length,
      insertPosition,
    );
    const dimensionKey = this.dimensions[insertPosition.dimension];

    const val = this.getValueByDimension(point as any, dimensionKey);
    const posVal = this.getValueByDimension(
      insertPosition.obj as any,
      dimensionKey,
    );
    const nVal = typeof val === "number" ? val : val == null ? 0 : Number(val);
    const pVal =
      typeof posVal === "number" ? posVal : posVal == null ? 0 : Number(posVal);

    if (nVal < pVal) {
      insertPosition.left = newNode;
    } else {
      insertPosition.right = newNode;
    }
  }

  remove(point: T): void {
    const nodeSearch = (node: Node<T> | null): Node<T> | null => {
      if (node === null) return null;
      if (node.obj === point) return node;
      const dimensionKey = this.dimensions[node.dimension];
      const val = this.getValueByDimension(point as any, dimensionKey);
      const nodeVal = this.getValueByDimension(node.obj as any, dimensionKey);
      const nVal =
        typeof val === "number" ? val : val == null ? 0 : Number(val);
      const noVal =
        typeof nodeVal === "number"
          ? nodeVal
          : nodeVal == null
            ? 0
            : Number(nodeVal);
      if (nVal < noVal) {
        return nodeSearch(node.left);
      } else {
        return nodeSearch(node.right);
      }
    };

    const removeNode = (node: Node<T>) => {
      const findMin = (nd: Node<T> | null, dim: number): Node<T> | null => {
        if (nd === null) return null;
        const dimensionKey = this.dimensions[dim];

        if (nd.dimension === dim) {
          if (nd.left !== null) {
            return findMin(nd.left, dim);
          }
          return nd;
        }

        let own = this.getValueByDimension(nd.obj as any, dimensionKey);
        let left = findMin(nd.left, dim);
        let right = findMin(nd.right, dim);
        let min = nd;

        if (left !== null) {
          const leftVal = this.getValueByDimension(
            left.obj as any,
            dimensionKey,
          );
          if (
            (typeof leftVal === "number"
              ? leftVal
              : leftVal == null
                ? 0
                : Number(leftVal)) <
            (typeof own === "number" ? own : own == null ? 0 : Number(own))
          ) {
            min = left;
          }
        }

        if (right !== null) {
          const rightVal = this.getValueByDimension(
            right.obj as any,
            dimensionKey,
          );
          const minVal = this.getValueByDimension(min.obj as any, dimensionKey);
          if (
            (typeof rightVal === "number"
              ? rightVal
              : rightVal == null
                ? 0
                : Number(rightVal)) <
            (typeof minVal === "number"
              ? minVal
              : minVal == null
                ? 0
                : Number(minVal))
          ) {
            min = right;
          }
        }

        return min;
      };

      // leaf
      if (node.left === null && node.right === null) {
        if (node.parent === null) {
          this.root = null;
          return;
        }

        const pDimensionKey = this.dimensions[node.parent.dimension];
        const nodeVal = this.getValueByDimension(
          node.obj as any,
          pDimensionKey,
        );
        const parentVal = this.getValueByDimension(
          node.parent.obj as any,
          pDimensionKey,
        );
        const nVal =
          typeof nodeVal === "number"
            ? nodeVal
            : nodeVal == null
              ? 0
              : Number(nodeVal);
        const pVal =
          typeof parentVal === "number"
            ? parentVal
            : parentVal == null
              ? 0
              : Number(parentVal);

        if (nVal < pVal) {
          node.parent.left = null;
        } else {
          node.parent.right = null;
        }
        return;
      }

      // If right subtree is not empty, swap with minimum element on node's dimension in right subtree
      if (node.right !== null) {
        const nextNode = findMin(node.right, node.dimension);
        if (nextNode === null) return;
        const nextObj = nextNode.obj;
        removeNode(nextNode);
        node.obj = nextObj;
      } else {
        const nextNode = findMin(node.left, node.dimension);
        if (nextNode === null) return;
        const nextObj = nextNode.obj;
        removeNode(nextNode);
        node.right = node.left;
        node.left = null;
        node.obj = nextObj;
      }
    };

    const node = nodeSearch(this.root);
    if (node === null) return;
    removeNode(node);
  }

  nearest(
    point: T,
    maxNodes: number,
    maxDistance?: number,
  ): Array<[T, number]> {
    if (!this.root) return [];

    const bestNodes = new BinaryHeap<[Node<T> | null, number]>((e) => -e[1]);

    const nearestSearch = (node: Node<T> | null) => {
      if (node === null) return;

      const dimensionKey = this.dimensions[node.dimension];
      const ownDistance = this.metric(point, node.obj);

      // build linear point
      const linearPoint: any = {};
      for (let i = 0; i < this.dimensions.length; i++) {
        const dKey = this.dimensions[i];
        linearPoint[dKey] =
          i === node.dimension
            ? this.getValueByDimension(point as any, dKey)
            : this.getValueByDimension(node.obj as any, dKey);
      }
      const linearDistance = this.metric(linearPoint as T, node.obj);

      const saveNode = (n: Node<T>, distance: number) => {
        bestNodes.push([n, distance]);
        if (bestNodes.size() > maxNodes) {
          bestNodes.pop();
        }
      };

      if (node.right === null && node.left === null) {
        if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()![1]) {
          saveNode(node, ownDistance);
        }
        return;
      }

      let bestChild: Node<T> | null;
      if (node.right === null) bestChild = node.left;
      else if (node.left === null) bestChild = node.right;
      else {
        const val = this.getValueByDimension(point as any, dimensionKey);
        const nodeVal = this.getValueByDimension(node.obj as any, dimensionKey);
        const v = typeof val === "number" ? val : val == null ? 0 : Number(val);
        const nv =
          typeof nodeVal === "number"
            ? nodeVal
            : nodeVal == null
              ? 0
              : Number(nodeVal);
        bestChild = v < nv ? node.left : node.right;
      }

      nearestSearch(bestChild);

      if (bestNodes.size() < maxNodes || ownDistance < bestNodes.peek()![1]) {
        saveNode(node, ownDistance);
      }

      if (
        bestNodes.size() < maxNodes ||
        Math.abs(linearDistance) < bestNodes.peek()![1]
      ) {
        const otherChild = bestChild === node.left ? node.right : node.left;
        if (otherChild !== null) nearestSearch(otherChild);
      }
    };

    if (maxDistance !== undefined) {
      for (let i = 0; i < maxNodes; i++) {
        bestNodes.push([null, maxDistance]);
      }
    }

    nearestSearch(this.root);

    const result: Array<[T, number]> = [];
    const limit = Math.min(maxNodes, bestNodes.content.length);
    for (let i = 0; i < limit; i++) {
      const entry = bestNodes.content[i];
      if (entry[0]) {
        result.push([entry[0]!.obj, entry[1]]);
      }
    }
    return result;
  }

  balanceFactor(): number {
    const height = (node: Node<T> | null): number => {
      if (node === null) return 0;
      return Math.max(height(node.left), height(node.right)) + 1;
    };

    const count = (node: Node<T> | null): number => {
      if (node === null) return 0;
      return count(node.left) + count(node.right) + 1;
    };

    const root = this.root;
    if (!root) return 0;
    return height(root) / (Math.log(count(root)) / Math.log(2));
  }
}

// BinaryHeap class rewritten in TS (same behaviour)
export class BinaryHeap<T> {
  content: T[] = [];
  scoreFunction: (e: T) => number;

  constructor(scoreFunction: (e: T) => number) {
    this.scoreFunction = scoreFunction;
    this.content = [];
  }

  push(element: T) {
    this.content.push(element);
    this.bubbleUp(this.content.length - 1);
  }

  pop(): T | undefined {
    const result = this.content[0];
    const end = this.content.pop();
    if (this.content.length > 0 && end !== undefined) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  }

  peek(): T | undefined {
    return this.content[0];
  }

  remove(node: T) {
    const len = this.content.length;
    for (let i = 0; i < len; i++) {
      if (this.content[i] === node) {
        const end = this.content.pop();
        if (i !== len - 1 && end !== undefined) {
          this.content[i] = end;
          if (this.scoreFunction(end) < this.scoreFunction(node))
            this.bubbleUp(i);
          else this.sinkDown(i);
        }
        return;
      }
    }
    throw new Error("Node not found.");
  }

  size(): number {
    return this.content.length;
  }

  private bubbleUp(n: number) {
    const element = this.content[n];
    while (n > 0) {
      const parentN = Math.floor((n + 1) / 2) - 1;
      const parent = this.content[parentN];
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        n = parentN;
      } else {
        break;
      }
    }
  }

  private sinkDown(n: number) {
    const length = this.content.length;
    const element = this.content[n];
    const elemScore = this.scoreFunction(element);

    while (true) {
      const child2N = (n + 1) * 2;
      const child1N = child2N - 1;
      let swap: number | null = null;

      if (child1N < length) {
        const child1 = this.content[child1N];
        const child1Score = this.scoreFunction(child1);
        if (child1Score < elemScore) swap = child1N;
      }

      if (child2N < length) {
        const child2 = this.content[child2N];
        const child2Score = this.scoreFunction(child2);
        if (
          child2Score <
          (swap == null ? elemScore : this.scoreFunction(this.content[child1N]))
        ) {
          swap = child2N;
        }
      }

      if (swap != null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      } else {
        break;
      }
    }
  }
}
