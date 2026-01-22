import { defineComponent, onErrorCaptured, ref } from "vue";
import { useToast } from "../toast/toast-provider";

export const CopilotErrorBoundary = defineComponent({
    name: "CopilotErrorBoundary",
    setup(_, { slots }) {
        const { addToast } = useToast();
        const error = ref<unknown>(null);

        onErrorCaptured((err, instance, info) => {
            console.error("CopilotKit Error:", err, info);
            error.value = err;

            let message = "An error occurred in CopilotKit.";
            if (err instanceof Error) {
                message = err.message;
            }

            addToast({
                message,
                type: "error",
            });

            // Prevent error from propagating further if desired
            // return false; 
        });

        return () => {
            return slots.default?.();
        };
    },
});
