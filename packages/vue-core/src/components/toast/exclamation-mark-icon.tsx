import { defineComponent, PropType } from "vue";

export const ExclamationMarkIcon = defineComponent({
    name: "ExclamationMarkIcon",
    props: {
        class: String,
        style: Object as PropType<any>,
    },
    setup(props) {
        return () => (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={props.class}
                style={props.style}
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
        );
    },
});
