# Navigable AI Chat SDK

The **Navigable AI Chat SDK** provides an easily embeddable and customizable chat interface to integrate AI assistant capabilities into your web application. This documentation will guide you through the installation, setup, and usage of the SDK, along with reference information on the main functions available.

---

## Features

- Fully customizable chat UI.
- Seamless integration with backend APIs.
- Add your actions for extended UX functionality.
- Lightweight and responsive design.

---

## Installation

To get started, include the required files in your project:

### CSS

```html
<link rel="stylesheet" href="../dist/styles.css" />
```

### JavaScript

```html
<script src="../dist/index.js"></script>
```

---

## Setup and Usage

### HTML

Add a container for the chat window in your HTML:

```html
<div id="navigableai-chat"></div>
```

### JavaScript

Initialize the Navigable AI Chat SDK:

```javascript
const navigableai = new NavigableAI({
  id: "navigableai-chat",
  apiConfig: {
    sendMessage: {
      url: "http://localhost:4000/assistant/send-message", // Replace with your proxy server endpoint
      method: "POST",
    },
    getMessages: {
      url: "http://localhost:4000/assistant/get-messages", // Replace with your proxy server endpoint
      method: "GET",
    },
  },
  actions: {
    "Contact Support": () => {
      window.location.href = "https://www.example.com/support"; // Replace with logic to handle your actions
    },
  },
  identifier: "<your user's unique identifier>", // optional
  sharedDataKeyConfig: {
    // Optional, but recommended for additional security
    sharedDataKey: "<your shared data key>",
    placement: "<header | query>", // Where to send the signed data, request header or url query
    key: "x-request-signature", // Header key or query key
  },
});
```

### Example Usage

#### Open or Toggle the chat window

```javascript
document.querySelector("#open-button")?.addEventListener("click", () => {
  console.log("Button clicked");
  navigableai.chatWindow.open();
});

document.querySelector("#toggle-button")?.addEventListener("click", () => {
  console.log("Button toggled");
  navigableai.chatWindow.toggle();
});
```

## Via NPM

```bash
npm install navigableai-web
```

### Import the Navigable AI Chat SDK

```javascript
import { NavigableAI } from "navigableai-web";
```

---

## NavigableAI Options

The `NavigableAIOptions` interface defines all the configurable options you can pass when instantiating the `NavigableAI` class. These options control the behavior and appearance of the AI assistant.

### 1. `id` (string) **Required**

- **Description**: This is the HTML `id` of the div element where the chat window will be rendered. The assistant will be displayed inside this container.
- **Example**:

  ```html
  <div id="navigableai-chat"></div>
  ```

### 2. `identifier` (string) **Optional**

- **Description**: A unique identifier for the user interacting with the assistant. This helps track user sessions or personalize the experience. If not provided, a unique identifier will be automatically generated.
- **Example**:

  ```javascript
  identifier: "user-12345";
  ```

### 3. `sharedSecretKeyConfig` (SharedSecretKeyConfig) **Optional**

- **Description**: Configuration for the shared secret key used in API requests to ensure secure communication between the client and server.
- **Properties**:

  - `sharedSecretKey` (string): The secret key to be used for authentication. This should be securely stored.
  - `placement` ("query" | "header"): Specifies whether the key should be placed in the URL query or HTTP headers.
  - `key` (string): The key name for the secret in your request.

  **Example**:

  ```javascript
  sharedSecretKeyConfig: {
    sharedSecretKey: "your-secret-key",
    placement: "header", // Can also be "query"
    key: "Authorization"
  }
  ```

### 4. `apiConfig` (object) **Optional**

- **Description**: Configuration for the proxy API endpoints used to send and retrieve messages. It defines how the assistant communicates with your backend.

- **Properties**:

  - `sendMessage` (APIUrlConfig): **Required to send messages**

    - `url` (string): The full URL endpoint for sending messages to the assistant. This is a `POST` endpoint that accepts user input.
    - `method` (HTTPMethods): The HTTP method to use for sending messages. Usually, `POST`.

  - `getMessages` (APIUrlConfig): **Required to get message history if passing your user identifier**
    - `url` (string): The full URL endpoint for retrieving the latest messages. Typically, this is a `GET` endpoint that fetches the assistant's responses.
    - `method` (HTTPMethods): The HTTP method to use for retrieving messages. Typically, `GET`.

  **Example**:

  ```javascript
  apiConfig: {
    sendMessage: {
      url: "https://your-server.com/send-message",
      method: "POST"
    },
    getMessages: {
      url: "https://your-server.com/get-messages",
      method: "GET"
    }
  }
  ```

### 5. `actions` (Record<string, Function>) **Optional**

