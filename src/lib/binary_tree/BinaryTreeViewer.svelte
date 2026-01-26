<script lang="ts">
  import GraphViewer from "../graph/GraphViewer.svelte";
  import { BinaryTreeVertex } from "./binary_tree.svelte";

  let { tree }: { tree: BinaryTreeVertex | null } = $props();
</script>

<GraphViewer
  vertices={tree?.plain.vertices ?? []}
  edges={tree?.plain.edges ?? []}
/>
