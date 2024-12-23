type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
interface SharedSecretKeyConfig {
    /**
     * Shared secret key. Should be securely added on the client. Should be same as the one on your server.
     */
    sharedSecretKey: string;
    /**
     * Placement of the shared secret key in your request.
     */
    placement: "query" | "header";
    /**
     * Name of the shared secret key field in your request, wherever it is placed.
     */
    key: string;
}
interface APIUrlConfig {
    /**
     * HTTP Method
     */
    method: HTTPMethods;
    /**
     * Full URL of the API endpoint
     */
    url: string;
}
interface IChatSendMessageResponse {
    statusCode: number;
    success: boolean;
    message: string;
    errors?: Record<string, string>;
    data: {
        assistantMessage: string;
        action: string | null;
        identifier: string;
    };
}
interface IChatGetMessageResponse {
    statusCode: number;
    success: boolean;
    message: string;
    errors?: Record<string, string>;
    data: {
        sender: "USER" | "ASSISTANT" | "ASSISTANT-LOADING" | "ERROR";
        content: string;
        new: boolean;
        createdAt: Date;
        action: string | null;
    }[];
}
interface RequestConfig extends APIUrlConfig {
    headers?: Record<string, string>;
    body?: Record<string, string>;
    signaturePayload?: string;
}
interface NavigableAIOptions {
    /**
     * HTML id of the div to render the chat window.
     */
    id: string;
    /**
     * Unique identifier of your user.
     */
    identifier?: string;
    /**
     * Configuration for the shared secret key.
     */
    sharedSecretKeyConfig?: SharedSecretKeyConfig;
    /**
     * Enable markdown in the chat window. This will dynamically import showdown to convert markdown to HTML.
     */
    markdown?: boolean;
    /**
     * Configuration for your Navigable AI proxy API endpoints.
     */
    apiConfig?: {
        /**
         * Proxy API endpoint config for sending messages to the assistant.
         */
        sendMessage?: APIUrlConfig;
        /**
         * Proxy API endpoint config for getting the last 20 messages in the conversation.
         */
        getMessages?: APIUrlConfig;
    };
    actions?: Record<string, Function>;
    /**
     * Automatically run an action suggested by the assistant.
     *
     * @default false
     */
    autoRunActions?: boolean;
    defaults?: {
        /**
         * Error message to be shown if the request fails.
         */
        error?: string;
        /**
         * Title of the chat window. Default is "Assistant".
         */
        title?: string;
        /**
         * Placeholder text for the input field.
         */
        inputPlaceholder?: string;
        /**
         * Logo for the chat window. HTML string. Default is a sparkles icon.
         */
        logo?: string;
        /**
         * Icon for the close button. HTML string. Default is a cross icon.
         */
        closeIcon?: string;
        /**
         * Icon for the send button. HTML string. Default is a send icon.
         */
        sendIcon?: string;
        /**
         * Loader for the chat window message when the assistant response is loading. HTML string. Default is a dots animation.
         */
        loader?: string;
    };
}
declare class NavigableAI {
    private sharedSecretKeyConfig;
    identifier: string | undefined;
    setIdentifier: (identifier: string) => void;
    getIdentifierFromLocalStorage: () => void;
    chatWindow: {
        id: string | undefined;
        messages: IChatGetMessageResponse["data"];
        defaults: {
            error: string;
            title: string;
            logo: string;
            closeIcon: string;
            sendIcon: string;
            loader: string;
            inputPlaceholder: string;
        };
        assistantResponding: boolean;
        markdown: boolean;
        isOpen: () => boolean;
        open: (identifier?: string) => boolean;
        close: () => boolean;
        toggle: () => boolean;
        get: () => HTMLDivElement | null;
        set: () => boolean;
        addMessage: (messageData: IChatGetMessageResponse["data"][0]) => void;
        reset: () => void;
        scrollToBottom: () => null | undefined;
        eventListeners: {
            cleanup: () => void;
            add: () => null | undefined;
        };
        messagesSection: {
            get: () => HTMLDivElement | null;
        };
        closeButton: {
            get: () => HTMLButtonElement | null;
        };
        messageInput: {
            get: () => HTMLTextAreaElement | null;
            submitOnEnter: (e: KeyboardEvent) => void;
        };
        messageForm: {
            get: () => HTMLFormElement | null;
            onsubmit: () => null | undefined;
        };
    };
    api: {
        sendMessage: {
            run: (message: string) => Promise<{
                assistantMessage: string;
                action: string | null;
                identifier: string;
            } | null>;
            request: (message: string, body?: Record<string, any>) => Promise<{
                data: IChatSendMessageResponse;
            } | null>;
            method: string;
            url: string;
        };
        getMessages: {
            run: () => Promise<{
                sender: "USER" | "ASSISTANT" | "ASSISTANT-LOADING" | "ERROR";
                content: string;
                new: boolean;
                createdAt: Date;
                action: string | null;
            }[] | null>;
            request: (identifier: string) => Promise<{
                data: IChatGetMessageResponse;
            } | null>;
            method: string;
            url: string;
        };
    };
    private autoRunActions;
    actions: Record<string, Function>;
    private arrayBufferToHex;
    generateSignature: (payload: string) => Promise<string | null>;
    request: (config: RequestConfig) => Promise<{
        data: any;
        headers: Headers;
        ok: boolean;
        redirected: boolean;
        status: number;
        statusText: string;
        type: ResponseType;
        url: string;
        clone(): Response;
        body: ReadableStream<Uint8Array> | null;
        bodyUsed: boolean;
        arrayBuffer(): Promise<ArrayBuffer>;
        blob(): Promise<Blob>;
        bytes(): Promise<Uint8Array>;
        formData(): Promise<FormData>;
        json(): Promise<any>;
        text(): Promise<string>;
    } | null>;
    console: {
        log: (...args: any[]) => void;
        error: (...args: any[]) => void;
    };
    localStorage: {
        set: (key: string, value: any) => void;
        get: (key: string) => any;
    };
    encoder: {
        base64: {
            encode: (str: string) => string;
            decode: (str: string) => string;
        };
    };
    private showdown;
    constructor(options: NavigableAIOptions);
}
export { NavigableAI };
