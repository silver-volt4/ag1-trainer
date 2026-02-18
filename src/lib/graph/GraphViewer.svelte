<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    BaseGraph,
    type IEdge,
    type IVertex,
    type VertexContextMenuFactory,
  } from "./graph.svelte";
  import {
    mouseViewportController,
    touchViewportController,
    ViewportController,
  } from "./graph_controls.svelte";
  import Vertex from "./Vertex.svelte";
  import { slide } from "svelte/transition";

  let {
    graph,
    contextMenu = () => null,
  }: {
    graph: BaseGraph<IVertex, IEdge>;
    contextMenu?: VertexContextMenuFactory;
  } = $props();

  let viewportController = new ViewportController();

  let contextMenuPosX = $state(0);
  let contextMenuPosY = $state(0);
  let contextMenuElement: HTMLElement | undefined = $state(undefined);
  let contextMenuVertex: IVertex | null = $state.raw(null);

  let contextMenuSnippet: Snippet<any[]> | null = $state(null);
</script>

<svelte:window
  onmousedown={(e: MouseEvent) => {
    if (e.button !== 0) return;
    if (!contextMenuSnippet || !contextMenuElement) return;
    if (!contextMenuElement.contains(e.target as Node)) {
      contextMenuSnippet = null;
    }
  }}
/>

<div
  class="h-full w-full overflow-hidden relative"
  bind:clientWidth={viewportController.viewportWidth}
  bind:clientHeight={viewportController.viewportHeight}
  {@attach mouseViewportController(viewportController)}
  {@attach touchViewportController(viewportController)}
  role="presentation"
  aria-roledescription="Graph visualizer"
  oncontextmenu={(e: MouseEvent) => {
    e.preventDefault();
    contextMenuPosX = e.clientX;
    contextMenuPosY = e.clientY;
    contextMenuSnippet = contextMenu(null);
  }}
>
  <svg
    viewBox={viewportController.viewBox}
    class="cursor-move absolute top-0 left-0 bottom-0 right-0"
    role="presentation"
  >
    {#each graph.getEdges() as edge (edge)}
      <path
        d="M{edge.from.x} {edge.from.y} L{edge.to.x} {edge.to.y}"
        class="dark:stroke-white stroke-black"
      />
    {/each}
    {#each graph.getVertices() as vertex (vertex)}
      <Vertex
        {vertex}
        oncontextmenu={(e: MouseEvent) => {
          contextMenuPosX = e.clientX;
          contextMenuPosY = e.clientY;
          contextMenuSnippet = contextMenu(vertex);
          contextMenuVertex = vertex;
        }}
      />
    {/each}
  </svg>
</div>

{#if contextMenuSnippet}
  <div
    bind:this={contextMenuElement}
    transition:slide
    class="fixed dark:bg-slate-800 bg-slate-300 shadow rounded-lg overflow-none w-50"
    style:left={`${contextMenuPosX}px`}
    style:top={`${contextMenuPosY}px`}
  >
    {@render contextMenuSnippet(contextMenuVertex)}
  </div>
{/if}
