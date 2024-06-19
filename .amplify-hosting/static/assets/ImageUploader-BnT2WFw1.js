import{r as W,j as w}from"./jsx-runtime-D2HyDbKh.js";/*!
 * Compressor.js v1.2.1
 * https://fengyuanchen.github.io/compressorjs
 *
 * Copyright 2018-present Chen Fengyuan
 * Released under the MIT license
 *
 * Date: 2023-02-28T14:09:41.732Z
 */function le(a,e){var t=Object.keys(a);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(a);e&&(r=r.filter(function(i){return Object.getOwnPropertyDescriptor(a,i).enumerable})),t.push.apply(t,r)}return t}function k(a){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?le(Object(t),!0).forEach(function(r){Te(a,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(t)):le(Object(t)).forEach(function(r){Object.defineProperty(a,r,Object.getOwnPropertyDescriptor(t,r))})}return a}function xe(a,e){if(!(a instanceof e))throw new TypeError("Cannot call a class as a function")}function fe(a,e){for(var t=0;t<e.length;t++){var r=e[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(a,ve(r.key),r)}}function Be(a,e,t){return e&&fe(a.prototype,e),t&&fe(a,t),Object.defineProperty(a,"prototype",{writable:!1}),a}function Te(a,e,t){return e=ve(e),e in a?Object.defineProperty(a,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[e]=t,a}function F(){return F=Object.assign?Object.assign.bind():function(a){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(a[r]=t[r])}return a},F.apply(this,arguments)}function Ee(a,e){if(typeof a!="object"||a===null)return a;var t=a[Symbol.toPrimitive];if(t!==void 0){var r=t.call(a,e||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(a)}function ve(a){var e=Ee(a,"string");return typeof e=="symbol"?e:String(e)}var me={exports:{}};(function(a){typeof window>"u"||function(e){var t=e.HTMLCanvasElement&&e.HTMLCanvasElement.prototype,r=e.Blob&&function(){try{return!!new Blob}catch{return!1}}(),i=r&&e.Uint8Array&&function(){try{return new Blob([new Uint8Array(100)]).size===100}catch{return!1}}(),n=e.BlobBuilder||e.WebKitBlobBuilder||e.MozBlobBuilder||e.MSBlobBuilder,c=/^data:((.*?)(;charset=.*?)?)(;base64)?,/,u=(r||n)&&e.atob&&e.ArrayBuffer&&e.Uint8Array&&function(l){var f,s,h,p,g,o,b,v,B;if(f=l.match(c),!f)throw new Error("invalid data URI");for(s=f[2]?f[1]:"text/plain"+(f[3]||";charset=US-ASCII"),h=!!f[4],p=l.slice(f[0].length),h?g=atob(p):g=decodeURIComponent(p),o=new ArrayBuffer(g.length),b=new Uint8Array(o),v=0;v<g.length;v+=1)b[v]=g.charCodeAt(v);return r?new Blob([i?b:o],{type:s}):(B=new n,B.append(o),B.getBlob(s))};e.HTMLCanvasElement&&!t.toBlob&&(t.mozGetAsFile?t.toBlob=function(l,f,s){var h=this;setTimeout(function(){s&&t.toDataURL&&u?l(u(h.toDataURL(f,s))):l(h.mozGetAsFile("blob",f))})}:t.toDataURL&&u&&(t.msToBlob?t.toBlob=function(l,f,s){var h=this;setTimeout(function(){(f&&f!=="image/png"||s)&&t.toDataURL&&u?l(u(h.toDataURL(f,s))):l(h.msToBlob(f))})}:t.toBlob=function(l,f,s){var h=this;setTimeout(function(){l(u(h.toDataURL(f,s)))})})),a.exports?a.exports=u:e.dataURLtoBlob=u}(window)})(me);var ue=me.exports,Re=function(e){return typeof Blob>"u"?!1:e instanceof Blob||Object.prototype.toString.call(e)==="[object Blob]"},ce={strict:!0,checkOrientation:!0,retainExif:!1,maxWidth:1/0,maxHeight:1/0,minWidth:0,minHeight:0,width:void 0,height:void 0,resize:"none",quality:.8,mimeType:"auto",convertTypes:["image/png"],convertSize:5e6,beforeDraw:null,drew:null,success:null,error:null},De=typeof window<"u"&&typeof window.document<"u",y=De?window:{},C=function(e){return e>0&&e<1/0},Ue=Array.prototype.slice;function G(a){return Array.from?Array.from(a):Ue.call(a)}var Oe=/^image\/.+$/;function N(a){return Oe.test(a)}function Ae(a){var e=N(a)?a.substr(6):"";return e==="jpeg"&&(e="jpg"),".".concat(e)}var de=String.fromCharCode;function je(a,e,t){var r="",i;for(t+=e,i=e;i<t;i+=1)r+=de(a.getUint8(i));return r}var Pe=y.btoa;function he(a,e){for(var t=[],r=8192,i=new Uint8Array(a);i.length>0;)t.push(de.apply(null,G(i.subarray(0,r)))),i=i.subarray(r);return"data:".concat(e,";base64,").concat(Pe(t.join("")))}function ke(a){var e=new DataView(a),t;try{var r,i,n;if(e.getUint8(0)===255&&e.getUint8(1)===216)for(var c=e.byteLength,u=2;u+1<c;){if(e.getUint8(u)===255&&e.getUint8(u+1)===225){i=u;break}u+=1}if(i){var l=i+4,f=i+10;if(je(e,l,4)==="Exif"){var s=e.getUint16(f);if(r=s===18761,(r||s===19789)&&e.getUint16(f+2,r)===42){var h=e.getUint32(f+4,r);h>=8&&(n=f+h)}}}if(n){var p=e.getUint16(n,r),g,o;for(o=0;o<p;o+=1)if(g=n+o*12+2,e.getUint16(g,r)===274){g+=8,t=e.getUint16(g,r),e.setUint16(g,1,r);break}}}catch{t=1}return t}function Fe(a){var e=0,t=1,r=1;switch(a){case 2:t=-1;break;case 3:e=-180;break;case 4:r=-1;break;case 5:e=90,r=-1;break;case 6:e=90;break;case 7:e=90,t=-1;break;case 8:e=-90;break}return{rotate:e,scaleX:t,scaleY:r}}var Ce=/\.\d*(?:0|9){12}\d*$/;function ge(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1e11;return Ce.test(a)?Math.round(a*e)/e:a}function P(a){var e=a.aspectRatio,t=a.height,r=a.width,i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"none",n=C(r),c=C(t);if(n&&c){var u=t*e;(i==="contain"||i==="none")&&u>r||i==="cover"&&u<r?t=r/e:r=t*e}else n?t=r/e:c&&(r=t*e);return{width:r,height:t}}function Ie(a){for(var e=G(new Uint8Array(a)),t=e.length,r=[],i=0;i+3<t;){var n=e[i],c=e[i+1];if(n===255&&c===218)break;if(n===255&&c===216)i+=2;else{var u=e[i+2]*256+e[i+3],l=i+u+2,f=e.slice(i,l);r.push(f),i=l}}return r.reduce(function(s,h){return h[0]===255&&h[1]===225?s.concat(h):s},[])}function Le(a,e){var t=G(new Uint8Array(a));if(t[2]!==255||t[3]!==224)return a;var r=t[4]*256+t[5],i=[255,216].concat(e,t.slice(4+r));return new Uint8Array(i)}var Me=y.ArrayBuffer,z=y.FileReader,x=y.URL||y.webkitURL,Se=/\.\w+$/,He=y.Compressor,Ne=function(){function a(e,t){xe(this,a),this.file=e,this.exif=[],this.image=new Image,this.options=k(k({},ce),t),this.aborted=!1,this.result=null,this.init()}return Be(a,[{key:"init",value:function(){var t=this,r=this.file,i=this.options;if(!Re(r)){this.fail(new Error("The first argument must be a File or Blob object."));return}var n=r.type;if(!N(n)){this.fail(new Error("The first argument must be an image File or Blob object."));return}if(!x||!z){this.fail(new Error("The current browser does not support image compression."));return}Me||(i.checkOrientation=!1,i.retainExif=!1);var c=n==="image/jpeg",u=c&&i.checkOrientation,l=c&&i.retainExif;if(x&&!u&&!l)this.load({url:x.createObjectURL(r)});else{var f=new z;this.reader=f,f.onload=function(s){var h=s.target,p=h.result,g={},o=1;u&&(o=ke(p),o>1&&F(g,Fe(o))),l&&(t.exif=Ie(p)),u||l?!x||o>1?g.url=he(p,n):g.url=x.createObjectURL(r):g.url=p,t.load(g)},f.onabort=function(){t.fail(new Error("Aborted to read the image with FileReader."))},f.onerror=function(){t.fail(new Error("Failed to read the image with FileReader."))},f.onloadend=function(){t.reader=null},u||l?f.readAsArrayBuffer(r):f.readAsDataURL(r)}}},{key:"load",value:function(t){var r=this,i=this.file,n=this.image;n.onload=function(){r.draw(k(k({},t),{},{naturalWidth:n.naturalWidth,naturalHeight:n.naturalHeight}))},n.onabort=function(){r.fail(new Error("Aborted to load the image."))},n.onerror=function(){r.fail(new Error("Failed to load the image."))},y.navigator&&/(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(y.navigator.userAgent)&&(n.crossOrigin="anonymous"),n.alt=i.name,n.src=t.url}},{key:"draw",value:function(t){var r=this,i=t.naturalWidth,n=t.naturalHeight,c=t.rotate,u=c===void 0?0:c,l=t.scaleX,f=l===void 0?1:l,s=t.scaleY,h=s===void 0?1:s,p=this.file,g=this.image,o=this.options,b=document.createElement("canvas"),v=b.getContext("2d"),B=Math.abs(u)%180===90,I=(o.resize==="contain"||o.resize==="cover")&&C(o.width)&&C(o.height),R=Math.max(o.maxWidth,0)||1/0,D=Math.max(o.maxHeight,0)||1/0,U=Math.max(o.minWidth,0)||0,O=Math.max(o.minHeight,0)||0,T=i/n,m=o.width,d=o.height;if(B){var X=[D,R];R=X[0],D=X[1];var $=[O,U];U=$[0],O=$[1];var Y=[d,m];m=Y[0],d=Y[1]}I&&(T=m/d);var V=P({aspectRatio:T,width:R,height:D},"contain");R=V.width,D=V.height;var K=P({aspectRatio:T,width:U,height:O},"cover");if(U=K.width,O=K.height,I){var J=P({aspectRatio:T,width:m,height:d},o.resize);m=J.width,d=J.height}else{var q=P({aspectRatio:T,width:m,height:d}),Q=q.width;m=Q===void 0?i:Q;var Z=q.height;d=Z===void 0?n:Z}m=Math.floor(ge(Math.min(Math.max(m,U),R))),d=Math.floor(ge(Math.min(Math.max(d,O),D)));var pe=-m/2,be=-d/2,ye=m,we=d,L=[];if(I){var _=0,ee=0,M=i,S=n,te=P({aspectRatio:T,width:i,height:n},{contain:"cover",cover:"contain"}[o.resize]);M=te.width,S=te.height,_=(i-M)/2,ee=(n-S)/2,L.push(_,ee,M,S)}if(L.push(pe,be,ye,we),B){var re=[d,m];m=re[0],d=re[1]}b.width=m,b.height=d,N(o.mimeType)||(o.mimeType=p.type);var ae="transparent";p.size>o.convertSize&&o.convertTypes.indexOf(o.mimeType)>=0&&(o.mimeType="image/jpeg");var ie=o.mimeType==="image/jpeg";if(ie&&(ae="#fff"),v.fillStyle=ae,v.fillRect(0,0,m,d),o.beforeDraw&&o.beforeDraw.call(this,v,b),!this.aborted&&(v.save(),v.translate(m/2,d/2),v.rotate(u*Math.PI/180),v.scale(f,h),v.drawImage.apply(v,[g].concat(L)),v.restore(),o.drew&&o.drew.call(this,v,b),!this.aborted)){var ne=function(A){if(!r.aborted){var oe=function(j){return r.done({naturalWidth:i,naturalHeight:n,result:j})};if(A&&ie&&o.retainExif&&r.exif&&r.exif.length>0){var se=function(j){return oe(ue(he(Le(j,r.exif),o.mimeType)))};if(A.arrayBuffer)A.arrayBuffer().then(se).catch(function(){r.fail(new Error("Failed to read the compressed image with Blob.arrayBuffer()."))});else{var E=new z;r.reader=E,E.onload=function(H){var j=H.target;se(j.result)},E.onabort=function(){r.fail(new Error("Aborted to read the compressed image with FileReader."))},E.onerror=function(){r.fail(new Error("Failed to read the compressed image with FileReader."))},E.onloadend=function(){r.reader=null},E.readAsArrayBuffer(A)}}else oe(A)}};b.toBlob?b.toBlob(ne,o.mimeType,o.quality):ne(ue(b.toDataURL(o.mimeType,o.quality)))}}},{key:"done",value:function(t){var r=t.naturalWidth,i=t.naturalHeight,n=t.result,c=this.file,u=this.image,l=this.options;if(x&&u.src.indexOf("blob:")===0&&x.revokeObjectURL(u.src),n)if(l.strict&&!l.retainExif&&n.size>c.size&&l.mimeType===c.type&&!(l.width>r||l.height>i||l.minWidth>r||l.minHeight>i||l.maxWidth<r||l.maxHeight<i))n=c;else{var f=new Date;n.lastModified=f.getTime(),n.lastModifiedDate=f,n.name=c.name,n.name&&n.type!==c.type&&(n.name=n.name.replace(Se,Ae(n.type)))}else n=c;this.result=n,l.success&&l.success.call(this,n)}},{key:"fail",value:function(t){var r=this.options;if(r.error)r.error.call(this,t);else throw t}},{key:"abort",value:function(){this.aborted||(this.aborted=!0,this.reader?this.reader.abort():this.image.complete?this.fail(new Error("The compression process has been aborted.")):(this.image.onload=null,this.image.onabort()))}}],[{key:"noConflict",value:function(){return window.Compressor=He,a}},{key:"setDefaults",value:function(t){F(ce,t)}}]),a}();const Ge=({onChange:a,imageUrl:e,existedImage:t})=>{const[r,i]=W.useState(!1),n=W.useRef(null),c=W.useRef(null),u=s=>{s.preventDefault(),s.stopPropagation()},l=s=>{u(s),s.dataTransfer.files&&s.dataTransfer.files[0]&&(a(s.dataTransfer.files[0]),s.dataTransfer.clearData())},f=s=>{console.log(s.currentTarget.files[0],"WHAT IS THIS"),console.log(s.currentTarget.files,"ENTERING"),s.currentTarget.files&&s.currentTarget.files[0]&&a(s.currentTarget.files[0])};return w.jsxs("div",{ref:c,className:`${r?"border-4 border-dashed border-yellow-300 border-rounded mt-20":""} group w-10/12 relative mt-20 flex justify-center items-center bg-gray-950 transition duration-300 ease-in-out hover:bg-gray-900 cursor-pointer hover:bg-opacity-20 h-60 min-h-[20rem] hover:border-gray-900 hover:border-[1px] border-[1px] border-gray-950 `,style:{backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center",...e?{backgroundImage:`url(${e})`}:{backgroundImage:`url(${t})`}},onDragEnter:()=>i(!0),onDragLeave:()=>i(!1),onDrag:u,onDragStart:u,onDragEnd:u,onDragOver:u,onDrop:l,onClick:()=>{var s;return(s=n.current)==null?void 0:s.click()},children:[e&&w.jsx("div",{className:"absolute w-full h-full bg-gray-950 opacity-40  transition duration-300 ease-in-out group-hover:opacity-0"}),w.jsxs(w.Fragment,{children:[w.jsx("p",{className:"flex justify-center align-middle -mt-1 font-extrabold text-4xl text-gray-200 cursor-pointer select-none transition duration-300 ease-in-out group-hover:opacity-0 pointer-events-none z-10",children:"+"}),w.jsx("p",{className:" ml-2 flex justify-center align-middle  text-gray-200 items-center select-none transition duration-300 ease-in-out group-hover:opacity-0 z-10",children:"carga una imagen"})]}),w.jsx("input",{type:"file",ref:n,onChange:f,className:"hidden"})]})};export{Ne as C,Ge as I};