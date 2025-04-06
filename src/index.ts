type HTTPMethods =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

type AgentFunction = (
  args?: Record<string, any>
) =>
  | Promise<string | boolean>
  | ((args?: Record<string, any>) => string | boolean);

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

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    /**
     * JSON string of arguments
     */
    arguments: string;
  };
}

export interface IChatSendMessageResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  data: {
    assistantMessage: string;
    action: string | null;
    identifier: string;
    toolCalls: ToolCall[];
  };
}

interface IChatGetMessageResponse {
  statusCode: number;
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  data: IMessage[];
}

interface IMessage {
  sender: "USER" | "ASSISTANT" | "ASSISTANT-LOADING" | "ERROR" | "TOOL";
  content: string;
  new: boolean;
  createdAt: Date;
  action: string | null;
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
  id?: string;
  /**
   * Your agent embed ID.
   */
  embedId?: string;
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
  /**
   * Navigation actions to be suggested by the assistant.
   */
  actions?: Record<string, Function | string | null>;
  /**
   * Automatically run an action suggested by the assistant.
   *
   * @default false
   */
  autoRunActions?: boolean;
  /**
   * Functions that can be automated through the assistant. The function should return a string with a status message or simply true for success and false for error.
   */
  agentFunctions?: Record<string, AgentFunction>;
  /**
   * Default values for the chat window.
   */
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
    /**
     * Button for the chat window. HTML string. Default is a button.
     */
    widgetButton?: string;
  };
  /**
   * Enable dark mode for the chat window.
   */
  darkTheme?: boolean;
  /**
   * Disable the widget button in the chat window. Default is false.
   */
  widgetButtonDisabled?: boolean;
  /**
   * Position of the widget button in the chat window. Default is "bottom-right".
   */
  widgetButtonPosition?: "bottom-right" | "bottom-left";
  /**
   * Default message to be shown when the user opens the chat window for the first time.
   */
  welcomeMessage?: string;
  /**
   * Default actions to suggest to the user when the user opens the chat window for the first time.
   */
  welcomeActions?: string[];
}

const ENDPOINTS = {
  CHAT: "https://www.navigable.ai/api/embed/v1/chat",
};

