type HTTPMethods =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

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

class NavigableAI {
  private sharedSecretKeyConfig: SharedSecretKeyConfig | undefined = undefined;
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
      this.console.log("Open chat window");

      const el = this.chatWindow.get();
      if (!el) {
        return false;
      }

      // Check and set identifier
      if (identifier && this.identifier !== identifier) {
        this.identifier = identifier;
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

      el.classList.add("ai-chat-window");
      el.innerHTML = `
      <div class="ai-chat-window-container">
        <div class="ai-chat-window-header">
          <div class="ai-chat-window-header-left">
            ${this.chatWindow.defaults.logo}
            <h2 class="ai-chat-window-title" aria-label="Assistant">Assistant</h2>
          </div>
          <div class="ai-chat-window-header-right">
            <button class="ai-chat-window-header-close" aria-label="Close">
              ${this.chatWindow.defaults.closeIcon}
            </button>
          </div>
        </div>
        <div class="ai-chat-window-messages">
          ${this.chatWindow.messages
            .map((message) => {
              const shouldRenderMarkdown =
                this.chatWindow.markdown &&
                this.showdown.converter &&
                message.sender === "ASSISTANT";
              const content = shouldRenderMarkdown
                ? this.showdown.converter.makeHtml(message.content)
                : message.content;
              this.console.log("content", content);
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
                this.actions[actionName]();
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
                this.actions[actionName]();
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
  };
  public api = {
    sendMessage: {
      run: async (message: string) => {
        if (!message) {
          throw new Error("Message is required");
        }

        this.chatWindow.assistantResponding = true;
        this.chatWindow.addMessage({
          sender: "USER",
          content: message,
          new: false,
          createdAt: new Date(),
          action: null,
        });
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
        const configuredActions = Object.keys(this.actions);
        if (configuredActions.length) {
          body.configuredActions = configuredActions;
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
          this.actions[data.data.action]();
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
        });
      },
      method: "POST",
      url: "",
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

        this.chatWindow.messages = data.data;
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
        });
      },
      method: "GET",
      url: "",
    },
  };
  private autoRunActions: boolean = false;
  public actions = {} as Record<string, Function>;

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
          this.console.log(
            "Showdown loaded. Converter: ",
            this.showdown.converter
          );
          resolve((window as any).showdown);
        };
        script.onerror = () => reject(new Error("Failed to load Showdown"));
        document.head.appendChild(script);
      });
    },
    converter: null as any,
  };

  constructor(options: NavigableAIOptions) {
    if (!options.id) {
      this.console.error("div with id is required");
      return;
    }

    const el = document.getElementById(options.id);
    if (!el) {
      this.console.error("div not found with id", options.id);
      return;
    }

    if (options.markdown) {
      this.chatWindow.markdown = true;
      this.showdown.load();
    }

    this.chatWindow.id = options.id;

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
    }
  }
}

export { NavigableAI };

if (typeof window !== "undefined") {
  (window as any).NavigableAI = NavigableAI;
}