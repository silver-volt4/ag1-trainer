<script lang="ts">
  import { scale } from "svelte/transition";
  import { BaseGraph, type IEdge, type IVertex } from "./graph.svelte";
    import Vertex from "./Vertex.svelte";

  let {
    graph,
  }: {
    graph: BaseGraph<IVertex, IEdge>;
  } = $props();

  let viewportWidth = $state(0);
  let viewportHeight = $state(0);

  let centerX = $state(0);
  let centerY = $state(0);
  let zoom = $state(3.0);

  let viewBox = $derived(
    `${centerX - viewportWidth / (2 * zoom)} ${centerY - viewportHeight / (2 * zoom)} ${viewportWidth / zoom} ${viewportHeight / zoom}`,
  );

  function onwheel(event: WheelEvent) {
    zoom = Math.max(1.0, (zoom -= event.deltaY / 200));
  }

  function onmousedown(event: MouseEvent) {
    const AUXILIARY_BUTTON_ID = 1; // this refers to the middle mouse button
    if (event.button === AUXILIARY_BUTTON_ID) {
      window.addEventListener("mousemove", mousemove);
      window.addEventListener(
        "mouseup",
        (e: MouseEvent) => {
          if (e.button === AUXILIARY_BUTTON_ID) {
            window.removeEventListener("mousemove", mousemove);
          }
        },
        { once: true },
      );
    }
  }

  function mousemove(event: MouseEvent) {
    centerX -= event.movementX / zoom;
    centerY -= event.movementY / zoom;
  }
</script>

<div
  class="h-full w-full overflow-hidden relative"
  bind:clientWidth={viewportWidth}
  bind:clientHeight={viewportHeight}
  {onwheel}
  {onmousedown}
  role="presentation"
  aria-roledescription="Graph visualizer"
>
  <div class="absolute top-0 left-0">
    {centerX}
    {centerY}
  </div>
  <svg {viewBox} class="h-full w-full">
    {#each graph.getEdges() as edge (edge)}
      <path
        d="M{edge.from.x} {edge.from.y} L{edge.to.x} {edge.to.y}"
        class="dark:stroke-white stroke-black"
      />
    {/each}
    {#each graph.getVertices() as vertex (vertex)}
      <Vertex {vertex}/>
    {/each}
  </svg>
</div>

<style>
  g {
    transform-origin: center;
    transform-box: fill-box;
    transition: transform 1s;
  }
</style>