- **Description**: A map of custom actions that can be triggered by the assistant. The key is the name of the action, and the value is the function to execute when that action is triggered (e.g., when a user clicks a button).

  **Example**:

  ```javascript
  actions: {
    "Contact Support": () => {
      console.log("Contact Support action triggered");
      // Custom logic for contacting support, such as opening a support form or sending an email.
    },
    "Open Help": () => {
      window.open("https://your-site.com/help");
    }
  }
  ```

### 6. `autoRunActions` (boolean) **Optional**

- **Description**: When set to `true`, the assistant will automatically execute any actions suggested by the assistant itself. This is helpful for automating tasks based on AI responses.
- **Default**: `false`
- **Example**:
  ```javascript
  autoRunActions: true;
  ```

### 7. `defaults` (object) **Optional**

- **Description**: This object contains default values for the chat window, including visual and messaging options.

- **Properties**:

  - `error` (string): The error message displayed if the API request fails.
  - `title` (string): The title of the chat window, which appears at the top. Default is "Assistant".
  - `inputPlaceholder` (string): Placeholder text for the input field.
  - `logo` (string): HTML string for the logo to be displayed in the header. The default is a sparkles icon.
  - `closeIcon` (string): HTML string for the close button icon. The default is a cross icon.
  - `sendIcon` (string): HTML string for the send button icon. The default is a send icon.
  - `loader` (string): HTML string for the loader animation displayed while the assistant is typing or processing a response. The default is a dots animation.

  **Example**:

  ```javascript
  defaults: {
    error: "An error occurred. Please try again later.",
    title: "Assistant",
    inputPlaceholder: "Type your message here...",
    logo: `<svg class="ai-chat-window-header-logo" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>`,
    closeIcon: `<svg class="ai-chat-window-header-close-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`,
    sendIcon: `<svg class="ai-chat-window-input-send-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-4.98 3.66l-.163 .01l-.086 .016l-.142 .045l-.113 .054l-.07 .043l-.095 .071l-.058 .054l-4 4l-.083 .094a1 1 0 0 0 1.497 1.32l2.293 -2.293v5.586l.007 .117a1 1 0 0 0 1.993 -.117v-5.585l2.293 2.292l.094 .083a1 1 0 0 0 1.32 -1.497l-4 -4l-.082 -.073l-.089 -.064l-.113 -.062l-.081 -.034l-.113 -.034l-.112 -.02l-.098 -.006z" /></svg>`,
    loader: `<div class="ai-chat-window-loader">
        <div></div>
        <div></div>
        <div></div>
      </div>`,
    inputPlaceholder: "Type your message here...",
  }
  ```

---

### Summary of Instantiation Options

| Option                  | Type                                  | Description                                                             | Default        |
| ----------------------- | ------------------------------------- | ----------------------------------------------------------------------- | -------------- |
| `id`                    | `string`                              | The HTML id of the div to render the chat window.                       | -              |
| `identifier`            | `string` (optional)                   | Unique identifier for the user.                                         | Auto-generated |
| `sharedSecretKeyConfig` | `SharedSecretKeyConfig` (optional)    | Configuration for the shared secret key used in API requests.           | -              |
| `apiConfig`             | `object` (optional)                   | Configuration for API endpoints.                                        | -              |
| `actions`               | `Record<string, Function>` (optional) | Custom actions triggered by the assistant.                              | -              |
| `autoRunActions`        | `boolean` (optional)                  | Whether actions suggested by the assistant should be automatically run. | `false`        |
| `defaults`              | `object` (optional)                   | Default values for visual elements and messages.                        | -              |

## Color Customization

You can customize the appearance of the chat window by overriding CSS variables in your styles. The SDK uses a set of CSS variables (defined in the `:root` selector) to manage colors for various elements. By defining these variables in your styles, you can fully control the visual theme of the chat window to match your brand or design preferences.

### CSS Variables

Here are the available CSS variables and their descriptions:

| Variable                                       | Default Value | Description                                    |
| ---------------------------------------------- | ------------- | ---------------------------------------------- |
| `--ai-chat-window-color-outline`               | `#cccccc75`   | Outline color for focus and hover states.      |
| `--ai-chat-window-color-border`                | `#3782e2`     | Border color for the chat window.              |
| `--ai-chat-window-color-header`                | `white`       | Text color for the header.                     |
| `--ai-chat-window-color-bg-header`             | `#3782e2`     | Background color for the header.               |
| `--ai-chat-window-color-close-button`          | `white`       | Icon color for the close button.               |
| `--ai-chat-window-color-bg-close-button-hover` | `#6ba4f0`     | Background color of the close button on hover. |
| `--ai-chat-window-color-message-loader`        | `#3782e2`     | Loader animation color for messages.           |
| `--ai-chat-window-color-message-user`          | `black`       | Text color for user messages.                  |
| `--ai-chat-window-color-bg-message-user`       | `#daf5ff`     | Background color for user messages.            |
| `--ai-chat-window-color-message-assistant`     | `black`       | Text color for assistant messages.             |
| `--ai-chat-window-color-bg-message-assistant`  | `#e7e7e7`     | Background color for assistant messages.       |
| `--ai-chat-window-color-border-action`         | `#3782e2`     | Border color for action buttons.               |
| `--ai-chat-window-color-message-error`         | `black`       | Text color for error messages.                 |
| `--ai-chat-window-color-bg-message-error`      | `#ffd6d6`     | Background color for error messages.           |
| `--ai-chat-window-color-send-button`           | `#3782e2`     | Color for the send button.                     |
| `--ai-chat-window-color-scrollbar-thumb`       | `#888`        | Color for the scrollbar thumb.                 |
| `--ai-chat-window-color-scrollbar-thumb-hover` | `#555`        | Color for the scrollbar thumb on hover.        |

