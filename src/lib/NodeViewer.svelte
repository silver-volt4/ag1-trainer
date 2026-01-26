<script lang="ts">
  interface Node {
    x: number;
    y: number;
  }

  interface Edge {
    a: Node;
    b: Node;
    oriented?: boolean;
  }

  let {
    nodes,
    edges,
  }: {
    nodes: Node[];
    edges: Edge[];
  } = $props();

  let width = $state(0);
  let height = $state(0);
  let centerX = $state(0);
  let centerY = $state(0);

  let zoom = $state(1.0);

  let viewBox = $derived(
    `${centerX - width / (2 * zoom)} ${centerY - height / (2 * zoom)} ${width / zoom} ${height / zoom}`,
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
  bind:clientWidth={width}
  bind:clientHeight={height}
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
      <path d="M{edge.a.x} {edge.a.y} L{edge.b.x} {edge.b.y}" stroke="black"/>
    {/each}
    {#each nodes as node}
      <circle cx={node.x} cy={node.y} r={10} fill="red" />
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
</style>
