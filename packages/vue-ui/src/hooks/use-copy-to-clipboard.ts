import { ref } from "vue";

export interface UseCopyToClipboardProps {
    timeout?: number;
}

export function useCopyToClipboard({ timeout = 2000 }: UseCopyToClipboardProps = {}) {
    const isCopied = ref(false);

    const copyToClipboard = (text: string) => {
        if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
            return;
        }

        if (!text) {
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            isCopied.value = true;

            setTimeout(() => {
                isCopied.value = false;
            }, timeout);
        });
    };

    return { isCopied, copyToClipboard };
}
