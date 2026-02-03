<script lang="ts">
    import type { Component } from "svelte";
    import BinaryHeapViewer from "./lib/binary_heap/BinaryHeapViewer.svelte";
    import BinarySearchTreeViewer from "./lib/bst/BinarySearchTreeViewer.svelte";

    let currentScreen: Screen | null = $state(null);

    let screens: {[key: string]: Screen} = {
        binaryHeap: {
            title: "Binary heap",
            component: BinaryHeapViewer,
        },
        binarySearchTree: {
            title: "Binary Search Tree",
            component: BinarySearchTreeViewer,
        },
    };

    interface Screen {
        title: string;
        component: Component;
    }

    let fullscreenElement: Element | undefined = $state();

    function fullscreen() {
        if (fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }
    }

    function setTool(tool: string) {
        currentScreen = screens[tool];
    }
</script>

<svelte:document bind:fullscreenElement />

<div
    class="h-full w-full flex flex-col gap-2 p-2 box-border dark:text-white text-black dark:bg-slate-900 bg-slate-300"
>
    <div
        class="dark:bg-slate-950 bg-slate-200 rounded-lg overflow-hidden p-2 flex"
    >
        <div class="grow">
            AG1 Trainer
            {#if currentScreen}{' >> '}{currentScreen.title}{/if}
        </div>
        <div>
            <button onclick={fullscreen}>Full screen</button>
        </div>
    </div>
    {#if currentScreen}
        {@const Component = currentScreen.component}
        <Component/>
    {:else}
        Select tool:
        <button onclick={() => setTool("binaryHeap")}>Binary heap</button>
        <button onclick={() => setTool("binarySearchTree")}>Binary search tree</button>
    {/if}
</div>
