import { onMounted, onUnmounted } from "vue";
import { CopilotChatSuggestionConfiguration } from "@vue-copilotkit/vue-core";
import { useCopilotContext } from "@vue-copilotkit/vue-core";

export interface UseCopilotChatSuggestionsProps {
    /**
     * The instructions to be used for generating suggestions.
     */
    instructions: string;

    /**
     * The minimum number of suggestions to generate.
     * @default 1
     */
    minSuggestions?: number;

    /**
     * The maximum number of suggestions to generate.
     * @default 3
     */
    maxSuggestions?: number;

    /**
     * The class name to apply to the suggestions.
     */
    className?: string;
}

export function useCopilotChatSuggestions(
    {
        instructions,
        minSuggestions = 1,
        maxSuggestions = 3,
        className,
    }: UseCopilotChatSuggestionsProps,
    dependencies: any[] = [] // Vue doesn't really use dependency arrays like React, but keeping signature similar
) {
    const { addChatSuggestionConfiguration, removeChatSuggestionConfiguration } = useCopilotContext();
    const id = Math.random().toString(36).substring(7);

    onMounted(() => {
        addChatSuggestionConfiguration(id, {
            instructions,
            minSuggestions,
            maxSuggestions,
            className,
        });
    });

    onUnmounted(() => {
        removeChatSuggestionConfiguration(id);
    });
}
