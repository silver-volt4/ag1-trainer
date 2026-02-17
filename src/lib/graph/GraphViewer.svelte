<script lang="ts">
  import type { Snippet } from "svelte";
  import { BaseGraph, type IEdge, type IVertex } from "./graph.svelte";
  import {
    mouseViewportController,
    touchViewportController,
    ViewportController,
  } from "./graph_controls.svelte";
  import Vertex from "./Vertex.svelte";
  import { slide } from "svelte/transition";

  let {
    graph,
    contextMenu,
  }: {
    graph: BaseGraph<IVertex, IEdge>;
    contextMenu?: Snippet<[IVertex]>;
  } = $props();

  let viewportController = new ViewportController();

  let contextMenuPosX = $state(0);
  let contextMenuPosY = $state(0);
  let contextMenuElement: HTMLElement | undefined = $state(undefined);
  let contextMenuFocus: IVertex | null = $state(null);
</script>

<svelte:window
  onmousedown={(e: MouseEvent) => {
    if (e.button !== 0) return;
    if (!contextMenuFocus || !contextMenuElement) return;
    if (!contextMenuElement.contains(e.target as Node)) {
      contextMenuFocus = null;
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
>
  <svg
    viewBox={viewportController.viewBox}
    class="cursor-move absolute top-0 left-0 bottom-0 right-0"
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
          contextMenuFocus = vertex;
        }}
      />
    {/each}
  </svg>
</div>

{#if contextMenu && contextMenuFocus}
  <div
    bind:this={contextMenuElement}
    transition:slide
    class="fixed dark:bg-slate-800 bg-slate-300 shadow p-2 rounded-lg"
    style:left={`${contextMenuPosX}px`}
    style:top={`${contextMenuPosY}px`}
  >
    {@render contextMenu(contextMenuFocus)}
  </div>
{/if}