class NavigableAI {
  private sharedSecretKeyConfig: SharedSecretKeyConfig | undefined = undefined;
  public elementId: string = "navigableai-chat-window";
  public embedId: string | undefined = undefined;
  public identifier: string | undefined = undefined;
  public setIdentifier = (identifier: string) => {
    this.identifier = identifier;
    this.localStorage.set("identifier", identifier);
  };
  public getIdentifierFromLocalStorage = () => {
    const identifier = this.localStorage.get("identifier");
    if (identifier) {
      this.identifier = identifier;
    }
  };
  public welcomeMessage: string | undefined = undefined;
  public welcomeActions: string[] | undefined = undefined;
  public widget = {
    enabled: true,
    id: "ai-chat-window-widget-button",
    position: "bottom-right",
    get: () => {
      if (this.widget.enabled && this.widget.id) {
        const el = document.getElementById(this.widget.id);
        if (el) {
          return el;
        }
      }

      return null;
    },
    set: (options?: { position?: "bottom-right" | "bottom-left" }) => {
      const el = this.widget.get();
      if (!el) {
        return null;
      }

      if (options?.position) {
        if (
          options.position === "bottom-right" ||
          options.position === "bottom-left"
        ) {
          this.widget.position = options.position;
        } else if (options.position === "bottom-left") {
          this.widget.position = "bottom-left";
        }
      }

      el.classList.remove(
        "ai-chat-window-widget-button-bottom-left",
        "ai-chat-window-widget-button-bottom-right"
      );
      el.classList.add(`ai-chat-window-widget-button-${this.widget.position}`);

      el.removeEventListener("click", () => this.chatWindow.toggle());
      el.addEventListener("click", () => this.chatWindow.toggle());
    },
  };
  public chatWindow = {
    id: undefined as string | undefined,
    messages: [] as IChatGetMessageResponse["data"],
    defaults: {
      error: "An error occurred. Please try again later.",
      title: "Assistant",
      logo: `<svg class="ai-chat-window-header-logo" aria-hidden="true"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>`,
      closeIcon: `<svg class="ai-chat-window-header-close-icon" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`,
      sendIcon: `<svg class="ai-chat-window-input-send-icon" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-4.98 3.66l-.163 .01l-.086 .016l-.142 .045l-.113 .054l-.07 .043l-.095 .071l-.058 .054l-4 4l-.083 .094a1 1 0 0 0 1.497 1.32l2.293 -2.293v5.586l.007 .117a1 1 0 0 0 1.993 -.117v-5.585l2.293 2.292l.094 .083a1 1 0 0 0 1.32 -1.497l-4 -4l-.082 -.073l-.089 -.064l-.113 -.062l-.081 -.034l-.113 -.034l-.112 -.02l-.098 -.006z" /></svg>`,
      loader: `<div class="ai-chat-window-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>`,
      inputPlaceholder: "Type your message here...",
      widgetButton: `<button id="ai-chat-window-widget-button" aria-label="Open assistant">
        <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message-bolt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8" /><path d="M8 13h6" /><path d="M13 18l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5" /><path d="M19 16l-2 3h4l-2 3" /></svg>
      </button>`,
    },
    assistantResponding: false,
    markdown: false,
    isOpen: () => {
      const el = this.chatWindow.get();
      if (!el) {
        return false;
      }
      return el.style.display === "block";
    },
    open: (identifier?: string) => {
      const el = this.chatWindow.get();
      if (!el) {
        return false;
      }

      // Check and set identifier
      if (identifier && this.identifier !== identifier) {
        this.identifier = identifier;
        this.api.getMessages.run();
      }

      this.chatWindow.set();

      el.style.display = "block";

      this.chatWindow.scrollToBottom();
      this.chatWindow.messageInput.get()?.focus();

      return true;
    },
    close: () => {
      const el = this.chatWindow.get();
      if (!el) {
        return false;
      }

      this.chatWindow.messageInput.get()?.blur();

      el.style.display = "none";
      return true;
    },
    toggle: () => {
      if (this.chatWindow.isOpen()) {
        return this.chatWindow.close();
      } else {
        return this.chatWindow.open();
      }
    },
    get: () => {
      if (this.chatWindow.id) {
        return document.getElementById(
          this.chatWindow.id
        ) as HTMLDivElement | null;
      }
      return null;
    },
    set: () => {
      const el = this.chatWindow.get();
      if (!el) {
        return false;
      }

      const lastMessageTimeWasMoreThanAnHourAgo = () => {
        if (this.chatWindow.messages.length === 0) return true;

        return (
          new Date(
            this.chatWindow.messages[
              this.chatWindow.messages.length - 1
            ].createdAt
          ).getTime() <
          new Date().getTime() - 3600000
        );
      };

      const welcomeMessage = () => {
        if (!this.welcomeMessage) {
          return "";
        }

        const message: IMessage = {
          sender: "ASSISTANT",
          content: this.welcomeMessage,
          new: false,
          createdAt: new Date(),
          action: null,
        };
        const shouldRenderMarkdown =
          this.chatWindow.markdown &&
          this.showdown.converter &&
          message.sender === "ASSISTANT";
        const content = shouldRenderMarkdown
          ? this.showdown.converter.makeHtml(message.content)
          : message.content;
        const messageStyle = shouldRenderMarkdown
          ? ""
          : "white-space: pre-wrap";

        const validWelcomeActions = this.welcomeActions?.filter(
          (action) => this.actions[action]
        );

        return `
                <div class="ai-chat-window-message ${`ai-chat-window-message-${message.sender.toLowerCase()}`}">
                  ${`<div aria-label="${message.sender} ${
                    message.content
                  }" style="${messageStyle}">${content}${
                    validWelcomeActions && validWelcomeActions.length
                      ? `<br/>${validWelcomeActions
                          .map(
                            (action) =>
                              `<button class="ai-chat-window-message-action" aria-label="${action}" data-ai-chat-window-message-action="${action}">${action}</button>`
                          )
                          .join("")}`
                      : ""
                  } </div>`}   
                </div>`;
      };

