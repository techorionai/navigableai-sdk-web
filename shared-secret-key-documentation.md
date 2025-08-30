# Shared Secret Key Documentation for NavigableAI Frontend Client

## Overview

The NavigableAI Web SDK includes a robust shared secret key implementation that provides request integrity verification between the frontend client and your backend server. This system uses HMAC-SHA256 cryptographic signatures to ensure that requests haven't been tampered with and originate from authorized clients.

## Purpose

The shared secret key serves to:

- **Verify request integrity**: Ensure that requests haven't been modified during transmission
- **Authenticate the client**: Confirm that requests originate from your authorized frontend application
- **Prevent tampering**: Detect any unauthorized modifications to request data
- **Enhance security**: Add an additional layer of protection beyond standard HTTPS

## Configuration Interface

### SharedSecretKeyConfig

The [`SharedSecretKeyConfig`](src/index.ts:16) interface defines the configuration options for shared secret key functionality:

```typescript
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
```

#### Properties

1. **`sharedSecretKey`** (string, required)

   - The actual secret key used for HMAC signature generation
   - Must be identical on both client and server
   - Should be a random, securely generated string
   - **Security Note**: Keep this value secure and never expose it in public repositories

2. **`placement`** ("query" | "header", required)

   - Determines where the generated signature will be placed in the HTTP request
   - `"query"`: Adds signature as a URL query parameter
   - `"header"`: Adds signature as an HTTP header

3. **`key`** (string, required)
   - The name/key for the signature field in the request
   - For header placement: becomes the header name (e.g., `"x-signature"`)
   - For query placement: becomes the query parameter name (e.g., `"signature"`)

## Signature Generation Process

### Algorithm: HMAC-SHA256

The [`generateSignature`](src/index.ts:977) method implements cryptographically secure signature generation:

```typescript
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
```

### Process Breakdown

1. **Input Validation**: Checks if `sharedSecretKeyConfig` is configured
2. **Text Encoding**: Converts the secret key and payload to UTF-8 byte arrays
3. **Key Import**: Imports the secret key using Web Crypto API for HMAC operations
4. **Signature Generation**: Creates HMAC-SHA256 signature of the payload
5. **Hexadecimal Conversion**: Converts the binary signature to hexadecimal string format

### What Gets Signed

The signature payload varies based on the API endpoint:

- **Send Message API**: The user's message content serves as the signature payload
- **Get Messages API**: The user identifier serves as the signature payload

This is configured in the respective API request methods:

```typescript
// For sendMessage
signaturePayload: message;

// For getMessages
signaturePayload: identifier;
```

## Request Integration

### Automatic Signature Application

The [`request`](src/index.ts:1008) method automatically handles signature generation and application when `sharedSecretKeyConfig` is provided:

```typescript
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
```

### Signature Placement Examples

#### Header Placement

```http
POST /api/send-message HTTP/1.1
Host: your-server.com
Content-Type: application/json
x-signature: a1b2c3d4e5f6789...
x-embed-id: your-embed-id

{"message": "Hello!", "identifier": "user123"}
```

#### Query Parameter Placement

```http
POST /api/send-message?signature=a1b2c3d4e5f6789... HTTP/1.1
Host: your-server.com
Content-Type: application/json
x-embed-id: your-embed-id

{"message": "Hello!", "identifier": "user123"}
```

## Usage Examples

### Basic Configuration

```javascript
const navigableai = new NavigableAI({
  embedId: "YOUR_EMBED_ID",
  identifier: "user123",
  sharedSecretKeyConfig: {
    sharedSecretKey: "your-super-secret-key-here",
    placement: "header",
    key: "x-signature",
  },
});
```

### With Custom API Endpoints

```javascript
const navigableai = new NavigableAI({
  apiConfig: {
    sendMessage: {
      url: "https://your-api.com/chat/send",
      method: "POST",
    },
    getMessages: {
      url: "https://your-api.com/chat/messages",
      method: "GET",
    },
  },
  sharedSecretKeyConfig: {
    sharedSecretKey: process.env.SHARED_SECRET_KEY, // Use environment variables
    placement: "query",
    key: "auth_signature",
  },
  identifier: "user123",
});
```

### Manual Signature Generation

You can also manually generate signatures for custom requests:

```javascript
// Generate signature for custom payload
const customPayload = "custom-data-to-sign";
const signature = await navigableai.generateSignature(customPayload);

if (signature) {
  // Use signature in your custom request
  fetch("/custom-endpoint", {
    headers: {
      "x-custom-signature": signature,
    },
    body: JSON.stringify({ data: customPayload }),
  });
}
```

## Server-Side Verification

### Backend Implementation Requirements

Your backend server must implement matching signature verification:

```javascript
// Example Node.js/Express implementation
const crypto = require("crypto");

function verifySignature(payload, receivedSignature, secretKey) {
  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(payload, "utf8")
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

// Express middleware example
app.use("/api/chat/*", (req, res, next) => {
  const signature = req.headers["x-signature"] || req.query.signature;
  const payload =
    req.method === "GET" ? req.query.identifier : req.body.message;

  if (!verifySignature(payload, signature, process.env.SHARED_SECRET_KEY)) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  next();
});
```

