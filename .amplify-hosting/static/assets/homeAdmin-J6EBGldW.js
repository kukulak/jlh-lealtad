import{j as e,r as a}from"./jsx-runtime-D2HyDbKh.js";import{l as o}from"./lo-JLH-hrz-big-CwKL34rO.js";import{L as s}from"./components-Cuo2WHyh.js";import{u as l,d as n,e as c}from"./index-CD45sefw.js";import"./index-zFQnOIg2.js";const m="/img/newUser.png",i="/img/goBigSearch.png",x="/img/goCupones.png",d="/img/goCuponesView.png",u=({user:r})=>e.jsxs("div",{className:" -mt-28 flex items-center content-center justify-center md:justify-start md:pt-[20vh] flex-col h-full",children:[e.jsx("h1",{className:" font-montserrat  text-3xl ",children:"Programa"}),e.jsx("h1",{className:" font-montserrat  text-5xl ",children:"de Lealtad"}),e.jsx("img",{className:"mt-3 w-11/12 max-w-[350px]",src:o,alt:"logo Just Like Home"}),e.jsxs("div",{className:"grid justify-evenly flex-wrap w-full mt-10",children:[e.jsxs(s,{className:"rounded-br-[2rem]  bg-slate-800 rounded-2xl w-36 h-36 flex-col  flex justify-center items-center  ",to:"/auth?mode=signup",children:[e.jsx("img",{className:"w-10 mb-3",src:m,alt:"more"}),e.jsx("p",{className:"text-center",children:"Nuevo Cliente"})]}),e.jsxs(s,{style:{gridColumnStart:2,gridRowStart:2},className:" bg-slate-800 rounded-2xl rounded-tl-[2rem]  w-36 h-36 flex-col  flex justify-center items-center  ",to:"/buscarCliente",children:[e.jsx("img",{className:"w-10 mb-3",src:i,alt:"more"}),e.jsx("p",{className:"text-center",children:"Buscar Cliente"})]})]}),e.jsxs("div",{className:"flex  items-center justify-center flex-col flex-wrap w-full",children:[e.jsxs(s,{className:"mt-14 flex hover:text-gray-600 rounded-xl w-34 h-14  text-gray-200",to:"/creador",children:[" ",e.jsx("img",{className:"w-5 h-5 m-3 mt-[3px]  ",src:x,alt:"more"}),"Crear ofertas y Promociones"]}),e.jsxs(s,{className:"mt-0  flex rounded-xl hover:text-gray-600 w-30 h-14 text-gray-200",to:"/cuponsList",children:[" ",e.jsx("img",{className:"w-5 h-5 m-3 mt-[3px] ",src:d,alt:"more"}),"Ver y editar tus cupones"]})]})]}),N=()=>[{title:"Programa de Lealtad Just Like Home"},{name:"description",content:"Programa de lealtad"}];function w(){const r=l();n();const t=c();return a.useEffect(()=>{(t==null?void 0:t.role)!=="ADMIN"&&r("/")},[t,r]),e.jsx(e.Fragment,{children:e.jsx("div",{className:" animate-buscador flex items-center flex-col content-center justify-center h-screen bg-gray-950 mt-10  ",children:e.jsx(u,{user:t==null?void 0:t.userName})})})}export{w as default,N as meta};