      el.classList.add("ai-chat-window");
      el.innerHTML = `
      <div class="ai-chat-window-container">
        <div class="ai-chat-window-header">
          <div class="ai-chat-window-header-left">
            ${this.chatWindow.defaults.logo}
            <h2 class="ai-chat-window-title" aria-label="${
              this.chatWindow.defaults.title
            }">${this.chatWindow.defaults.title}</h2>
          </div>
          <div class="ai-chat-window-header-right">
            <button class="ai-chat-window-header-close" aria-label="Close">
              ${this.chatWindow.defaults.closeIcon}
            </button>
          </div>
        </div>
        <div class="ai-chat-window-messages">
        ${
          !lastMessageTimeWasMoreThanAnHourAgo()
            ? this.welcomeMessage && this.welcomeMessage.length
              ? welcomeMessage()
              : ""
            : ""
        }
          ${this.chatWindow.messages
            .map((message) => {
              const shouldRenderMarkdown =
                this.chatWindow.markdown &&
                this.showdown.converter &&
                message.sender === "ASSISTANT";
              const content = shouldRenderMarkdown
                ? this.showdown.converter.makeHtml(message.content)
                : message.content;
              const messageStyle = shouldRenderMarkdown
                ? ""
                : "white-space: pre-wrap";

              return `
                <div class="ai-chat-window-message ${`ai-chat-window-message-${message.sender.toLowerCase()}`}">
                  ${
                    message.sender === "USER" || message.sender === "ASSISTANT"
                      ? `<div aria-label="${message.sender} ${
                          message.content
                        }" style="${messageStyle}">${content}${
                          message.action
                            ? this.actions[message.action]
                              ? `<br/><button class="ai-chat-window-message-action" aria-label="${message.action}" data-ai-chat-window-message-action="${message.action}">${message.action}</button>`
                              : ""
                            : ""
                        } </div>`
                      : message.sender === "ASSISTANT-LOADING"
                      ? this.chatWindow.defaults.loader
                      : `<p aria-label="${message.sender} ${message.content}">${this.chatWindow.defaults.error}</p>`
                  }   
                </div>
                `;
            })
            .join("")}
            ${
              this.chatWindow.messages.length === 0 ||
              lastMessageTimeWasMoreThanAnHourAgo()
                ? this.welcomeMessage && this.welcomeMessage.length
                  ? welcomeMessage()
                  : ""
                : ""
            }
        </div>
        <div class="ai-chat-window-input-section">
          <form id="ai-chat-window-input-form">
            <div class="ai-chat-window-input-section-container">
              <textarea 
                type="text" 
                class="ai-chat-window-input-field"
                name="message"
                aria-label="Type your message here..."
                placeholder="${this.chatWindow.defaults.inputPlaceholder}"
                ${this.chatWindow.assistantResponding ? `disabled="true"` : ""} 
                rows="1"
                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"
              ></textarea>
              <button 
                class="ai-chat-window-input-send"
                aria-label="Send"
                type="submit"
              >
                ${this.chatWindow.defaults.sendIcon}
              </button>
            </div>
          </form>
        </div>
      </div>`;

      this.chatWindow.eventListeners.add();

      this.chatWindow.scrollToBottom();
      this.chatWindow.messageInput.get()?.focus();

