var e=function(e,t,i,s){return new(i||(i=Promise))((function(n,o){function a(e){try{r(s.next(e))}catch(e){o(e)}}function d(e){try{r(s.throw(e))}catch(e){o(e)}}function r(e){var t;e.done?n(e.value):(t=e.value,t instanceof i?t:new i((function(e){e(t)}))).then(a,d)}r((s=s.apply(e,t||[])).next())}))};class t{constructor(t){if(this.sharedSecretKeyConfig=void 0,this.identifier=void 0,this.setIdentifier=e=>{this.identifier=e,this.localStorage.set("identifier",e)},this.getIdentifierFromLocalStorage=()=>{const e=this.localStorage.get("identifier");e&&(this.identifier=e)},this.chatWindow={id:void 0,messages:[],defaults:{error:"An error occurred. Please try again later.",title:"Assistant",logo:'<svg class="ai-chat-window-header-logo" aria-hidden="true"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>',closeIcon:'<svg class="ai-chat-window-header-close-icon" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>',sendIcon:'<svg class="ai-chat-window-input-send-icon" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-4.98 3.66l-.163 .01l-.086 .016l-.142 .045l-.113 .054l-.07 .043l-.095 .071l-.058 .054l-4 4l-.083 .094a1 1 0 0 0 1.497 1.32l2.293 -2.293v5.586l.007 .117a1 1 0 0 0 1.993 -.117v-5.585l2.293 2.292l.094 .083a1 1 0 0 0 1.32 -1.497l-4 -4l-.082 -.073l-.089 -.064l-.113 -.062l-.081 -.034l-.113 -.034l-.112 -.02l-.098 -.006z" /></svg>',loader:'<div class="ai-chat-window-loader">\n        <div></div>\n        <div></div>\n        <div></div>\n      </div>',inputPlaceholder:"Type your message here..."},assistantResponding:!1,markdown:!1,isOpen:()=>{const e=this.chatWindow.get();return!!e&&"block"===e.style.display},open:e=>{var t;this.console.log("Open chat window");const i=this.chatWindow.get();return!!i&&(e&&this.identifier!==e&&(this.identifier=e),this.chatWindow.set(),i.style.display="block",this.chatWindow.scrollToBottom(),null===(t=this.chatWindow.messageInput.get())||void 0===t||t.focus(),!0)},close:()=>{var e;const t=this.chatWindow.get();return!!t&&(null===(e=this.chatWindow.messageInput.get())||void 0===e||e.blur(),t.style.display="none",!0)},toggle:()=>this.chatWindow.isOpen()?this.chatWindow.close():this.chatWindow.open(),get:()=>this.chatWindow.id?document.getElementById(this.chatWindow.id):null,set:()=>{var e;const t=this.chatWindow.get();return!!t&&(t.classList.add("ai-chat-window"),t.innerHTML=`\n      <div class="ai-chat-window-container">\n        <div class="ai-chat-window-header">\n          <div class="ai-chat-window-header-left">\n            ${this.chatWindow.defaults.logo}\n            <h2 class="ai-chat-window-title" aria-label="Assistant">Assistant</h2>\n          </div>\n          <div class="ai-chat-window-header-right">\n            <button class="ai-chat-window-header-close" aria-label="Close">\n              ${this.chatWindow.defaults.closeIcon}\n            </button>\n          </div>\n        </div>\n        <div class="ai-chat-window-messages">\n          ${this.chatWindow.messages.map((e=>{const t=this.chatWindow.markdown&&this.showdown.converter&&"ASSISTANT"===e.sender,i=t?this.showdown.converter.makeHtml(e.content):e.content;this.console.log("content",i);const s=t?"":"white-space: pre-wrap";return`\n          <div class="ai-chat-window-message ai-chat-window-message-${e.sender.toLowerCase()}">\n            ${"USER"===e.sender||"ASSISTANT"===e.sender?`<div aria-label="${e.sender} ${e.content}" style="${s}">${i}${e.action&&this.actions[e.action]?`<br/><button class="ai-chat-window-message-action" aria-label="${e.action}" data-ai-chat-window-message-action="${e.action}">${e.action}</button>`:""} </div>`:"ASSISTANT-LOADING"===e.sender?this.chatWindow.defaults.loader:`<p aria-label="${e.sender} ${e.content}">${this.chatWindow.defaults.error}</p>`}   \n          </div>\n          `})).join("")}\n        </div>\n        <div class="ai-chat-window-input-section">\n          <form id="ai-chat-window-input-form">\n            <div class="ai-chat-window-input-section-container">\n              <textarea \n                type="text" \n                class="ai-chat-window-input-field"\n                name="message"\n                aria-label="Type your message here..."\n                placeholder="${this.chatWindow.defaults.inputPlaceholder}"\n                ${this.chatWindow.assistantResponding?'disabled="true"':""} \n                rows="1"\n                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"\n              ></textarea>\n              <button \n                class="ai-chat-window-input-send"\n                aria-label="Send"\n                type="submit"\n              >\n                ${this.chatWindow.defaults.sendIcon}\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>`,this.chatWindow.eventListeners.add(),this.chatWindow.scrollToBottom(),null===(e=this.chatWindow.messageInput.get())||void 0===e||e.focus(),!0)},addMessage:e=>{this.chatWindow.messages.push(e)},reset:()=>{this.chatWindow.messages=[],this.chatWindow.set()},scrollToBottom:()=>{const e=this.chatWindow.messagesSection.get();if(!e)return null;e.scrollTop=e.scrollHeight},eventListeners:{cleanup:()=>{const e=this.chatWindow.get();if(!e)return;const t=this.chatWindow.closeButton.get();t&&t.removeEventListener("click",this.chatWindow.close);const i=this.chatWindow.messageForm.get();i&&i.removeEventListener("click",this.chatWindow.messageForm.onsubmit);const s=this.chatWindow.messageInput.get();s&&s.removeEventListener("keydown",this.chatWindow.messageInput.submitOnEnter);const n=e.querySelectorAll("[data-ai-chat-window-message-action]");n&&n.forEach((e=>{const t=e.getAttribute("data-ai-chat-window-message-action");t&&this.actions[t]&&e.removeEventListener("click",(()=>{this.actions[t]()}))}))},add:()=>{const e=this.chatWindow.get();if(!e)return null;this.chatWindow.eventListeners.cleanup();const t=this.chatWindow.closeButton.get();t&&t.addEventListener("click",this.chatWindow.close);const i=this.chatWindow.messageForm.get();i&&i.addEventListener("submit",this.chatWindow.messageForm.onsubmit);const s=this.chatWindow.messageInput.get();s&&s.addEventListener("keydown",this.chatWindow.messageInput.submitOnEnter);const n=e.querySelectorAll("[data-ai-chat-window-message-action]");n&&n.forEach((e=>{const t=e.getAttribute("data-ai-chat-window-message-action");t&&this.actions[t]&&e.addEventListener("click",(()=>{this.actions[t]()}))}))}},messagesSection:{get:()=>{const e=this.chatWindow.get();return e?e.querySelector(".ai-chat-window-messages"):null}},closeButton:{get:()=>{const e=this.chatWindow.get();return e?e.querySelector(".ai-chat-window-header-close"):null}},messageInput:{get:()=>{const e=this.chatWindow.get();return e?e.querySelector(".ai-chat-window-input-field"):null},submitOnEnter:e=>{"Enter"===e.key&&(e.preventDefault(),this.chatWindow.messageForm.onsubmit())}},messageForm:{get:()=>{const e=this.chatWindow.get();return e?e.querySelector("#ai-chat-window-input-form"):null},onsubmit:()=>{if(!this.chatWindow.messageForm.get())return null;const e=this.chatWindow.messageInput.get();return e&&e.value.trim().length?this.chatWindow.assistantResponding?null:void this.api.sendMessage.run(e.value):null}}},this.api={sendMessage:{run:t=>e(this,void 0,void 0,(function*(){if(!t)throw new Error("Message is required");this.chatWindow.assistantResponding=!0,this.chatWindow.addMessage({sender:"USER",content:t,new:!1,createdAt:new Date,action:null}),this.chatWindow.addMessage({sender:"ASSISTANT-LOADING",content:"",new:!1,createdAt:new Date,action:null}),this.chatWindow.set();const e={message:t};this.identifier&&(e.identifier=this.identifier),this.chatWindow.markdown&&this.showdown.converter&&(e.markdown=!0);const i=Object.keys(this.actions);i.length&&(e.configuredActions=i);const s=yield this.api.sendMessage.request(t,e);if(this.chatWindow.assistantResponding=!1,this.chatWindow.messages.pop(),!s||!s.data||!s.data.data)return this.console.error("Failed to send message."),this.chatWindow.addMessage({sender:"ERROR",content:this.chatWindow.defaults.error,new:!1,createdAt:new Date,action:null}),this.chatWindow.set(),null;const n=s.data;return this.chatWindow.addMessage({sender:"ASSISTANT",content:n.data.assistantMessage,new:!1,createdAt:new Date,action:n.data.action}),this.chatWindow.set(),n.data.identifier&&this.identifier!==n.data.identifier&&(this.identifier=n.data.identifier,this.localStorage.set("identifier",this.identifier)),n.data.action&&this.actions[n.data.action]&&this.autoRunActions&&this.actions[n.data.action](),n.data})),request:(t,...i)=>e(this,[t,...i],void 0,(function*(e,t={}){return yield this.request({method:this.api.sendMessage.method,url:this.api.sendMessage.url,body:t,signaturePayload:e})})),method:"POST",url:""},getMessages:{run:()=>e(this,void 0,void 0,(function*(){if(!this.identifier)return[];const e=yield this.api.getMessages.request(this.identifier);if(!e||!e.data||!e.data.data)return this.console.error(`Failed to get messages for identifier ${this.identifier}.`),null;const t=e.data;return this.chatWindow.messages=t.data,this.chatWindow.set(),t.data})),request:e=>this.request({method:this.api.getMessages.method,url:`${this.api.getMessages.url}?identifier=${e}`,signaturePayload:e}),method:"GET",url:""}},this.autoRunActions=!1,this.actions={},this.arrayBufferToHex=t=>e(this,void 0,void 0,(function*(){return new Promise((e=>{e(Array.from(new Uint8Array(t)).map((e=>e.toString(16).padStart(2,"0"))).join(""))}))})),this.generateSignature=t=>e(this,void 0,void 0,(function*(){if(!this.sharedSecretKeyConfig)return this.console.error("sharedSecretKeyConfig is not set. Please set sharedSecretKeyConfig while initializing NavigableAI."),null;try{const e=new TextEncoder,i=e.encode(this.sharedSecretKeyConfig.sharedSecretKey),s=e.encode(t),n=yield crypto.subtle.importKey("raw",i,{name:"HMAC",hash:"SHA-256"},!1,["sign"]),o=yield crypto.subtle.sign("HMAC",n,s);return yield this.arrayBufferToHex(o)}catch(e){return this.console.error("Error generating signature:",e),null}})),this.request=t=>e(this,void 0,void 0,(function*(){try{let e=t.url;const i=Object.assign({"Content-Type":"application/json"},t.headers),s=Object.assign({},t.body);if(this.sharedSecretKeyConfig&&this.sharedSecretKeyConfig.sharedSecretKey&&this.sharedSecretKeyConfig.placement&&this.sharedSecretKeyConfig.key&&t.signaturePayload){const s=yield this.generateSignature(t.signaturePayload);if(!s)throw new Error("Failed to generate signature");if("query"===this.sharedSecretKeyConfig.placement)e+=`?${this.sharedSecretKeyConfig.key}=${s}`;else{if("header"!==this.sharedSecretKeyConfig.placement)throw new Error(`Invalid placement for shared secret key. Placement must be 'query', 'header', or 'body'. Found: ${this.sharedSecretKeyConfig.placement}`);i[this.sharedSecretKeyConfig.key]=s}}const n=yield fetch(e,{method:t.method,headers:i,body:["OPTIONS","HEAD","GET","DELETE"].includes(t.method)?void 0:JSON.stringify(s)}),o=yield n.json();return Object.assign(Object.assign({},n),{data:o})}catch(e){return this.console.error(`Error in request: ${e}\nConfig: ${t}`),null}})),this.console={log:(...e)=>{console.log("NavigableAI:",...e)},error:(...e)=>{console.error("NavigableAI:",...e)}},this.localStorage={set:(e,t)=>{localStorage.setItem(this.encoder.base64.encode(e),this.encoder.base64.encode(JSON.stringify(t)))},get:e=>{const t=localStorage.getItem(this.encoder.base64.encode(e));return t?JSON.parse(this.encoder.base64.decode(t)):null}},this.encoder={base64:{encode:e=>btoa(e),decode:e=>atob(e)}},this.showdown={load:()=>new Promise(((e,t)=>{const i=document.createElement("script");i.src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js",i.onload=()=>{this.showdown.converter=new window.showdown.Converter,this.console.log("Showdown loaded. Converter: ",this.showdown.converter),e(window.showdown)},i.onerror=()=>t(new Error("Failed to load Showdown")),document.head.appendChild(i)})),converter:null},!t.id)return void this.console.error("div with id is required");document.getElementById(t.id)?(t.markdown&&(this.chatWindow.markdown=!0,this.showdown.load()),this.chatWindow.id=t.id,t.sharedSecretKeyConfig&&(this.sharedSecretKeyConfig=t.sharedSecretKeyConfig),t.apiConfig&&(t.apiConfig.sendMessage&&(this.api.sendMessage.url=t.apiConfig.sendMessage.url,this.api.sendMessage.method=t.apiConfig.sendMessage.method),t.apiConfig.getMessages&&(this.api.getMessages.url=t.apiConfig.getMessages.url,this.api.getMessages.method=t.apiConfig.getMessages.method)),t.identifier&&this.identifier!==t.identifier?this.setIdentifier(t.identifier):this.getIdentifierFromLocalStorage(),this.identifier&&this.api.getMessages.run(),t.actions&&(this.actions=t.actions),t.autoRunActions&&(this.autoRunActions=t.autoRunActions),t.defaults&&(t.defaults.error&&(this.chatWindow.defaults.error=t.defaults.error),t.defaults.title&&(this.chatWindow.defaults.title=t.defaults.title),t.defaults.inputPlaceholder&&(this.chatWindow.defaults.inputPlaceholder=t.defaults.inputPlaceholder),t.defaults.logo&&(this.chatWindow.defaults.logo=t.defaults.logo),t.defaults.closeIcon&&(this.chatWindow.defaults.closeIcon=t.defaults.closeIcon),t.defaults.sendIcon&&(this.chatWindow.defaults.sendIcon=t.defaults.sendIcon),t.defaults.loader&&(this.chatWindow.defaults.loader=t.defaults.loader))):this.console.error("div not found with id",t.id)}}"undefined"!=typeof window&&(window.NavigableAI=t);export{t as NavigableAI};
//# sourceMappingURL=index.esm.js.map