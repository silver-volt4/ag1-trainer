<script lang="ts">
    import { scale } from "svelte/transition";   
    import { Tween } from "svelte/motion";

    import type { IVertex } from "./graph.svelte";
    import { onMount } from "svelte";
    import { circOut } from "svelte/easing";

    let {
        vertex
    }: {
        vertex: IVertex
    } = $props();

    // svelte-ignore state_referenced_locally
    let positionX = new Tween(vertex.x, {easing: circOut, duration: 200});
    // svelte-ignore state_referenced_locally
    let positionY = new Tween(vertex.y, {easing: circOut, duration: 200});

    $effect(() => {
        positionX.set(vertex.x);
        positionY.set(vertex.y);
    })
    
</script>

<g style="transform: translate({positionX.current}px, {positionY.current}px);">
    <g transition:scale>
        <circle class="fill-blue-500" r={10} />
        {#if vertex.data?.content}
            <text
                font-size={10}
                text-anchor="middle"
                dominant-baseline="central"
            >
                {vertex.data?.content}
            </text>
        {/if}
    </g>
</g>
