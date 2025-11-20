import { defineComponent, PropType } from "vue";
import { useCopilotContext } from "../../context/copilot-context";

export const DeveloperConsoleModal = defineComponent({
    name: "DeveloperConsoleModal",
    props: {
        onClose: {
            type: Function as PropType<() => void>,
            required: true,
        },
    },
    setup(props) {
        const context = useCopilotContext();

        return () => (
            <div
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    height: "80%",
                    backgroundColor: "white",
                    zIndex: 10000,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    padding: "20px",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                    <h2>CopilotKit Dev Console</h2>
                    <button onClick={props.onClose}>Close</button>
                </div>
                <div style={{ flex: 1, overflow: "auto" }}>
                    <h3>Context</h3>
                    <pre>{JSON.stringify(context, null, 2)}</pre>
                    {/* Add more debug info here */}
                </div>
            </div>
        );
    },
});
