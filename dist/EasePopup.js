var EasePopup;(()=>{"use strict";var t={d:(e,o)=>{for(var r in o)t.o(o,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:o[r]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};t.d(e,{default:()=>g});const o={direction:"top",trigger:"click",width:"auto",placement:"outside",useCache:!1,needArrow:!0,arrowSize:10,targetGap:5,boundryGap:[10,10],theme:"light",transition:{enter:"animate__animated animate__fadeIn",leave:"animate__animated animate__fadeOut"}},r={popup:[".popup",["display","none"],["position","absolute"],["box-sizing","border-box"],["left","var(--popup-x)"],["top","var(--popup-y)"],["width","var(--popup-width)"],["padding","8px"],["color","var(--popup-color)"],["background-color","var(--popup-background)"],["box-shadow","0px 0px 6px rgba(0, 0, 0, 0.2)"],["border-radius","4px"],["z-index","2"]],arrow:[".popup.arrow::after",["content","''"],["display","block"],["z-index","-1"],["position","absolute"],["left","var(--arrow-x)"],["top","var(--arrow-y)"],["background-color","var(--popup-background)"],["width","var(--arrow-size)"],["height","var(--arrow-size)"],["transform"," rotate(var(--arrow-rotate))"],["box-shadow","-1px 1px 1px rgba(0, 0, 0, 0.1)"]]},p={light:{background:"#ffffff",color:"#333333"},dark:{background:"#333333",color:"#ffffff"}},i=["top","top-start","top-end","center","bottom","bottom-start","bottom-end"],n=["left","left-start","left-end","center","right","right-start","right-end"];function a(){return{rootWidth:document.documentElement.clientWidth,rootHeight:document.documentElement.clientHeight}}function u(t,e){const o=t.split("-")[e];return o?e>0?"-"+o:o:""}function s(t,e,o,r=0){const{direction:p,arrowSize:a,targetGap:l,boundryGap:d}=o;if(!i.concat(n).includes(p))throw new Error("direction is invalid!");if(r>=4)throw new Error("not enough space!");let c=p;const h=i.includes(c),g=u(c,0),y=u(c,1),f=[{defaults:["left","right"],reset:"top"+y,popupSpace:e.width+l+a/2+d[0]},{defaults:["top","bottom"],reset:"left"+y,popupSpace:e.height+l+a/2+d[1]}];r++;const{defaults:w,reset:m,popupSpace:b}=f[Number(h)],x=w.filter((t=>g===t))[0],v=w.filter((t=>g!==t))[0];return t[x]<b&&(r++,t[v]>=b?c=c.replace(x,v):(r++,o.direction=m,c=s(t,e,o,r=0))),console.log(c),c}function l(t){return"string"==typeof t?document.getElementById(t)||document.getElementsByClassName(t)[0]||document.querySelector(t):t}function d(t){if("none"===getComputedStyle(t).getPropertyValue("display")){const e=[{key:"display",value:"block",origin:getComputedStyle(t).getPropertyValue("display")},{key:"pointer-events",value:"none",origin:getComputedStyle(t).getPropertyValue("pointer-events")},{key:"visibility",value:"hidden",origin:getComputedStyle(t).getPropertyValue("visibility")},{key:"z-index",value:-999,origin:getComputedStyle(t).getPropertyValue("z-index")}];for(const o of e)t.style[o.key]=o.value;const o=t.getBoundingClientRect();for(const o of e)t.style[o.key]=o.origin;return o}return t.getBoundingClientRect()}function c(t,e){t=l(t);const{rootWidth:o,rootHeight:r}=a(),{top:p,right:u,bottom:s,left:c,height:h,width:g}=d(t);let y=g;if(e){const{target:r,width:p,direction:a,arrowSize:u,targetGap:s,boundryGap:l}=e;if("auto"===p){if(i.includes(a))y=o-y>=2*l[0]?y:o-2*l[0];else if(n.includes(a)){const t=l[0]+s+u,e=r.left>r.right?r.left:r.right;y=e-y>=t?y:e-t}}else{if(!p||isNaN(p))throw new Error("width is invalid!");y=Number(p)}t.style.setProperty("--popup-width",`${y}px`),y=d(t).width}return{top:p,right:o-u,bottom:r-s,left:c,width:y,height:h}}function h(t,e){if(document.getElementById(e))return;const o=document.createElement("style");o.id=e,o.type="text/css",document.getElementsByTagName("head")[0].appendChild(o),window.createPopup||o.appendChild(document.createTextNode(""));const r=document.styleSheets[document.styleSheets.length-1];for(let e=0;e<t.length;e++){let o=t[e],p=o[0],i="",n=1;for("[object Array]"===Object.prototype.toString.call(o[1][0])&&(o=o[1],n=0);n<o.length;n++){let t=o[n];i+=`${t[0]}:${t[1]}${t[2]?" !important":""};\n`}r.insertRule?r.insertRule(p+"{"+i+"}",r.cssRules.length):r.addRule(p,i,-1)}}const g=class{constructor(t,e,o={}){t&&(this.popup=l(e),this.target=l(t),this.options=o,h([r.popup],"ease-popup"),this.options.useCache&&(this.state=0,this.styles={}),this.applyStyle(this.computeStyle()))}computeStyle(){if(this.options.useCache){if(console.log("useCache"),this.state>=2)return this.styles;this.state++}const t=function(t){const e=Object.assign({},o,t);return e.needArrow||(e.arrowSize=0),e.theme&&(p[e.theme]?(e.background=p[e.theme].background,e.color=p[e.theme].color):"object"==typeof e.theme&&(e.background=e.theme.background,e.color=e.theme.color)),e}(this.options),e=c(this.target),u=c(this.popup,{...t,target:e}),l=s(e,u,t),{popupX:d,arrowX:g}=function(t,e,o){const{rootWidth:r}=a(),{direction:p,targetGap:u,arrowSize:s,boundryGap:l}=o,{left:d,width:c}=t,h={popupX:0,arrowX:0};return i.includes(p)&&(h.popupX=d+c/2-e/2,h.arrowX=e/2-s/2,p.includes("start")?(h.popupX=d,h.arrowX=c/2-s/2):p.includes("end")&&(h.popupX=d+c-e,h.arrowX=e-c/2-s/2),h.popupX<l[0]&&(h.popupX=l[0],h.arrowX=d-l[0]+c/2-s/2),h.popupX+e>r-l[0]&&(h.popupX=r-e-l[0],h.arrowX=d-h.popupX+c/2-s/2)),n.includes(p)&&(p.includes("left")?(h.popupX=d-e-u-s,h.arrowX=e-s/2):p.includes("right")&&(h.popupX=d+c+u+s,h.arrowX=-s/2)),h}(e,u.width,t),{popupY:y,arrowY:f}=function(t,e,o){const{rootHeight:r}=a(),{direction:p,targetGap:u,arrowSize:s,boundryGap:l}=o,d={popupY:0,arrowY:0},c=t.height;let h=t.top;return i.includes(p)&&(p.includes("top")?(d.popupY=h-e-u-s,d.arrowY=e-s/2):p.includes("bottom")&&(d.popupY=h+c+u+s,d.arrowY=-s/2)),n.includes(p)&&(t.top<l[1]&&(h=l[1]),t.bottom<l[1]&&(h-=l[1]),d.popupY=h+c/2-e/2,d.arrowY=h-d.popupY+c/2-s/2,p.includes("start")?(d.popupY=h,d.arrowY=c/2-s/2):p.includes("end")&&(d.popupY=h+c-e,d.arrowY=e-c/2-s/2),d.popupY<l[1]&&(d.popupY=l[1],d.arrowY=h-d.popupY+c/2-s/2),d.popupY+e>r-l[1]&&(d.popupY=r-l[1]-e,d.arrowY=h-d.popupY+c/2-s/2)),d}(e,u.height,t),w={"--popup-x":`${d}px`,"--popup-y":`${y}px`,"--popup-width":`${u.width}px`,"--popup-background":`${t.background}`,"--popup-color":`${t.color}`};return t.needArrow&&(this.popup.classList.add("arrow"),h([r.arrow],"ease-popup-arrow"),w["--arrow-x"]=`${g}px`,w["--arrow-y"]=`${f}px`,w["--arrow-size"]=`${t.arrowSize}px`,w["--arrow-rotate"]=`${function(t){let e=0;return i.includes(t)&&(e=t.includes("top")?-45:135),n.includes(t)&&(e=t.includes("left")?225:45),e}(l)}deg`),this.options.direction=l,w}applyStyle(t){for(let e in t)this.popup.style.setProperty(e,t[e]);return this.styles&&(this.styles=t),t}update(){this.applyStyle(this.computeStyle())}show(){this.update(),this.popup.style.display="block"}hide(){this.popup.style.display="none"}};EasePopup=e.default})();