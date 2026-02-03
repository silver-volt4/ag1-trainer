<script lang="ts">
    import BinaryHeapViewer from "./lib/binary_heap/BinaryHeapViewer.svelte";

    let fullscreenElement: Element | undefined = $state();

    function fullscreen() {
        if (fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }
    }
</script>

<svelte:document bind:fullscreenElement />

<div
    class="h-full w-full flex flex-col gap-2 p-2 box-border dark:text-white text-black dark:bg-slate-900 bg-slate-300"
>
    <div
        class="dark:bg-slate-950 bg-slate-200 rounded-lg overflow-hidden p-2 flex"
    >
        <div class="grow">AG1 Trainer</div>
        <div>
            <button onclick={fullscreen}>Full screen</button>
        </div>
    </div>
    <BinaryHeapViewer />
</div>
