import{r as s}from"./jsx-runtime-D2HyDbKh.js";const l=typeof document<"u"?document:{},u=()=>{const o=s.useRef(),e=l.documentElement,{body:t}=l;return[()=>{if(!t||!t.style||o.current)return;const r=window.innerWidth-e.clientWidth,n=parseInt(window.getComputedStyle(t).getPropertyValue("padding-right"))||0;e.style.position="relative",e.style.overflow="hidden",t.style.position="relative",t.style.overflow="hidden",t.style.paddingRight=`${n+r}px`,o.current=!0},()=>{!t||!t.style||!o.current||(e.style.position="",e.style.overflow="",t.style.position="",t.style.overflow="",t.style.paddingRight="",o.current=!1)}]};export{u};