#### Example: Customizing Colors

To customize the chat window colors, define these variables in your CSS file or `<style>` tag. For example:

```css
:root {
  --ai-chat-window-color-border: #ff5733; /* Change border to a vibrant orange */
  --ai-chat-window-color-bg-header: #333; /* Darken the header background */
  --ai-chat-window-color-header: #fff; /* Ensure header text is readable */
  --ai-chat-window-color-bg-message-user: #f0e68c; /* Light yellow for user messages */
  --ai-chat-window-color-bg-message-assistant: #add8e6; /* Light blue for assistant messages */
}
```

### Applying the Custom CSS

Make sure this CSS is loaded in your project, either through a linked stylesheet or an inline `<style>` tag in your HTML file:

```html
<head>
  <link rel="stylesheet" href="styles.css" />
</head>
```

#### Live Preview

The changes should reflect immediately in the chat window after the styles are applied.

## API Customization and Signature Management

The Navigable AI SDK provides flexibility to customize API calls for compatibility with your server setup. You can override the default `getMessages` and `sendMessage` request methods to suit your backend implementation.

### Customizing API Requests

You can redefine the `getMessages` and `sendMessage` request methods within the `api` object of the Navigable AI instance.

#### Default Implementation of `getMessages` Request

The default implementation retrieves the last 20 messages for the user. It requires an `identifier` to query the messages.

```typescript
navigableai.api.getMessages.request = (
  identifier: string
): Promise<{ data: IChatGetMessageResponse } | null> => {
  return this.request({
    method: this.api.getMessages.method as HTTPMethods,
    url: `${this.api.getMessages.url}?identifier=${identifier}`,
    signaturePayload: identifier, // Used if shared secret key is enabled. Request handles this internally.
  });
};
```

#### Default Implementation of `sendMessage` Request

The default implementation sends a user message along with additional data if needed.

```typescript
navigableai.api.sendMessage.request = async (
  message: string,
  body: Record<string, any> = {}
): Promise<{ data: IChatSendMessageResponse } | null> => {
  return await this.request({
    method: this.api.sendMessage.method as HTTPMethods,
    url: this.api.sendMessage.url,
    body,
    signaturePayload: message, // Used if shared secret key is enabled. Request handles this internally.
  });
};
```

### Customizing Requests

You can replace these default implementations with your custom logic as long as the return type remains the same (`Promise<{ data: IChatGetMessageResponse } | null>` for `getMessages` and `Promise<{ data: IChatSendMessageResponse } | null>` for `sendMessage`).

Example:

```javascript
navigableai.api.getMessages.request = (identifier) => {
  return fetch(`https://example.com/messages?user=${identifier}`, {
    method: "GET",
  }).then((response) => response.json());
};

navigableai.api.sendMessage.request = async (message, body) => {
  return await fetch("https://example.com/send-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, ...body }),
  }).then((response) => response.json());
};
```

### Signature Generation

If your implementation uses a shared secret key for request authentication, you can leverage the SDK's built-in `generateSignature` method to compute the HMAC signature.

#### Default Signature Generation

The `generateSignature` method creates an HMAC signature using the shared secret key. This is automatically used in the default request methods if `sharedSecretKeyConfig` is provided during instantiation.

#### Key Considerations for Shared Secret Key Usage

1. **Configuring `sharedSecretKeyConfig`**: Ensure that you provide a valid configuration for `sharedSecretKeyConfig` during the SDK initialization.
2. **Custom Requests**: If you implement custom API request logic, you can use the `generateSignature` method for creating the required signature to authenticate your requests.

Example of generating a signature for a custom request:

```typescript
const signature = await navigableai.generateSignature(identifier);
```

3. **Signature Placement**: Based on your `sharedSecretKeyConfig`, ensure the signature is placed either in the query parameters or headers of your request, as specified by the `placement` option.

## License

This project is licensed under the ISC License.

---

Feel free to fork and modify the SDK according to your needs!

---
