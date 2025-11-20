import { ref, onMounted, onUnmounted } from "vue";

export function useDarkMode() {
    const isDarkMode = ref(false);

    const checkDarkMode = () => {
        if (typeof window === "undefined") return false;
        return (
            document.documentElement.classList.contains("dark") ||
            document.body.classList.contains("dark") ||
            document.documentElement.getAttribute("data-theme") === "dark" ||
            document.body.getAttribute("data-theme") === "dark"
        );
    };

    onMounted(() => {
        isDarkMode.value = checkDarkMode();

        const observer = new MutationObserver(() => {
            isDarkMode.value = checkDarkMode();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class", "data-theme"],
        });
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class", "data-theme"],
        });

        onUnmounted(() => {
            observer.disconnect();
        });
    });

    return isDarkMode;
}
