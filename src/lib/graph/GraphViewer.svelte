<script lang="ts">
  import { scale } from "svelte/transition";
  import type { Vertex, Edge } from "./graph";

  let {
    vertices,
    edges,
  }: {
    vertices: Vertex[];
    edges: Edge[];
  } = $props();

  let viewportWidth = $state(0);
  let viewportHeight = $state(0);

  let centerX = $state(0);
  let centerY = $state(0);
  let zoom = $state(1.0);

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
  class="root"
  bind:clientWidth={viewportWidth}
  bind:clientHeight={viewportHeight}
  {onwheel}
  {onmousedown}
  role="presentation"
  aria-roledescription="Node visualizer"
>
  <div class="nerd">
    {centerX}
    {centerY}
  </div>
  <svg {viewBox}>
    {#each edges as edge}
      <path d="M{edge.a.x} {edge.a.y} L{edge.b.x} {edge.b.y}" stroke="black" />
    {/each}
    {#each vertices as node (node.id)}
      <g style:transform="translate({node.x}px, {node.y}px)">
        <g transition:scale>
          <circle r={10} fill="red" data-vertex-id={node.id} />
          {#if node.data?.content}
            <text font-size={10} text-anchor="middle" dominant-baseline="central">
              {node.data?.content}
            </text>
          {/if}
        </g>
      </g>
    {/each}
  </svg>
</div>

<style>
  div.root {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  div.nerd {
    position: absolute;
    top: 0;
    left: 0;
  }

  svg {
    height: 100%;
    width: 100%;
  }

  g {
    transform-origin: center;
    transform-box: fill-box;
    transition: transform 0.1s;
  }

  text {
    font-family: sans-serif;
  }
</style>
