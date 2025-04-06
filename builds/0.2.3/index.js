!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).NavigableAI={})}(this,(function(t){"use strict";var e=function(t,e,i,n){return new(i||(i=Promise))((function(s,o){function a(t){try{r(n.next(t))}catch(t){o(t)}}function d(t){try{r(n.throw(t))}catch(t){o(t)}}function r(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(a,d)}r((n=n.apply(t,e||[])).next())}))};const i="https://www.navigable.ai/api/embed/v1/chat";class n{constructor(t){if(this.sharedSecretKeyConfig=void 0,this.elementId="navigableai-chat-window",this.embedId=void 0,this.identifier=void 0,this.setIdentifier=t=>{this.identifier=t,this.localStorage.set("identifier",t)},this.getIdentifierFromLocalStorage=()=>{const t=this.localStorage.get("identifier");t&&(this.identifier=t)},this.welcomeMessage=void 0,this.welcomeActions=void 0,this.widget={enabled:!0,id:"ai-chat-window-widget-button",position:"bottom-right",get:()=>{if(this.widget.enabled&&this.widget.id){const t=document.getElementById(this.widget.id);if(t)return t}return null},set:t=>{const e=this.widget.get();if(!e)return null;(null==t?void 0:t.position)&&("bottom-right"===t.position||"bottom-left"===t.position?this.widget.position=t.position:"bottom-left"===t.position&&(this.widget.position="bottom-left")),e.classList.remove("ai-chat-window-widget-button-bottom-left","ai-chat-window-widget-button-bottom-right"),e.classList.add(`ai-chat-window-widget-button-${this.widget.position}`),e.removeEventListener("click",(()=>this.chatWindow.toggle())),e.addEventListener("click",(()=>this.chatWindow.toggle()))}},this.chatWindow={id:void 0,messages:[],defaults:{error:"An error occurred. Please try again later.",title:"Assistant",logo:'<svg class="ai-chat-window-header-logo" aria-hidden="true"  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>',closeIcon:'<svg class="ai-chat-window-header-close-icon" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>',sendIcon:'<svg class="ai-chat-window-input-send-icon" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-arrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-4.98 3.66l-.163 .01l-.086 .016l-.142 .045l-.113 .054l-.07 .043l-.095 .071l-.058 .054l-4 4l-.083 .094a1 1 0 0 0 1.497 1.32l2.293 -2.293v5.586l.007 .117a1 1 0 0 0 1.993 -.117v-5.585l2.293 2.292l.094 .083a1 1 0 0 0 1.32 -1.497l-4 -4l-.082 -.073l-.089 -.064l-.113 -.062l-.081 -.034l-.113 -.034l-.112 -.02l-.098 -.006z" /></svg>',loader:'<div class="ai-chat-window-loader">\n        <div></div>\n        <div></div>\n        <div></div>\n      </div>',inputPlaceholder:"Type your message here...",widgetButton:'<button id="ai-chat-window-widget-button" aria-label="Open assistant">\n        <svg  xmlns="http://www.w3.org/2000/svg"  width="40"  height="40"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-message-bolt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 9h8" /><path d="M8 13h6" /><path d="M13 18l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5" /><path d="M19 16l-2 3h4l-2 3" /></svg>\n      </button>'},assistantResponding:!1,markdown:!1,isOpen:()=>{const t=this.chatWindow.get();return!!t&&"block"===t.style.display},open:t=>{var e;const i=this.chatWindow.get();return!!i&&(t&&this.identifier!==t&&(this.identifier=t,this.api.getMessages.run()),this.chatWindow.set(),i.style.display="block",this.chatWindow.scrollToBottom(),null===(e=this.chatWindow.messageInput.get())||void 0===e||e.focus(),!0)},close:()=>{var t;const e=this.chatWindow.get();return!!e&&(null===(t=this.chatWindow.messageInput.get())||void 0===t||t.blur(),e.style.display="none",!0)},toggle:()=>this.chatWindow.isOpen()?this.chatWindow.close():this.chatWindow.open(),get:()=>this.chatWindow.id?document.getElementById(this.chatWindow.id):null,set:()=>{var t;const e=this.chatWindow.get();if(!e)return!1;const i=()=>0===this.chatWindow.messages.length||new Date(this.chatWindow.messages[this.chatWindow.messages.length-1].createdAt).getTime()<(new Date).getTime()-36e5,n=()=>{var t;if(!this.welcomeMessage)return"";const e={sender:"ASSISTANT",content:this.welcomeMessage,new:!1,createdAt:new Date,action:null},i=this.chatWindow.markdown&&this.showdown.converter&&"ASSISTANT"===e.sender,n=i?this.showdown.converter.makeHtml(e.content):e.content,s=i?"":"white-space: pre-wrap",o=null===(t=this.welcomeActions)||void 0===t?void 0:t.filter((t=>this.actions[t]));return`\n                <div class="ai-chat-window-message ai-chat-window-message-${e.sender.toLowerCase()}">\n                  <div aria-label="${e.sender} ${e.content}" style="${s}">${n}${o&&o.length?`<br/>${o.map((t=>`<button class="ai-chat-window-message-action" aria-label="${t}" data-ai-chat-window-message-action="${t}">${t}</button>`)).join("")}`:""} </div>   \n                </div>`};return e.classList.add("ai-chat-window"),e.innerHTML=`\n      <div class="ai-chat-window-container">\n        <div class="ai-chat-window-header">\n          <div class="ai-chat-window-header-left">\n            ${this.chatWindow.defaults.logo}\n            <h2 class="ai-chat-window-title" aria-label="${this.chatWindow.defaults.title}">${this.chatWindow.defaults.title}</h2>\n          </div>\n          <div class="ai-chat-window-header-right">\n            <button class="ai-chat-window-header-close" aria-label="Close">\n              ${this.chatWindow.defaults.closeIcon}\n            </button>\n          </div>\n        </div>\n        <div class="ai-chat-window-messages">\n        ${i()?"":this.welcomeMessage&&this.welcomeMessage.length?n():""}\n          ${this.chatWindow.messages.map((t=>{const e=this.chatWindow.markdown&&this.showdown.converter&&"ASSISTANT"===t.sender,i=e?this.showdown.converter.makeHtml(t.content):t.content,n=e?"":"white-space: pre-wrap";return`\n                <div class="ai-chat-window-message ai-chat-window-message-${t.sender.toLowerCase()}">\n                  ${"USER"===t.sender||"ASSISTANT"===t.sender?`<div aria-label="${t.sender} ${t.content}" style="${n}">${i}${t.action&&this.actions[t.action]?`<br/><button class="ai-chat-window-message-action" aria-label="${t.action}" data-ai-chat-window-message-action="${t.action}">${t.action}</button>`:""} </div>`:"ASSISTANT-LOADING"===t.sender?this.chatWindow.defaults.loader:`<p aria-label="${t.sender} ${t.content}">${this.chatWindow.defaults.error}</p>`}   \n                </div>\n                `})).join("")}\n            ${(0===this.chatWindow.messages.length||i())&&this.welcomeMessage&&this.welcomeMessage.length?n():""}\n        </div>\n        <div class="ai-chat-window-input-section">\n          <form id="ai-chat-window-input-form">\n            <div class="ai-chat-window-input-section-container">\n              <textarea \n                type="text" \n                class="ai-chat-window-input-field"\n                name="message"\n                aria-label="Type your message here..."\n                placeholder="${this.chatWindow.defaults.inputPlaceholder}"\n                ${this.chatWindow.assistantResponding?'disabled="true"':""} \n                rows="1"\n                oninput="this.style.height = 'auto'; this.style.height = this.scrollHeight + 'px';"\n              ></textarea>\n              <button \n                class="ai-chat-window-input-send"\n                aria-label="Send"\n                type="submit"\n              >\n                ${this.chatWindow.defaults.sendIcon}\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>`,this.chatWindow.eventListeners.add(),this.chatWindow.scrollToBottom(),null===(t=this.chatWindow.messageInput.get())||void 0===t||t.focus(),!0},addMessage:t=>{this.chatWindow.messages.push(t)},reset:()=>{this.chatWindow.messages=[],this.chatWindow.set()},scrollToBottom:()=>{const t=this.chatWindow.messagesSection.get();if(!t)return null;t.scrollTop=t.scrollHeight},eventListeners:{cleanup:()=>{const t=this.chatWindow.get();if(!t)return;const e=this.chatWindow.closeButton.get();e&&e.removeEventListener("click",this.chatWindow.close);const i=this.chatWindow.messageForm.get();i&&i.removeEventListener("click",this.chatWindow.messageForm.onsubmit);const n=this.chatWindow.messageInput.get();n&&n.removeEventListener("keydown",this.chatWindow.messageInput.submitOnEnter);const s=t.querySelectorAll("[data-ai-chat-window-message-action]");s&&s.forEach((t=>{const e=t.getAttribute("data-ai-chat-window-message-action");e&&this.actions[e]&&t.removeEventListener("click",(()=>{this.actionHandler(e)}))}))},add:()=>{const t=this.chatWindow.get();if(!t)return null;this.chatWindow.eventListeners.cleanup();const e=this.chatWindow.closeButton.get();e&&e.addEventListener("click",this.chatWindow.close);const i=this.chatWindow.messageForm.get();i&&i.addEventListener("submit",this.chatWindow.messageForm.onsubmit);const n=this.chatWindow.messageInput.get();n&&n.addEventListener("keydown",this.chatWindow.messageInput.submitOnEnter);const s=t.querySelectorAll("[data-ai-chat-window-message-action]");s&&s.forEach((t=>{const e=t.getAttribute("data-ai-chat-window-message-action");e&&this.actions[e]&&t.addEventListener("click",(()=>{this.actionHandler(e)}))}))}},messagesSection:{get:()=>{const t=this.chatWindow.get();return t?t.querySelector(".ai-chat-window-messages"):null}},closeButton:{get:()=>{const t=this.chatWindow.get();return t?t.querySelector(".ai-chat-window-header-close"):null}},messageInput:{get:()=>{const t=this.chatWindow.get();return t?t.querySelector(".ai-chat-window-input-field"):null},set:t=>{if(!t)return this.console.error("No value provided to messageInput.set(value: string)"),null;const e=this.chatWindow.messageInput.get();return e?(e.value=t,e):null},submitOnEnter:t=>{"Enter"===t.key&&(t.preventDefault(),this.chatWindow.messageForm.onsubmit())}},messageForm:{get:()=>{const t=this.chatWindow.get();return t?t.querySelector("#ai-chat-window-input-form"):null},onsubmit:()=>{if(!this.chatWindow.messageForm.get())return null;const t=this.chatWindow.messageInput.get();return t&&t.value.trim().length?this.chatWindow.assistantResponding?null:void this.api.sendMessage.run(t.value):null}},theme:{isLight:()=>{const t=this.chatWindow.get();return!!t&&!t.classList.contains("ai-chat-window-dark-theme")},light:()=>{const t=this.chatWindow.get();if(!t)return null;t.classList.remove("ai-chat-window-dark-theme")},dark:()=>{const t=this.chatWindow.get();if(!t)return null;t.classList.add("ai-chat-window-dark-theme")},toggle:()=>{this.chatWindow.theme.isLight()?this.chatWindow.theme.dark():this.chatWindow.theme.light()}}},this.agentFunctionCall=t=>e(this,void 0,void 0,(function*(){const e=t.function.name,i=t.function.arguments;try{const n=JSON.parse(i);if(!this.agentFunctions[e]||"function"!=typeof this.agentFunctions[e])throw this.console.error("Function not found: "+e),new Error(`Function ${e} must be a function`);const s=yield this.agentFunctions[e](n);if("string"==typeof s)this.api.sendMessage.run(s,{functionCallId:t.id});else{if("boolean"!=typeof s)throw new Error("Function Response must be a string or boolean");this.api.sendMessage.run(s.toString(),{functionCallId:t.id})}}catch(e){this.console.error(e),e instanceof Error?this.api.sendMessage.run(e.message,{functionCallId:t.id}):this.api.sendMessage.run("Error: An unknown error occurred",{functionCallId:t.id})}})),this.api={sendMessage:{run:(t,i)=>e(this,void 0,void 0,(function*(){if(!t)throw new Error("Message is required");this.chatWindow.assistantResponding=!0,(null==i?void 0:i.functionCallId)||this.chatWindow.addMessage({sender:"USER",content:t,new:!1,createdAt:new Date,action:null}),this.chatWindow.addMessage({sender:"ASSISTANT-LOADING",content:"",new:!1,createdAt:new Date,action:null}),this.chatWindow.set();const e={message:t};this.identifier&&(e.identifier=this.identifier),this.chatWindow.markdown&&this.showdown.converter&&(e.markdown=!0);const n=Object.keys(this.actions).filter((t=>"function"==typeof this.actions[t]||"string"==typeof this.actions[t]));n.length&&(e.configuredActions=n);const s=Object.keys(this.agentFunctions).filter((t=>"function"==typeof this.agentFunctions[t]));s.length&&(e.configuredFunctions=s),(null==i?void 0:i.functionCallId)&&(e.functionCallId=i.functionCallId);const o=yield this.api.sendMessage.request(t,e);if(this.chatWindow.assistantResponding=!1,this.chatWindow.messages.pop(),!o||!o.data||!o.data.data)return this.console.error("Failed to send message."),this.chatWindow.addMessage({sender:"ERROR",content:this.chatWindow.defaults.error,new:!1,createdAt:new Date,action:null}),this.chatWindow.set(),null;const a=o.data;return this.chatWindow.addMessage({sender:"ASSISTANT",content:a.data.assistantMessage,new:!1,createdAt:new Date,action:a.data.action}),this.chatWindow.set(),a.data.identifier&&this.identifier!==a.data.identifier&&(this.identifier=a.data.identifier,this.localStorage.set("identifier",this.identifier)),a.data.action&&this.actions[a.data.action]&&this.autoRunActions&&this.actionHandler(),a.data.toolCalls&&a.data.toolCalls.length>0&&a.data.toolCalls.forEach((t=>{this.agentFunctionCall(t)})),a.data})),request:(t,...i)=>e(this,[t,...i],void 0,(function*(t,e={}){return yield this.request({method:this.api.sendMessage.method,url:this.api.sendMessage.url,body:e,signaturePayload:t,headers:{"x-embed-id":this.embedId||""}})})),method:"POST",url:i},getMessages:{run:()=>e(this,void 0,void 0,(function*(){if(!this.identifier)return[];const t=yield this.api.getMessages.request(this.identifier);if(!t||!t.data||!t.data.data)return this.console.error(`Failed to get messages for identifier ${this.identifier}.`),null;const e=t.data;return 0===this.chatWindow.messages.length?this.chatWindow.messages=e.data:2===this.chatWindow.messages.length?this.chatWindow.messages=[...this.chatWindow.messages,...e.data]:this.chatWindow.messages=e.data,this.chatWindow.set(),e.data})),request:t=>this.request({method:this.api.getMessages.method,url:`${this.api.getMessages.url}?identifier=${t}`,signaturePayload:t,headers:{"x-embed-id":this.embedId||""}}),method:"GET",url:i}},this.goTo=t=>{this.console.log("Navigating to:",t),window&&"undefined"!=typeof window&&(window.location.href=t)},this.actionHandler=t=>{if(!t)return;const e=this.actions[t];this.console.log("Running action:",t,e),"string"==typeof e?this.goTo(e):"function"==typeof e&&e()},this.autoRunActions=!1,this.actions={},this.agentFunctions={},this.arrayBufferToHex=t=>e(this,void 0,void 0,(function*(){return new Promise((e=>{e(Array.from(new Uint8Array(t)).map((t=>t.toString(16).padStart(2,"0"))).join(""))}))})),this.generateSignature=t=>e(this,void 0,void 0,(function*(){if(!this.sharedSecretKeyConfig)return this.console.error("sharedSecretKeyConfig is not set. Please set sharedSecretKeyConfig while initializing NavigableAI."),null;try{const e=new TextEncoder,i=e.encode(this.sharedSecretKeyConfig.sharedSecretKey),n=e.encode(t),s=yield crypto.subtle.importKey("raw",i,{name:"HMAC",hash:"SHA-256"},!1,["sign"]),o=yield crypto.subtle.sign("HMAC",s,n);return yield this.arrayBufferToHex(o)}catch(t){return this.console.error("Error generating signature:",t),null}})),this.request=t=>e(this,void 0,void 0,(function*(){try{let e=t.url;const i=Object.assign({"Content-Type":"application/json"},t.headers),n=Object.assign({},t.body);if(this.sharedSecretKeyConfig&&this.sharedSecretKeyConfig.sharedSecretKey&&this.sharedSecretKeyConfig.placement&&this.sharedSecretKeyConfig.key&&t.signaturePayload){const n=yield this.generateSignature(t.signaturePayload);if(!n)throw new Error("Failed to generate signature");if("query"===this.sharedSecretKeyConfig.placement)e+=`?${this.sharedSecretKeyConfig.key}=${n}`;else{if("header"!==this.sharedSecretKeyConfig.placement)throw new Error(`Invalid placement for shared secret key. Placement must be 'query', 'header', or 'body'. Found: ${this.sharedSecretKeyConfig.placement}`);i[this.sharedSecretKeyConfig.key]=n}}const s=yield fetch(e,{method:t.method,headers:i,body:["OPTIONS","HEAD","GET","DELETE"].includes(t.method)?void 0:JSON.stringify(n)}),o=yield s.json();return Object.assign(Object.assign({},s),{data:o})}catch(e){return this.console.error(`Error in request: ${e}\nConfig: ${t}`),null}})),this.console={log:(...t)=>{console.log("NavigableAI:",...t)},error:(...t)=>{console.error("NavigableAI:",...t)}},this.localStorage={set:(t,e)=>{localStorage.setItem(this.encoder.base64.encode(t),this.encoder.base64.encode(JSON.stringify(e)))},get:t=>{const e=localStorage.getItem(this.encoder.base64.encode(t));return e?JSON.parse(this.encoder.base64.decode(e)):null}},this.encoder={base64:{encode:t=>btoa(t),decode:t=>atob(t)}},this.showdown={load:()=>new Promise(((t,e)=>{const i=document.createElement("script");i.src="https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js",i.onload=()=>{this.showdown.converter=new window.showdown.Converter,t(window.showdown)},i.onerror=()=>e(new Error("Failed to load Showdown")),document.head.appendChild(i)})),converter:null},this.waitForDOM=()=>new Promise((t=>{"complete"===document.readyState?t(document):document.addEventListener("DOMContentLoaded",(()=>{t(document)}))})),t.id){document.getElementById(t.id)&&(this.elementId=t.id)}(()=>{e(this,void 0,void 0,(function*(){var e;yield this.waitForDOM();document.getElementById(this.elementId)?(t.embedId&&(this.embedId=t.embedId),t.markdown&&(this.chatWindow.markdown=!0,this.showdown.load()),this.chatWindow.id=this.elementId,t.sharedSecretKeyConfig&&(this.sharedSecretKeyConfig=t.sharedSecretKeyConfig),t.apiConfig&&(t.apiConfig.sendMessage&&(this.api.sendMessage.url=t.apiConfig.sendMessage.url,this.api.sendMessage.method=t.apiConfig.sendMessage.method),t.apiConfig.getMessages&&(this.api.getMessages.url=t.apiConfig.getMessages.url,this.api.getMessages.method=t.apiConfig.getMessages.method)),t.identifier&&this.identifier!==t.identifier?this.setIdentifier(t.identifier):this.getIdentifierFromLocalStorage(),this.identifier&&this.api.getMessages.run(),t.actions&&(this.actions=t.actions),t.autoRunActions&&(this.autoRunActions=t.autoRunActions),t.agentFunctions&&(this.agentFunctions=t.agentFunctions),t.defaults&&(t.defaults.error&&(this.chatWindow.defaults.error=t.defaults.error),t.defaults.title&&(this.chatWindow.defaults.title=t.defaults.title),t.defaults.inputPlaceholder&&(this.chatWindow.defaults.inputPlaceholder=t.defaults.inputPlaceholder),t.defaults.logo&&(this.chatWindow.defaults.logo=t.defaults.logo),t.defaults.closeIcon&&(this.chatWindow.defaults.closeIcon=t.defaults.closeIcon),t.defaults.sendIcon&&(this.chatWindow.defaults.sendIcon=t.defaults.sendIcon),t.defaults.loader&&(this.chatWindow.defaults.loader=t.defaults.loader),t.defaults.widgetButton&&(this.chatWindow.defaults.widgetButton=t.defaults.widgetButton)),t.darkTheme&&this.chatWindow.theme.dark(),t.widgetButtonDisabled?this.widget.enabled=!1:document.body.innerHTML=document.body.innerHTML+this.chatWindow.defaults.widgetButton,t.widgetButtonPosition&&("bottom-right"!==t.widgetButtonPosition&&"bottom-left"!==t.widgetButtonPosition||(this.widget.position=t.widgetButtonPosition)),t.welcomeMessage&&t.welcomeMessage.length>0&&(this.welcomeMessage=t.welcomeMessage.trim(),t.welcomeActions&&t.welcomeActions.length>0&&(this.welcomeActions=null===(e=t.welcomeActions)||void 0===e?void 0:e.filter((t=>this.actions[t])))),this.widget.enabled&&this.widget.set()):this.console.error("div not found with id",this.elementId)}))})()}}if("undefined"!=typeof window){window.NavigableAI=n;const t=document.createElement("div");t.id="navigableai-chat-window",document.body.appendChild(t)}t.NavigableAI=n,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=index.js.map
