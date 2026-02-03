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

  let touchDelta: { x: number; y: number } | null = null;
  let dist: number | null = null;

  function ontouchstart(event: TouchEvent) {
    event.preventDefault();
    if (event.touches.length === 1) {
      touchDelta = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      dist = null;
    }
    window.addEventListener("touchmove", ontouchmove, { passive: false });
    window.addEventListener(
      "touchend",
      () => {
        window.removeEventListener("touchmove", ontouchmove);
      },
      { once: true },
    );
  }

  function ontouchmove(event: TouchEvent) {
    event.preventDefault();
    if (event.touches.length === 1) {
      if (touchDelta) {
        centerX -= (event.touches[0].clientX - touchDelta.x) / zoom;
        centerY -= (event.touches[0].clientY - touchDelta.y) / zoom;
      }
      touchDelta = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else if (event.touches.length === 2) {
      
      let newDist = Math.sqrt(
        event.touches[0].clientX * event.touches[1].clientX +
        event.touches[0].clientY * event.touches[1].clientY,
      );
      if (dist) {
        zoom = Math.max(1.0, zoom + (dist - newDist) / 10);
      }
      dist = newDist;
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
  {ontouchstart}
  role="presentation"
  aria-roledescription="Graph visualizer"
>
  <svg {viewBox} class="h-full w-full">
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