### Payload Extraction

The server should extract the same payload that the client signs:

- **For sendMessage endpoint**: Use the `message` field from request body
- **For getMessages endpoint**: Use the `identifier` from query parameters

## Security Considerations

### Best Practices

1. **Secret Key Management**

   - Use a cryptographically strong random key (minimum 32 characters)
   - Store keys securely using environment variables or secure key management
   - Rotate keys periodically
   - Never commit keys to version control

2. **Key Distribution**

   - Ensure the same key is configured on both client and server
   - Use secure channels for key distribution
   - Consider different keys for different environments (dev, staging, prod)

3. **Implementation Security**
   - Always use timing-safe comparison functions on the server
   - Implement proper error handling without revealing signature details
   - Log signature verification failures for monitoring

### Security Limitations

1. **Client-Side Exposure**: The shared secret is visible in client-side JavaScript, so it's not suitable for high-security scenarios
2. **Replay Protection**: This implementation doesn't include timestamp-based replay protection
3. **Key Rotation**: Manual key rotation is required across all clients

### Recommended Use Cases

✅ **Good for:**

- Preventing casual tampering and unauthorized API usage
- Adding integrity checks for internal applications
- Deterring automated abuse and bot traffic
- Verifying requests originate from your frontend application

❌ **Not suitable for:**

- High-security applications requiring true authentication
- Scenarios where the secret key must remain truly private
- Applications requiring automatic key rotation

## Troubleshooting

### Common Issues

#### 1. "sharedSecretKeyConfig is not set" Error

```
NavigableAI: sharedSecretKeyConfig is not set. Please set sharedSecretKeyConfig while initializing NavigableAI.
```

**Solution**: Ensure you pass `sharedSecretKeyConfig` in the constructor options

#### 2. "Failed to generate signature" Error

**Possible causes:**

- Browser doesn't support Web Crypto API (very old browsers)
- Invalid secret key format
- Network/environment issues

**Solution**: Check browser compatibility and validate your secret key

#### 3. Invalid Placement Error

```
Invalid placement for shared secret key. Placement must be 'query', 'header', or 'body'. Found: xyz
```

**Solution**: Ensure `placement` is exactly `"query"` or `"header"`

#### 4. Server Signature Verification Failures

**Common causes:**

- Different secret keys on client and server
- Incorrect payload extraction on server
- Character encoding mismatches
- Case sensitivity issues in signature comparison

**Debugging steps:**

1. Log the payload being signed on both client and server
2. Verify secret keys match exactly
3. Check character encoding (should be UTF-8)
4. Use timing-safe comparison functions

### Browser Compatibility

The implementation uses the Web Crypto API, which is supported in:

- Chrome 37+
- Firefox 34+
- Safari 7+
- Edge 12+

For older browsers, consider polyfills or alternative implementations.

### Testing Signature Generation

You can test signature generation manually:

```javascript
// Test signature generation
const testPayload = "test-message";
navigableai.generateSignature(testPayload).then((signature) => {
  console.log("Generated signature:", signature);

  // Compare with server-generated signature for the same payload
});
```

## Example: Complete Implementation

### Frontend Setup

```javascript
const navigableai = new NavigableAI({
  embedId: "your-embed-id",
  identifier: "user-12345",
  apiConfig: {
    sendMessage: {
      url: "https://api.yoursite.com/chat/send",
      method: "POST",
    },
    getMessages: {
      url: "https://api.yoursite.com/chat/messages",
      method: "GET",
    },
  },
  sharedSecretKeyConfig: {
    sharedSecretKey: "your-shared-secret-key-here",
    placement: "header",
    key: "x-request-signature",
  },
  markdown: true,
  welcomeMessage: "Hello! How can I help you today?",
});
```

### Backend Verification (Node.js/Express)

```javascript
const express = require("express");
const crypto = require("crypto");
const app = express();

const SHARED_SECRET = process.env.SHARED_SECRET_KEY;

function generateServerSignature(payload, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex");
}

function verifySignature(payload, receivedSignature, secret) {
  const expectedSignature = generateServerSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature, "hex"),
    Buffer.from(expectedSignature, "hex")
  );
}

// Middleware for signature verification
app.use(express.json());

app.post("/chat/send", (req, res) => {
  const signature = req.headers["x-request-signature"];
  const payload = req.body.message;

  if (!signature || !verifySignature(payload, signature, SHARED_SECRET)) {
    return res.status(401).json({
      success: false,
      message: "Invalid signature",
    });
  }

  // Process the message...
  res.json({
    success: true,
    data: {
      assistantMessage: "Hello! I received your message.",
      action: null,
      identifier: req.body.identifier,
      toolCalls: [],
    },
  });
});

app.get("/chat/messages", (req, res) => {
  const signature = req.headers["x-request-signature"];
  const payload = req.query.identifier;

  if (!signature || !verifySignature(payload, signature, SHARED_SECRET)) {
    return res.status(401).json({
      success: false,
      message: "Invalid signature",
    });
  }

  // Retrieve messages...
  res.json({
    success: true,
    data: [], // Array of messages
  });
});
```

This completes the comprehensive documentation for the shared secret key functionality in the NavigableAI frontend client.