      return true;
    },
    addMessage: (messageData: IChatGetMessageResponse["data"][0]) => {
      this.chatWindow.messages.push(messageData);
    },
    reset: () => {
      this.chatWindow.messages = [];
      this.chatWindow.set();
    },
    scrollToBottom: () => {
      const el = this.chatWindow.messagesSection.get();
      if (!el) {
        return null;
      }

      el.scrollTop = el.scrollHeight;
    },
    eventListeners: {
      cleanup: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return;
        }

        const closeButton = this.chatWindow.closeButton.get();
        if (closeButton) {
          closeButton.removeEventListener("click", this.chatWindow.close);
        }

        const messageForm = this.chatWindow.messageForm.get();
        if (messageForm) {
          messageForm.removeEventListener(
            "click",
            this.chatWindow.messageForm.onsubmit
          );
        }

        const messageInput = this.chatWindow.messageInput.get();
        if (messageInput) {
          messageInput.removeEventListener(
            "keydown",
            this.chatWindow.messageInput.submitOnEnter
          );
        }

        const actionButtons = el.querySelectorAll(
          "[data-ai-chat-window-message-action]"
        ) as NodeListOf<HTMLButtonElement> | null;
        if (actionButtons) {
          actionButtons.forEach((button) => {
            const actionName = button.getAttribute(
              "data-ai-chat-window-message-action"
            );
            if (actionName && this.actions[actionName]) {
              button.removeEventListener("click", () => {
                this.actionHandler(actionName);
              });
            }
          });
        }
      },
      add: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return null;
        }
        this.chatWindow.eventListeners.cleanup();

        const closeButton = this.chatWindow.closeButton.get();
        if (closeButton) {
          closeButton.addEventListener("click", this.chatWindow.close);
        }

        const messageForm = this.chatWindow.messageForm.get();
        if (messageForm) {
          messageForm.addEventListener(
            "submit",
            this.chatWindow.messageForm.onsubmit
          );
        }

        const messageInput = this.chatWindow.messageInput.get();
        if (messageInput) {
          messageInput.addEventListener(
            "keydown",
            this.chatWindow.messageInput.submitOnEnter
          );
        }

        const actionButtons = el.querySelectorAll(
          "[data-ai-chat-window-message-action]"
        ) as NodeListOf<HTMLButtonElement> | null;
        if (actionButtons) {
          actionButtons.forEach((button) => {
            const actionName = button.getAttribute(
              "data-ai-chat-window-message-action"
            );
            if (actionName && this.actions[actionName]) {
              button.addEventListener("click", () => {
                this.actionHandler(actionName);
              });
            }
          });
        }
      },
    },
    messagesSection: {
      get: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return null;
        }
        return el.querySelector(
          ".ai-chat-window-messages"
        ) as HTMLDivElement | null;
      },
    },
    closeButton: {
      get: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return null;
        }
        return el.querySelector(
          ".ai-chat-window-header-close"
        ) as HTMLButtonElement | null;
      },
    },
    messageInput: {
      get: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return null;
        }
        return el.querySelector(
          ".ai-chat-window-input-field"
        ) as HTMLTextAreaElement | null;
      },
      set: (value?: string) => {
        if (!value) {
          this.console.error(
            "No value provided to messageInput.set(value: string)"
          );
          return null;
        }
        const el = this.chatWindow.messageInput.get();
        if (!el) {
          return null;
        }

        el.value = value;
        return el;
      },
      submitOnEnter: (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.chatWindow.messageForm.onsubmit();
        }
      },
    },
    messageForm: {
      get: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return null;
        }
        return el.querySelector(
          "#ai-chat-window-input-form"
        ) as HTMLFormElement | null;
      },
      onsubmit: () => {
        const el = this.chatWindow.messageForm.get();
        if (!el) {
          return null;
        }

        const input = this.chatWindow.messageInput.get();
        if (!input || !input.value.trim().length) {
          return null;
        }

        if (this.chatWindow.assistantResponding) {
          return null;
        }

        this.api.sendMessage.run(input.value);
      },
    },
    theme: {
      isLight: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return false;
        }
        return !el.classList.contains("ai-chat-window-dark-theme");
      },
      light: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return null;
        }

        el.classList.remove("ai-chat-window-dark-theme");
      },
      dark: () => {
        const el = this.chatWindow.get();
        if (!el) {
          return null;
        }

        el.classList.add("ai-chat-window-dark-theme");
      },
      toggle: () => {
        const isLight = this.chatWindow.theme.isLight();
        if (isLight) {
          this.chatWindow.theme.dark();
        } else {
          this.chatWindow.theme.light();
        }
      },
    },
  };
  public agentFunctionCall = async (toolCall: ToolCall) => {
    const functionName = toolCall.function.name;
    const args = toolCall.function.arguments;

    try {
      const parsedArgs = JSON.parse(args);

      if (
        !this.agentFunctions[functionName] ||
        typeof this.agentFunctions[functionName] !== "function"
      ) {
        this.console.error("Function not found: " + functionName);
        throw new Error(`Function ${functionName} must be a function`);
      }

      const result = await this.agentFunctions[functionName](parsedArgs);

      if (typeof result === "string") {
        this.api.sendMessage.run(result, {
          functionCallId: toolCall.id,
        });
      } else if (typeof result === "boolean") {
        this.api.sendMessage.run(result.toString(), {
          functionCallId: toolCall.id,
        });
      } else {
        throw new Error("Function Response must be a string or boolean");
      }
    } catch (error) {
      this.console.error(error);
      if (error instanceof Error) {
        this.api.sendMessage.run(error.message, {
          functionCallId: toolCall.id,
        });
      } else {
        this.api.sendMessage.run("Error: An unknown error occurred", {
          functionCallId: toolCall.id,
        });
      }
    }
  };
  public api = {
    sendMessage: {
      run: async (
        message: string,
        options?: {
          functionCallId?: string;
        }
      ) => {
        if (!message) {
          throw new Error("Message is required");
        }

        this.chatWindow.assistantResponding = true;
        if (!options?.functionCallId) {
          this.chatWindow.addMessage({
            sender: "USER",
            content: message,
            new: false,
            createdAt: new Date(),
            action: null,
          });
        }
        this.chatWindow.addMessage({
          sender: "ASSISTANT-LOADING",
          content: "",
          new: false,
          createdAt: new Date(),
          action: null,
        });
        this.chatWindow.set();

        const body: Record<string, any> = {
          message,
        };

        if (this.identifier) {
          body.identifier = this.identifier;
        }
        if (this.chatWindow.markdown && this.showdown.converter) {
          body.markdown = true;
        }
        const configuredActions = Object.keys(this.actions).filter(
          (action) =>
            typeof this.actions[action] === "function" ||
            typeof this.actions[action] === "string"
        );
        if (configuredActions.length) {
          body.configuredActions = configuredActions;
        }
        const configuredFunctions = Object.keys(this.agentFunctions).filter(
          (functionName) =>
            typeof this.agentFunctions[functionName] === "function"
        );
        if (configuredFunctions.length) {
          body.configuredFunctions = configuredFunctions;
        }
        if (options?.functionCallId) {
          body.functionCallId = options.functionCallId;
        }

        const res = await this.api.sendMessage.request(message, body);

        this.chatWindow.assistantResponding = false;
        this.chatWindow.messages.pop();

        if (!res || !res.data || !res.data.data) {
          this.console.error("Failed to send message.");
          this.chatWindow.addMessage({
            sender: "ERROR",
            content: this.chatWindow.defaults.error,
            new: false,
            createdAt: new Date(),
            action: null,
          });
          this.chatWindow.set();

          return null;
        }

        const data = res.data as IChatSendMessageResponse;

        this.chatWindow.addMessage({
          sender: "ASSISTANT",
          content: data.data.assistantMessage,
          new: false,
          createdAt: new Date(),
          action: data.data.action,
        });
        this.chatWindow.set();

        if (data.data.identifier && this.identifier !== data.data.identifier) {
          this.identifier = data.data.identifier;
          this.localStorage.set("identifier", this.identifier);
        }

        if (
          data.data.action &&
          this.actions[data.data.action] &&
          this.autoRunActions
        ) {
          this.actionHandler();
        }

        if (data.data.toolCalls && data.data.toolCalls.length > 0) {
          data.data.toolCalls.forEach((toolCall) => {
            this.agentFunctionCall(toolCall);
          });
        }

        return data.data;
      },
      request: async (
        message: string,
        body: Record<string, any> = {}
      ): Promise<{ data: IChatSendMessageResponse } | null> => {
        return await this.request({
          method: this.api.sendMessage.method as HTTPMethods,
          url: this.api.sendMessage.url,
          body,
          signaturePayload: message,
          headers: {
            "x-embed-id": this.embedId || "",
          },
        });
      },
      method: "POST",
      url: ENDPOINTS.CHAT,
    },
    getMessages: {
      run: async () => {
        if (!this.identifier) {
          return [] as IChatGetMessageResponse["data"];
        }

        const res = await this.api.getMessages.request(this.identifier);

        if (!res || !res.data || !res.data.data) {
          this.console.error(
            `Failed to get messages for identifier ${this.identifier}.`
          );
          return null;
        }

        const data = res.data as IChatGetMessageResponse;

        if (this.chatWindow.messages.length === 0) {
          this.chatWindow.messages = data.data;
        } else if (this.chatWindow.messages.length === 2) {
          this.chatWindow.messages = [
            ...this.chatWindow.messages,
            ...data.data,
          ];
        } else {
          this.chatWindow.messages = data.data;
        }
        this.chatWindow.set();

        return data.data;
      },
      request: (
        identifier: string
      ): Promise<{ data: IChatGetMessageResponse } | null> => {
        return this.request({
          method: this.api.getMessages.method as HTTPMethods,
          url: `${this.api.getMessages.url}?identifier=${identifier}`,
          signaturePayload: identifier,
          headers: {
            "x-embed-id": this.embedId || "",
          },
        });
      },
      method: "GET",
      url: ENDPOINTS.CHAT,
    },
  };
  public goTo = (path: string) => {
    this.console.log("Navigating to:", path);
    if (!window || typeof window === "undefined") {
      return;
    }

    window.location.href = path;
  };

  /**
   * Action handler for the assistant.
   */
  public actionHandler = (action?: string) => {
    if (!action) {
      return;
    }

    const handler = this.actions[action];

    this.console.log("Running action:", action, handler);

    if (typeof handler === "string") {
      this.goTo(handler);
    } else if (typeof handler === "function") {
      handler();
    }
  };
  private autoRunActions: boolean = false;
  /**
   * Navigation actions to be suggested by the assistant.
   */
  public actions = {} as Record<string, Function | string | null>;
  /**
   * Functions that can be automated through the assistant. The function should return a string with a status message or simply true for success and false for error.
   */
  public agentFunctions = {} as Record<string, AgentFunction>;

  private arrayBufferToHex = async (buffer: ArrayBuffer): Promise<string> => {
    return new Promise((resolve) => {
      const hex = Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
      resolve(hex);
    });
  };

  public generateSignature = async (payload: string) => {
    if (!this.sharedSecretKeyConfig) {
      this.console.error(
        "sharedSecretKeyConfig is not set. Please set sharedSecretKeyConfig while initializing NavigableAI."
      );
      return null;
    }
    try {
      const encoder = new TextEncoder();
      const keyBuffer = encoder.encode(
        this.sharedSecretKeyConfig.sharedSecretKey
      );
      const payloadBuffer = encoder.encode(payload);

      const key = await crypto.subtle.importKey(
        "raw",
        keyBuffer,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign("HMAC", key, payloadBuffer);

      return await this.arrayBufferToHex(signature);
    } catch (error) {
      this.console.error("Error generating signature:", error);
      return null;
    }
  };

  public request = async (config: RequestConfig) => {
    try {
      let url = config.url;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...config.headers,
      };
      const body: Record<string, string> = {
        ...config.body,
      };

      if (
        this.sharedSecretKeyConfig &&
        this.sharedSecretKeyConfig.sharedSecretKey &&
        this.sharedSecretKeyConfig.placement &&
        this.sharedSecretKeyConfig.key &&
        config.signaturePayload
      ) {
        const signature = await this.generateSignature(config.signaturePayload);

        if (!signature) {
          throw new Error("Failed to generate signature");
        }

        if (this.sharedSecretKeyConfig.placement === "query") {
          url += `?${this.sharedSecretKeyConfig.key}=${signature}`;
        } else if (this.sharedSecretKeyConfig.placement === "header") {
          headers[this.sharedSecretKeyConfig.key] = signature;
        } else {
          throw new Error(
            `Invalid placement for shared secret key. Placement must be 'query', 'header', or 'body'. Found: ${this.sharedSecretKeyConfig.placement}`
          );
        }
      }

      const res = await fetch(url, {
        method: config.method,
        headers,
        body: ["OPTIONS", "HEAD", "GET", "DELETE"].includes(config.method)
          ? undefined
          : JSON.stringify(body),
      });
      const data = await res.json();
      return {
        ...res,
        data,
      };
    } catch (error) {
      this.console.error(`Error in request: ${error}\nConfig: ${config}`);
      return null;
    }
  };
  public console = {
    log: (...args: any[]) => {
      console.log("NavigableAI:", ...args);
    },
    error: (...args: any[]) => {
      console.error("NavigableAI:", ...args);
    },
  };
  public localStorage = {
    set: (key: string, value: any) => {
      localStorage.setItem(
        this.encoder.base64.encode(key),
        this.encoder.base64.encode(JSON.stringify(value))
      );
    },
    get: (key: string) => {
      const value = localStorage.getItem(this.encoder.base64.encode(key));
      if (!value) {
        return null;
      }
      return JSON.parse(this.encoder.base64.decode(value));
    },
  };
  public encoder = {
    base64: {
      encode: (str: string) => {
        return btoa(str);
      },
      decode: (str: string) => {
        return atob(str);
      },
    },
  };
  private showdown = {
    load: () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js";
        script.onload = () => {
          this.showdown.converter = new (window as any).showdown.Converter();

          resolve((window as any).showdown);
        };
        script.onerror = () => reject(new Error("Failed to load Showdown"));
        document.head.appendChild(script);
      });
    },
    converter: null as any,
  };
  private waitForDOM = () => {
    return new Promise((resolve) => {
      if (document.readyState === "complete") {
        resolve(document);
      } else {
        document.addEventListener("DOMContentLoaded", () => {
          resolve(document);
        });
      }
    });
  };

  constructor(options: NavigableAIOptions) {
    if (options.id) {
      const targetElement = document.getElementById(options.id);
      if (targetElement) {
        this.elementId = options.id;
      }
    }

    (async () => {
      await this.waitForDOM();

      const el = document.getElementById(this.elementId);
      if (!el) {
        this.console.error("div not found with id", this.elementId);
        return;
      }

      if (options.embedId) {
        this.embedId = options.embedId;
      }

      if (options.markdown) {
        this.chatWindow.markdown = true;
        this.showdown.load();
      }

      this.chatWindow.id = this.elementId;

      if (options.sharedSecretKeyConfig) {
        this.sharedSecretKeyConfig = options.sharedSecretKeyConfig;
      }

      if (options.apiConfig) {
        if (options.apiConfig.sendMessage) {
          this.api.sendMessage.url = options.apiConfig.sendMessage.url;
          this.api.sendMessage.method = options.apiConfig.sendMessage.method;
        }

        if (options.apiConfig.getMessages) {
          this.api.getMessages.url = options.apiConfig.getMessages.url;
          this.api.getMessages.method = options.apiConfig.getMessages.method;
        }
      }

      if (options.identifier) {
        if (this.identifier !== options.identifier) {
          this.setIdentifier(options.identifier);
        } else {
          this.getIdentifierFromLocalStorage();
        }
      } else {
        this.getIdentifierFromLocalStorage();
      }

      if (this.identifier) {
        this.api.getMessages.run();
      }

      if (options.actions) {
        this.actions = options.actions;
      }

      if (options.autoRunActions) {
        this.autoRunActions = options.autoRunActions;
      }

      if (options.agentFunctions) {
        this.agentFunctions = options.agentFunctions;
      }

      if (options.defaults) {
        if (options.defaults.error) {
          this.chatWindow.defaults.error = options.defaults.error;
        }
        if (options.defaults.title) {
          this.chatWindow.defaults.title = options.defaults.title;
        }
        if (options.defaults.inputPlaceholder) {
          this.chatWindow.defaults.inputPlaceholder =
            options.defaults.inputPlaceholder;
        }
        if (options.defaults.logo) {
          this.chatWindow.defaults.logo = options.defaults.logo;
        }
        if (options.defaults.closeIcon) {
          this.chatWindow.defaults.closeIcon = options.defaults.closeIcon;
        }
        if (options.defaults.sendIcon) {
          this.chatWindow.defaults.sendIcon = options.defaults.sendIcon;
        }
        if (options.defaults.loader) {
          this.chatWindow.defaults.loader = options.defaults.loader;
        }
        if (options.defaults.widgetButton) {
          this.chatWindow.defaults.widgetButton = options.defaults.widgetButton;
        }
      }

      if (options.darkTheme) {
        this.chatWindow.theme.dark();
      }

      if (options.widgetButtonDisabled) {
        this.widget.enabled = false;
      } else {
        document.body.innerHTML =
          document.body.innerHTML + this.chatWindow.defaults.widgetButton;
      }

      if (options.widgetButtonPosition) {
        if (
          options.widgetButtonPosition === "bottom-right" ||
          options.widgetButtonPosition === "bottom-left"
        ) {
          this.widget.position = options.widgetButtonPosition;
        }
      }

      if (options.welcomeMessage) {
        if (options.welcomeMessage.length > 0) {
          this.welcomeMessage = options.welcomeMessage.trim();

          if (options.welcomeActions) {
            if (options.welcomeActions.length > 0) {
              this.welcomeActions = options.welcomeActions?.filter((action) => {
                return this.actions[action];
              });
            }
          }
        }
      }

      if (this.widget.enabled) {
        this.widget.set();
      }
    })();
  }
}

export { NavigableAI };

if (typeof window !== "undefined") {
  (window as any).NavigableAI = NavigableAI;

  const windowElement = document.createElement("div");
  windowElement.id = "navigableai-chat-window";
  document.body.appendChild(windowElement);
}
