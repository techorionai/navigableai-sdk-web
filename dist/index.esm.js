var t=function(t,e,i,n){return new(i||(i=Promise))((function(s,o){function a(t){try{r(n.next(t))}catch(t){o(t)}}function d(t){try{r(n.throw(t))}catch(t){o(t)}}function r(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,d)}r((n=n.apply(t,e||[])).next())}))};class e{constructor(e){this.sharedSecretKeyConfig=void 0,this.identifier=void 0,this.setIdentifier=t=>{this.identifier=t,this.localStorage.set("identifier",t)},this.getIdentifierFromLocalStorage=()=>{const t=this.localStorage.get("identifier");t&&(this.identifier=t)},this.chatWindow={id:void 0,messages:[],defaults:{error:"An error occurred. Please try again later.",title:"Assistant",logo:'<svg class="ai-chat-window-header-logo" aria-hidden="true"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>',closeIcon:'<svg class="ai-chat-window-header-close-icon" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>',sendIcon:'<svg class="ai-chat-window-input-send-icon" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-4.98 3.66l-.163 .01l-.086 .016l-.142 .045l-.113 .054l-.07 .043l-.095 .071l-.058 .054l-4 4l-.083 .094a1 1 0 0 0 1.497 1.32l2.293 -2.293v5.586l.007 .117a1 1 0 0 0 1.993 -.117v-5.585l2.293 2.292l.094 .083a1 1 0 0 0 1.32 -1.497l-4 -4l-.082 -.073l-.089 -.064l-.113 -.062l-.081 -.034l-.113 -.034l-.112 -.02l-.098 -.006z" /></svg>',loader:'<div class="ai-chat-window-loader">\n        <div></div>\n        <div></div>\n        <div></div>\n      </div>',inputPlaceholder:"Type your message here..."},assistantResponding:!1,markdown:!1,isOpen:()=>{const t=this.chatWindow.get();return!!t&&"block"===t.style.display},open:t=>{var e;const i=this.chatWindow.get();return!!i&&(t&&this.identifier!==t&&(this.identifier=t,this.api.getMessages.run()),this.chatWindow.set(),i.style.display="block",this.chatWindow.scrollToBottom(),null===(e=this.chatWindow.messageInput.get())||void 0===e||e.focus(),!0)},close:()=>{var t;const e=this.chatWindow.get();return!!e&&(null===(t=this.chatWindow.messageInput.get())||void 0===t||t.blur(),e.style.display="none",!0)},toggle:()=>this.chatWindow.isOpen()?this.chatWindow.close():this.chatWindow.open(),get:()=>this.chatWindow.id?document.getElementById(this.chatWindow.id):null,set:()=>{var t;const e=this.chatWindow.get();return!!e&&(e.classList.add("ai-chat-window"),e.innerHTML=`\n      <div class="ai-chat-window-container">\n        <div class="ai-chat-window-header">\n          <div class="ai-chat-window-header-left">\n            ${this.chatWindow.defaults.logo}\n            <h2 class="ai-chat-window-title" aria-label="${this.chatWindow.defaults.title}">${this.chatWindow.defaults.title}</h2>\n          </div>\n          <div class="ai-chat-window-header-right">\n            <button class="ai-chat-window-header-close" aria-label="Close">\n              ${this.chatWindow.defaults.closeIcon}\n            </button>\n          </div>\n        </div>\n        <div class="ai-chat-window-messages">\n          ${this.chatWindow.messages.map((t=>{const e=this.chatWindow.markdown&&this.showdown.converter&&"ASSISTANT"===t.sender,i=e?this.showdown.converter.makeHtml(t.content):t.content,n=e?"":"white-space: pre-wrap";return`\n          <div class="ai-chat-window-message ai-chat-window-message-${t.sender.toLowerCase()}">\n            ${"USER"===t.sender||"ASSISTANT"===t.sender?`<div aria-label="${t.sender} ${t.content}" style="${n}">${i}${t.action&&this.actions[t.action]?`<br/><button class="ai-chat-window-message-action" aria-label="${t.action}" data-ai-chat-window-message-action="${t.action}">${t.action}</button>`:""} </div>`:"ASSISTANT-LOADING"===t.sender?this.chatWindow.defaults.loader:`<p aria-label="${t.sender} ${t.content}">${this.chatWindow.defaults.error}</p>`}   \n          </div>\n          `})).join("")}\n        </div>\n        <div class="ai-chat-window-input-section">\n          <form id="ai-chat-window-input-form">\n            <div class="ai-chat-window-input-section-container">\n              <textarea \n                type="text" \n                class="ai-chat-window-input-field"\n                name="message"\n                aria-label="Type your message here..."\n                placeholder="${this.chatWindow.defaults.inputPlaceholder}"\n                ${this.chatWindow.assistantResponding?'disabled="true"':""} \n                rows="1"\n                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"\n              ></textarea>\n              <button \n                class="ai-chat-window-input-send"\n                aria-label="Send"\n                type="submit"\n              >\n                ${this.chatWindow.defaults.sendIcon}\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>`,this.chatWindow.eventListeners.add(),this.chatWindow.scrollToBottom(),null===(t=this.chatWindow.messageInput.get())||void 0===t||t.focus(),!0)},addMessage:t=>{this.chatWindow.messages.push(t)},reset:()=>{this.chatWindow.messages=[],this.chatWindow.set()},scrollToBottom:()=>{const t=this.chatWindow.messagesSection.get();if(!t)return null;t.scrollTop=t.scrollHeight},eventListeners:{cleanup:()=>{const t=this.chatWindow.get();if(!t)return;const e=this.chatWindow.closeButton.get();e&&e.removeEventListener("click",this.chatWindow.close);const i=this.chatWindow.messageForm.get();i&&i.removeEventListener("click",this.chatWindow.messageForm.onsubmit);const n=this.chatWindow.messageInput.get();n&&n.removeEventListener("keydown",this.chatWindow.messageInput.submitOnEnter);const s=t.querySelectorAll("[data-ai-chat-window-message-action]");s&&s.forEach((t=>{const e=t.getAttribute("data-ai-chat-window-message-action");e&&this.actions[e]&&t.removeEventListener("click",(()=>{this.actions[e]()}))}))},add:()=>{const t=this.chatWindow.get();if(!t)return null;this.chatWindow.eventListeners.cleanup();const e=this.chatWindow.closeButton.get();e&&e.addEventListener("click",this.chatWindow.close);const i=this.chatWindow.messageForm.get();i&&i.addEventListener("submit",this.chatWindow.messageForm.onsubmit);const n=this.chatWindow.messageInput.get();n&&n.addEventListener("keydown",this.chatWindow.messageInput.submitOnEnter);const s=t.querySelectorAll("[data-ai-chat-window-message-action]");s&&s.forEach((t=>{const e=t.getAttribute("data-ai-chat-window-message-action");e&&this.actions[e]&&t.addEventListener("click",(()=>{this.actions[e]()}))}))}},messagesSection:{get:()=>{const t=this.chatWindow.get();return t?t.querySelector(".ai-chat-window-messages"):null}},closeButton:{get:()=>{const t=this.chatWindow.get();return t?t.querySelector(".ai-chat-window-header-close"):null}},messageInput:{get:()=>{const t=this.chatWindow.get();return t?t.querySelector(".ai-chat-window-input-field"):null},submitOnEnter:t=>{"Enter"===t.key&&(t.preventDefault(),this.chatWindow.messageForm.onsubmit())}},messageForm:{get:()=>{const t=this.chatWindow.get();return t?t.querySelector("#ai-chat-window-input-form"):null},onsubmit:()=>{if(!this.chatWindow.messageForm.get())return null;const t=this.chatWindow.messageInput.get();return t&&t.value.trim().length?this.chatWindow.assistantResponding?null:void this.api.sendMessage.run(t.value):null}},theme:{isLight:()=>{const t=this.chatWindow.get();return!!t&&!t.classList.contains("ai-chat-window-dark-theme")},light:()=>{const t=this.chatWindow.get();if(!t)return null;t.classList.remove("ai-chat-window-dark-theme")},dark:()=>{const t=this.chatWindow.get();if(!t)return null;t.classList.add("ai-chat-window-dark-theme")},toggle:()=>{this.chatWindow.theme.isLight()?this.chatWindow.theme.dark():this.chatWindow.theme.light()}}},this.agentFunctionCall=e=>t(this,void 0,void 0,(function*(){const t=e.function.name,i=e.function.arguments;try{const n=JSON.parse(i);if(!this.agentFunctions[t]||"function"!=typeof this.agentFunctions[t])throw this.console.error("Function not found: "+t),new Error(`Function ${t} must be a function`);const s=yield this.agentFunctions[t](n);if("string"==typeof s)this.api.sendMessage.run(s,{functionCallId:e.id});else{if("boolean"!=typeof s)throw new Error("Function Response must be a string or boolean");this.api.sendMessage.run(s.toString(),{functionCallId:e.id})}}catch(t){this.console.error(t),t instanceof Error?this.api.sendMessage.run(t.message,{functionCallId:e.id}):this.api.sendMessage.run("Error: An unknown error occurred",{functionCallId:e.id})}})),this.api={sendMessage:{run:(e,i)=>t(this,void 0,void 0,(function*(){if(!e)throw new Error("Message is required");this.chatWindow.assistantResponding=!0,(null==i?void 0:i.functionCallId)||this.chatWindow.addMessage({sender:"USER",content:e,new:!1,createdAt:new Date,action:null}),this.chatWindow.addMessage({sender:"ASSISTANT-LOADING",content:"",new:!1,createdAt:new Date,action:null}),this.chatWindow.set();const t={message:e};this.identifier&&(t.identifier=this.identifier),this.chatWindow.markdown&&this.showdown.converter&&(t.markdown=!0);const n=Object.keys(this.actions);n.length&&(t.configuredActions=n);const s=Object.keys(this.agentFunctions);s.length&&(t.configuredFunctions=s),(null==i?void 0:i.functionCallId)&&(t.functionCallId=i.functionCallId);const o=yield this.api.sendMessage.request(e,t);if(this.chatWindow.assistantResponding=!1,this.chatWindow.messages.pop(),!o||!o.data||!o.data.data)return this.console.error("Failed to send message."),this.chatWindow.addMessage({sender:"ERROR",content:this.chatWindow.defaults.error,new:!1,createdAt:new Date,action:null}),this.chatWindow.set(),null;const a=o.data;return this.chatWindow.addMessage({sender:"ASSISTANT",content:a.data.assistantMessage,new:!1,createdAt:new Date,action:a.data.action}),this.chatWindow.set(),a.data.identifier&&this.identifier!==a.data.identifier&&(this.identifier=a.data.identifier,this.localStorage.set("identifier",this.identifier)),a.data.action&&this.actions[a.data.action]&&this.autoRunActions&&this.actions[a.data.action](),a.data.toolCalls&&a.data.toolCalls.length>0&&a.data.toolCalls.forEach((t=>{this.agentFunctionCall(t)})),a.data})),request:(e,...i)=>t(this,[e,...i],void 0,(function*(t,e={}){return yield this.request({method:this.api.sendMessage.method,url:this.api.sendMessage.url,body:e,signaturePayload:t})})),method:"POST",url:""},getMessages:{run:()=>t(this,void 0,void 0,(function*(){if(!this.identifier)return[];const t=yield this.api.getMessages.request(this.identifier);if(!t||!t.data||!t.data.data)return this.console.error(`Failed to get messages for identifier ${this.identifier}.`),null;const e=t.data;return this.chatWindow.messages=e.data,this.chatWindow.set(),e.data})),request:t=>this.request({method:this.api.getMessages.method,url:`${this.api.getMessages.url}?identifier=${t}`,signaturePayload:t}),method:"GET",url:""}},this.autoRunActions=!1,this.actions={},this.agentFunctions={},this.arrayBufferToHex=e=>t(this,void 0,void 0,(function*(){return new Promise((t=>{t(Array.from(new Uint8Array(e)).map((t=>t.toString(16).padStart(2,"0"))).join(""))}))})),this.generateSignature=e=>t(this,void 0,void 0,(function*(){if(!this.sharedSecretKeyConfig)return this.console.error("sharedSecretKeyConfig is not set. Please set sharedSecretKeyConfig while initializing NavigableAI."),null;try{const t=new TextEncoder,i=t.encode(this.sharedSecretKeyConfig.sharedSecretKey),n=t.encode(e),s=yield crypto.subtle.importKey("raw",i,{name:"HMAC",hash:"SHA-256"},!1,["sign"]),o=yield crypto.subtle.sign("HMAC",s,n);return yield this.arrayBufferToHex(o)}catch(t){return this.console.error("Error generating signature:",t),null}})),this.request=e=>t(this,void 0,void 0,(function*(){try{let t=e.url;const i=Object.assign({"Content-Type":"application/json"},e.headers),n=Object.assign({},e.body);if(this.sharedSecretKeyConfig&&this.sharedSecretKeyConfig.sharedSecretKey&&this.sharedSecretKeyConfig.placement&&this.sharedSecretKeyConfig.key&&e.signaturePayload){const n=yield this.generateSignature(e.signaturePayload);if(!n)throw new Error("Failed to generate signature");if("query"===this.sharedSecretKeyConfig.placement)t+=`?${this.sharedSecretKeyConfig.key}=${n}`;else{if("header"!==this.sharedSecretKeyConfig.placement)throw new Error(`Invalid placement for shared secret key. Placement must be 'query', 'header', or 'body'. Found: ${this.sharedSecretKeyConfig.placement}`);i[this.sharedSecretKeyConfig.key]=n}}const s=yield fetch(t,{method:e.method,headers:i,body:["OPTIONS","HEAD","GET","DELETE"].includes(e.method)?void 0:JSON.stringify(n)}),o=yield s.json();return Object.assign(Object.assign({},s),{data:o})}catch(t){return this.console.error(`Error in request: ${t}\nConfig: ${e}`),null}})),this.console={log:(...t)=>{console.log("NavigableAI:",...t)},error:(...t)=>{console.error("NavigableAI:",...t)}},this.localStorage={set:(t,e)=>{localStorage.setItem(this.encoder.base64.encode(t),this.encoder.base64.encode(JSON.stringify(e)))},get:t=>{const e=localStorage.getItem(this.encoder.base64.encode(t));return e?JSON.parse(this.encoder.base64.decode(e)):null}},this.encoder={base64:{encode:t=>btoa(t),decode:t=>atob(t)}},this.showdown={load:()=>new Promise(((t,e)=>{const i=document.createElement("script");i.src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js",i.onload=()=>{this.showdown.converter=new window.showdown.Converter,t(window.showdown)},i.onerror=()=>e(new Error("Failed to load Showdown")),document.head.appendChild(i)})),converter:null},this.waitForDOM=()=>new Promise((t=>{"complete"===document.readyState?t(document):document.addEventListener("DOMContentLoaded",(()=>{t(document)}))})),e.id?(()=>{t(this,void 0,void 0,(function*(){yield this.waitForDOM();document.getElementById(e.id)?(e.markdown&&(this.chatWindow.markdown=!0,this.showdown.load()),this.chatWindow.id=e.id,e.sharedSecretKeyConfig&&(this.sharedSecretKeyConfig=e.sharedSecretKeyConfig),e.apiConfig&&(e.apiConfig.sendMessage&&(this.api.sendMessage.url=e.apiConfig.sendMessage.url,this.api.sendMessage.method=e.apiConfig.sendMessage.method),e.apiConfig.getMessages&&(this.api.getMessages.url=e.apiConfig.getMessages.url,this.api.getMessages.method=e.apiConfig.getMessages.method)),e.identifier&&this.identifier!==e.identifier?this.setIdentifier(e.identifier):this.getIdentifierFromLocalStorage(),this.identifier&&this.api.getMessages.run(),e.actions&&(this.actions=e.actions),e.autoRunActions&&(this.autoRunActions=e.autoRunActions),e.agentFunctions&&(this.agentFunctions=e.agentFunctions),e.defaults&&(e.defaults.error&&(this.chatWindow.defaults.error=e.defaults.error),e.defaults.title&&(this.chatWindow.defaults.title=e.defaults.title),e.defaults.inputPlaceholder&&(this.chatWindow.defaults.inputPlaceholder=e.defaults.inputPlaceholder),e.defaults.logo&&(this.chatWindow.defaults.logo=e.defaults.logo),e.defaults.closeIcon&&(this.chatWindow.defaults.closeIcon=e.defaults.closeIcon),e.defaults.sendIcon&&(this.chatWindow.defaults.sendIcon=e.defaults.sendIcon),e.defaults.loader&&(this.chatWindow.defaults.loader=e.defaults.loader)),e.darkTheme&&this.chatWindow.theme.dark()):this.console.error("div not found with id",e.id)}))})():this.console.error("div with id is required")}}"undefined"!=typeof window&&(window.NavigableAI=e);export{e as NavigableAI};
//# sourceMappingURL=index.esm.js.map
