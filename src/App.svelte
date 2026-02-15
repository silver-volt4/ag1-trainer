<script lang="ts">
    import type { TrainerToolDescription } from "./lib/tool_description";

    let currentScreen: TrainerToolDescription | null = $state(null);

    const tools: { [key: string]: TrainerToolDescription } = import.meta.glob(
        "./lib/*/tool.ts",
        { eager: true, import: "default" },
    );

    let fullscreenElement: Element | undefined = $state();

    function fullscreen() {
        if (fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }
    }

    function setTool(tool: TrainerToolDescription) {
        currentScreen = tool;
    }

    function goToMainMenu() {
        currentScreen = null;
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
            <button onclick={goToMainMenu}>AG1 Trainer</button>
            {#if currentScreen}{" >> "}{currentScreen.title}{/if}
        </div>
        <div>
            <button onclick={fullscreen}>Full screen</button>
        </div>
    </div>
    {#if currentScreen}
        {@const Component = currentScreen.component}
        <Component />
    {:else}
        Select tool:
        {#each Object.values(tools) as tool}
            <button onclick={() => setTool(tool)}>{tool.title}</button>
        {/each}
    {/if}
</div>
