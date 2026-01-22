import { defineComponent, ref, provide, inject, PropType, TransitionGroup } from "vue";
import { ExclamationMarkIcon } from "./exclamation-mark-icon";

export interface Toast {
    id: string;
    message: string;
    type?: "info" | "error" | "success" | "warning";
    duration?: number;
}

export interface ToastContextType {
    addToast: (toast: Omit<Toast, "id">) => void;
}

export const ToastContext = Symbol("ToastContext");

export function useToast() {
    const context = inject<ToastContextType>(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export const ToastProvider = defineComponent({
    name: "ToastProvider",
    setup(_, { slots }) {
        const toasts = ref<Toast[]>([]);

        const addToast = (toast: Omit<Toast, "id">) => {
            const id = Math.random().toString(36).substring(7);
            const newToast = { ...toast, id };
            toasts.value.push(newToast);

            if (toast.duration !== 0) {
                setTimeout(() => {
                    removeToast(id);
                }, toast.duration || 3000);
            }
        };

        const removeToast = (id: string) => {
            toasts.value = toasts.value.filter((t) => t.id !== id);
        };

        provide(ToastContext, {
            addToast,
        });

        return () => (
            <>
                {slots.default?.()}
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 10000,
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                >
                    <TransitionGroup name="toast">
                        {toasts.value.map((toast) => (
                            <div
                                key={toast.id}
                                style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    padding: "12px 16px",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    minWidth: "200px",
                                    maxWidth: "400px",
                                    border: "1px solid #eee",
                                }}
                            >
                                <ExclamationMarkIcon
                                    style={{ width: "20px", height: "20px", color: "#f59e0b" }}
                                />
                                <span style={{ fontSize: "14px" }}>{toast.message}</span>
                            </div>
                        ))}
                    </TransitionGroup>
                </div>
            </>
        );
    },
});
