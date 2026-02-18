import { BinaryTree, BinaryTreeVertex } from "../binary_tree/binary_tree.svelte";

export class BSTree extends BinaryTree {
    public root: BSTreeVertex | null = $state(null);

    insert(value: number): BSTreeVertex {
        let current = this.root;
        let insert: () => BSTreeVertex;

        if (!current) {
            return this.root = this.createVertex(value);
        }

        while (current !== null) {
            if (current.vertex.value === value) {
                return current;
            }

            if (value < current.vertex.value) {
                let v = current;
                insert = () => {
                    let newVertex = this.createVertex(value);
                    v.left = newVertex;
                    newVertex.parent = v;
                    return newVertex;
                };
                current = current.left;
            } else {
                let v = current;
                insert = () => {
                    let newVertex = this.createVertex(value);
                    v.right = newVertex;
                    newVertex.parent = v;
                    return newVertex;
                };
                current = current.right;
            }
        }

        return insert!();
    }

    public createVertex(value: number): BSTreeVertex {
        let vertex = new BSTreeVertex(this);
        vertex.vertex.value = value;
        return vertex;
    }

    public rotate(me: BSTreeVertex) {
        let parent = me.parent;
        if (!parent) return;
        let parentsParent = parent.parent;

        let parentTakeMyChild: "left" | "right";
        let giveParentMyChild: "left" | "right";
        
        if (parent.left === me) {
            parentTakeMyChild = "left"
            giveParentMyChild = "right"
        }
        else {
            parentTakeMyChild = "right"
            giveParentMyChild = "left"
        }

        me.parent = parentsParent;
        parent[parentTakeMyChild] = me[giveParentMyChild];
        if (me[giveParentMyChild]) {
            me[giveParentMyChild]!.parent = parent;
        }
        parent.parent = me;
        me[giveParentMyChild] = parent;

        if (parentsParent === null) {
            this.root = me;
        }
        else if (parentsParent.left === parent) {
            parentsParent.left = me;
        } else {
            parentsParent.right = me;
        }
    }
}


export class BSTreeVertex extends BinaryTreeVertex {
    protected tree: BSTree;

    parent: BSTreeVertex | null = $state(null);
    left: BSTreeVertex | null = $state(null);
    right: BSTreeVertex | null = $state(null);

    constructor(binaryTree: BSTree) {
        super(binaryTree);
        this.tree = binaryTree;
    }

    public rotate() {
        this.tree.rotate(this);
    }
}