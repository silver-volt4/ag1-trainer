<script lang="ts">
    let {
        small,
    }: {
        small?: boolean;
    } = $props();
</script>

<div class={["flex items-center justify-center", small ? "gap-2" : "gap-5"]}>
    <svg
        class={small ? "w-10" : "w-40"}
        version="1.1"
        viewBox="0 0 124 121"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="m81 89 16 25m-53-25-16 25m-21-66 26 6m64 60h-69l-21-66 56-40 54 40zm-16-25-18-57-19 57 48-35l-59 0zm-18-81v24m54 16-25 6"
            fill="none"
            class="dark:stroke-white stroke-black"
            stroke-width="1.4"
        />
        <g fill="#07f" stroke="#008"
            ><circle cx="7" cy="48" r="5" /><circle
                cx="117"
                cy="48"
                r="5"
            /><circle cx="63" cy="32" r="5" /></g
        >
        <g fill="#f00" stroke="#800"
            ><circle cx="63" cy="8" r="5" /><circle
                cx="92"
                cy="54"
                r="5"
            /><circle cx="28" cy="114" r="5" /><circle
                cx="81"
                cy="89"
                r="5"
            /></g
        >
        <g fill="#0f0" stroke="#080"
            ><circle cx="33" cy="54" r="5" /><circle
                cx="44"
                cy="89"
                r="5"
            /><circle cx="97" cy="114" r="5" /></g
        ></svg
    >
    <span class={["fw-bold", small ? "text-lg" : "text-4xl"]}> AG1 Trainer </span>
</div>
