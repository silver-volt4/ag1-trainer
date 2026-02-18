import { BinaryTreeVertex, BTWrappedVertex } from "../binary_tree/binary_tree.svelte";
import { BSTree } from "../bst/binary_search_tree.svelte";

export class AVLTree extends BSTree {
    public root: AVLTreeVertex | null = $state(null);

    public insert(value: number): AVLTreeVertex {
        let v = super.insert(value) as AVLTreeVertex;
        return v;
    }

    public createVertex(value: number): AVLTreeVertex {
        let vertex = new AVLTreeVertex(this);
        vertex.vertex.value = value;
        return vertex;
    }
}

export class AVLTreeVertex extends BinaryTreeVertex {
    vertex: BTWrappedVertex = $state(new BTWrappedVertex());

    protected tree: AVLTree;
    protected weight: -2 | -1 | 0 | 1 | 2 = 0;

    parent: AVLTreeVertex | null = $state(null);
    left: AVLTreeVertex | null = $state(null);
    right: AVLTreeVertex | null = $state(null);

    constructor(binaryTree: AVLTree) {
        super(binaryTree);
        this.tree = binaryTree;
    }
}