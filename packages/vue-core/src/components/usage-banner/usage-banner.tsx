import { defineComponent, PropType } from "vue";
import { CopilotKitError, ErrorVisibility } from "@copilotkit/shared";

export const UsageBanner = defineComponent({
    name: "UsageBanner",
    props: {
        error: {
            type: Object as PropType<CopilotKitError>,
            required: true,
        },
        onClose: {
            type: Function as PropType<() => void>,
            required: false,
        },
    },
    setup(props) {
        return () => {
            const { error, onClose } = props;

            if (error.visibility !== ErrorVisibility.BANNER) {
                return null;
            }

            return (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 10001,
                        backgroundColor: "#fef2f2",
                        color: "#991b1b",
                        padding: "12px 24px",
                        borderRadius: "0 0 8px 8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        maxWidth: "90%",
                        width: "max-content",
                        border: "1px solid #fee2e2",
                        borderTop: "none",
                    }}
                >
                    <span style={{ fontWeight: 500 }}>{error.message}</span>
                    {onClose && (
                        <button
                            onClick={onClose}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "inherit",
                                padding: "4px",
                                marginLeft: "8px",
                                opacity: 0.7,
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            );
        };
    },
});
