import {
    TextareaHTMLAttributes,
    forwardRef,
    useImperativeHandle,
    useRef,
} from 'react';

export type TextareaHandle = {
    expand(): string;
    reset(): string;
    shrink(): string;
};

export const Textarea = forwardRef<
    TextareaHandle,
    TextareaHTMLAttributes<HTMLTextAreaElement>
>((props, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(
        ref,
        () => {
            const textareaEl = textareaRef.current!;

            const defaultHeight = 60;
            const maxHeight = 300;

            return {
                expand() {
                    const expandedHeight = Math.min(
                        textareaEl?.scrollHeight + 2,
                        maxHeight,
                    );
                    textareaEl.style.height = `${expandedHeight}px`;

                    return `${expandedHeight}px`;
                },
                shrink() {
                    const textareaLineHeight = window
                        .getComputedStyle(textareaEl)
                        .getPropertyValue('line-height');

                    const computedHeightOfNewLines =
                        (textareaEl?.value.split('\n').length - 1) *
                        parseInt(textareaLineHeight);

                    const shrunkHeight = Math.max(
                        computedHeightOfNewLines,
                        defaultHeight,
                    );

                    textareaEl.style.height = `${shrunkHeight}px`;

                    return `${shrunkHeight}px`;
                },
                reset() {
                    textareaEl.style.height = `${defaultHeight}px`;
                    return `${defaultHeight}px`;
                },
            };
        },
        [],
    );

    return <textarea ref={textareaRef} {...props} children={props.value} />;
});

Textarea.displayName = 'Textarea';

export default Textarea;
