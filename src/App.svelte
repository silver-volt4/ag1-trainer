<script lang="ts">
    import type { TrainerToolDescription } from "./lib/tool_description";
    import petersen from "./assets/petersen.svg";

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

<svelte:head>
    <link rel="icon" type="image/svg+xml" href={petersen} />
</svelte:head>

<div
    class="h-full w-full overflow-hidden flex flex-col gap-2 p-2 box-border dark:text-white text-black dark:bg-slate-900 bg-slate-300"
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
        <div class="flex items-center justify-center gap-5 my-5">
            <img src={petersen} alt="Petersen's graph" class="h-30" />
            <span class="fw-bold text-4xl"> AG1 Trainer </span>
        </div>

        <div class="text-xl">Select tool:</div>

        <div class="flex flex-wrap gap-2">
            {#each Object.values(tools) as tool}
                <button class="w-50 h-20 text-2xl" onclick={() => setTool(tool)}
                    >{tool.title}</button
                >
            {/each}
        </div>
    {/if}
</div>
