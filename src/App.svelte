<script lang="ts">
    import type { TrainerToolDescription } from "./lib/tool_description";
    import { MediaQuery } from "svelte/reactivity";
    import Logo from "./lib/Logo.svelte";

    let fullscreenedElement: HTMLElement | undefined = $state();

    function fullscreen() {
        if (fullscreenedElement) {
            document.exitFullscreen();
        } else {
            document.body.requestFullscreen();
        }
    }

    let theme: "light" | "dark" | "system" = $state("light");
    const prefersColorScheme = new MediaQuery("prefers-color-scheme: dark");
    let isSystemDarkMode = $derived(prefersColorScheme.current);

    $effect(() => {
        let themeHtml = theme;
        if (theme === "system") {
            themeHtml = isSystemDarkMode ? "dark" : "light";
        }
        document.body.setAttribute("data-theme", themeHtml);
    });

    let currentScreen: TrainerToolDescription | null = $state(null);

    const tools: { [key: string]: TrainerToolDescription } = import.meta.glob(
        "./lib/*/tool.ts",
        { eager: true, import: "default" },
    );

    function setTool(tool: TrainerToolDescription) {
        currentScreen = tool;
    }

    function goToMainMenu() {
        currentScreen = null;
    }
</script>

<svelte:document bind:fullscreenElement={fullscreenedElement} />

<div
    class="h-full w-full overflow-hidden flex flex-col gap-2 p-2 box-border background"
>
    <div class="foreground rounded-lg p-2 flex">
        <div class="grow flex items-center gap-2">
            <button
                onclick={goToMainMenu}
                class="self-start bg-transparent border-none cursor-pointer"
            >
                <Logo small={true} />
            </button>
            {#if currentScreen}
                {" >> "}{currentScreen.title}
            {/if}
        </div>
        <div class="bg-blue-400 rounded-full flex items-center gap-1 p-1 me-2">
            {#each Object.entries( { light: "Light", dark: "Dark", system: "System" }, ) as [id, name]}
                <button
                    class="rounded-full h-8 w-8 border-none"
                    onclick={() => {
                        theme = id as any;
                    }}>{name}</button
                >
            {/each}
        </div>
        <button onclick={fullscreen}>Full screen</button>
    </div>
    {#if currentScreen}
        {@const Component = currentScreen.component}
        <Component />
    {:else}
        <div class="my-5">
            <Logo />
        </div>

        <div class="text-xl">Select tool:</div>

        <div class="flex flex-wrap gap-2">
            {#each Object.values(tools) as tool}
                <button
                    class="w-50 h-20 text-2xl btn"
                    onclick={() => setTool(tool)}>{tool.title}</button
                >
            {/each}
        </div>
    {/if}
</div>
