<script lang="ts">
  import { BaseGraph, type IEdge, type IVertex } from "./graph.svelte";
  import {
    mouseViewportController,
    touchViewportController,
    ViewportController,
  } from "./graph_controls.svelte";
  import Vertex from "./Vertex.svelte";

  let { graph }: { graph: BaseGraph<IVertex, IEdge> } = $props();

  let viewportController = new ViewportController();
</script>

<div
  class="h-full w-full overflow-hidden relative"
  bind:clientWidth={viewportController.viewportWidth}
  bind:clientHeight={viewportController.viewportHeight}
  oncontextmenu={(e: Event) => e.preventDefault()}
  {@attach mouseViewportController(viewportController)}
  {@attach touchViewportController(viewportController)}
  role="presentation"
  aria-roledescription="Graph visualizer"
>
  <svg viewBox={viewportController.viewBox} class="h-full w-full">
    {#each graph.getEdges() as edge (edge)}
      <path
        d="M{edge.from.x} {edge.from.y} L{edge.to.x} {edge.to.y}"
        class="dark:stroke-white stroke-black"
      />
    {/each}
    {#each graph.getVertices() as vertex (vertex)}
      <Vertex {vertex} />
    {/each}
  </svg>
</div>
