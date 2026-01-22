import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useCopilotContext } from "../../context/copilot-context";
import { DeveloperConsoleModal } from "./developer-console-modal";
import { CopilotIcon } from "./icons";

export const ConsoleTrigger = defineComponent({
    name: "ConsoleTrigger",
    setup() {
        const context = useCopilotContext();
        const isOpen = ref(false);
        const position = ref({ x: 20, y: 20 }); // Bottom-left default? Or fixed?

        // Dragging logic (simplified for now)
        // In React version it seemed to have dragging.

        const toggleOpen = () => {
            isOpen.value = !isOpen.value;
        };

        return () => {
            if (!context.showDevConsole) return null;

            return (
                <>
                    <div
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            left: "20px",
                            zIndex: 9999,
                            cursor: "pointer",
                            backgroundColor: "white",
                            borderRadius: "50%",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                            padding: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={toggleOpen}
                    >
                        <CopilotIcon />
                    </div>
                    {isOpen.value && <DeveloperConsoleModal onClose={() => (isOpen.value = false)} />}
                </>
            );
        };
    },
});
