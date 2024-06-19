import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, redirect, json, unstable_parseMultipartFormData } from "@remix-run/node";
import { RemixServer, NavLink, Link, Form, useLoaderData, Outlet, Meta, Links, ScrollRestoration, Scripts, useNavigation, useNavigate, redirect as redirect$1, useActionData, useSearchParams, useOutletContext, json as json$1, useMatches, useParams, useFetcher } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { PrismaClient } from "@prisma/client";
import pkg from "bcryptjs";
import crypto, { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import { useRef, useState, useEffect } from "react";
import Compressor from "compressorjs";
import { ObjectId } from "mongodb";
import { QRCode } from "react-qrcode-logo";
import "react-confetti-explosion";
import "pure-react-carousel";
import gsap from "gsap";
import { useNavigate as useNavigate$1, useActionData as useActionData$1, useLoaderData as useLoaderData$1, redirect as redirect$2 } from "react-router";
import { gsap as gsap$1 } from "gsap/dist/gsap.js";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger.js";
import { useGSAP } from "@gsap/react";
import "@aws-sdk/lib-storage";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createId } from "@paralleldrive/cuid2";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const goHome = "/img/goHome.png";
const goSearch = "/img/goSearch.png";
const goProfile = "/img/goProfile.png";
const goSettings = "/img/goSettings.png";
const MenuMobile = ({ userId }) => {
  const menuItems = [
    { img: goHome, text: "|^|", link: "/homeAdmin" },
    { img: goSettings, text: ";)", link: `/humanProfile/${userId}` },
    { img: goSearch, text: "/˚", link: "/buscarCliente" },
    { img: goProfile, text: "∑´", link: "/explorar" }
  ];
  return /* @__PURE__ */ jsx("section", { className: " justify-center pointer-events-none z-40 mobile items-end fixed max-w-[700px] w-full h-full flex", children: /* @__PURE__ */ jsx("menu", { className: " w-11/12 rounded-xl mb-7 justify-evenly pt-2 max-w-full  gap-3  h-10 bg-[#2b323f] flex", children: menuItems.map(({ img, text, link }) => /* @__PURE__ */ jsxs(
    NavLink,
    {
      className: " mt-1 hover:scale-125 text-xs pointer-events-auto",
      to: link,
      children: [
        " ",
        /* @__PURE__ */ jsx("img", { className: "w-4", src: img, alt: "go" })
      ]
    },
    "item"
  )) }) });
};
let prisma;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  prisma.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  prisma = global.__db;
}
const MAIL_CREDENTIALS_P = process.env.MAIL_CREDENTIALS_P;
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  // Cambia esto por el host SMTP de tu proveedor de correo
  port: 465,
  // Usa el puerto adecuado (587 para TLS, 465 para SSL, 25 para no seguro)
  secure: false,
  // Cambia a true para el puerto 465
  auth: {
    user: "yaeshora@ahorraahora.app",
    // Tu dirección de correo electrónico
    pass: MAIL_CREDENTIALS_P
    // Tu contraseña
  }
});
async function sendEmail({ to, subject, text, link, password }) {
  const mailOptions = {
    from: '"Plan de Lealtad JustLikeHome" <no-reply@justlikehome.com> ',
    // Tu dirección de correo electrónico
    to,
    subject,
    text,
    html: `<p>${text}</p> <a styles=" padding: 10px; background-color: #030712; color: white" href=${link}> Activa tu cuenta </a> <p>O copia este link para activarla:</p> <p>${link}</p> <p>Para entrar usa el mail que registraste.</p> <p>Aqui tu password:</p><p>${password}</p> <p>Para mayor seguridad, actualiza este password.</p> `
  };
  console.log(to, subject, text);
  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado con éxito");
  } catch (error) {
    console.log("Error al enviar correo electrónico:", error);
  }
}
const { hash, compare } = pkg;
const SESSION_SECRET = process.env.SESSION_SECRET;
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session_MC",
    secure: process.env.NODE_ENV === "production",
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60,
    //30 days
    httpOnly: true,
    path: "/"
  }
});
async function createUserSession(userId, userName, userRole, redirectPath) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  session.set("userName", userName);
  session.set("userRole", userRole);
  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session)
    }
  });
}
async function getUserFromSession(request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  let userId = session.get("userId");
  const userName = session.get("userName");
  const role = session.get("userRole");
  console.log("getUserFromSession", userId);
  if (!userId) {
    console.log("NO SESSION");
    return userId = null;
  }
  return { userId, userName, role };
}
async function destroyUserSession(request) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}
async function requireUserSession(request) {
  const userId = await getUserFromSession(request);
  if (!userId) {
    throw redirect("/login");
  }
  return userId;
}
function generateToken() {
  return randomBytes(32).toString("hex");
}
async function signup({
  email,
  password,
  name,
  whatsapp,
  colonia,
  municipio,
  role
}) {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    const error = new Error("Esta dirección de email ya está registrada");
    error.status = 422;
    throw error;
  }
  const activationToken = generateToken();
  const tokenExpiry = /* @__PURE__ */ new Date();
  tokenExpiry.setHours(tokenExpiry.getHours() + 24);
  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      whatsapp,
      colonia,
      municipio,
      activationToken,
      tokenExpiry
    }
  });
  const activationLink = `https://jlhlealtad.com/activate/${activationToken}`;
  await sendEmail({
    to: email,
    subject: "Activa tu cuenta",
    text: "Activa tu cuenta haciendo clic en el siguiente enlace:",
    link: activationLink,
    password
  });
  if (role === "ADMIN") {
    return redirect(`/newRegistroPeludo/${user.id}`);
  } else {
    return createUserSession(user.id, user.name, user.role, "/newPeludo");
  }
}
async function getUser(userId) {
  const existingUser = await prisma.user.findFirst({ where: { id: userId } });
  if (!existingUser) {
    const error = new Error(
      "User doesn't Exist, tell us who are you how you get here"
    );
    error.status = 401;
    throw error;
  }
  const data = {
    name: existingUser.name,
    createdAt: existingUser.createdAt,
    email: existingUser.email,
    role: existingUser.role,
    whatsapp: existingUser.whatsapp,
    colonia: existingUser.colonia,
    municipio: existingUser.municipio,
    puntos: existingUser.puntos
  };
  console.log("DATA GET USER", { data });
  return data;
}
async function getHumanoByName(name) {
  const humano = await prisma.user.findMany({ where: { name } });
  return humano;
}
async function updateUser(id, userData) {
  console.log("UPDATE USER", id, userData);
  const dataToUpdate = {
    name: userData.name,
    email: userData.email,
    whatsapp: userData.whatsapp,
    colonia: userData.colonia,
    municipio: userData.municipio,
    role: userData.role
  };
  if (userData.password && userData.password.length >= 1) {
    dataToUpdate.password = await hash(userData.password, 12);
  }
  try {
    await prisma.user.update({
      where: { id },
      data: dataToUpdate
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw new Error("Error al actualizar el usuario");
  }
}
async function deleteUser(id) {
  try {
    await prisma.user.delete({
      where: { id }
    });
  } catch (error) {
    throw new Error("Failed to delete USER");
  }
}
async function login({ email, password }) {
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (!existingUser) {
    const error = new Error("Prueba con otras credenciales");
    error.status = 401;
    throw error;
  }
  console.log("ERROR -----  HORRROR FROM");
  const passwordCorrect = await compare(password, existingUser.password);
  if (!passwordCorrect) {
    const error = new Error("Las credenciales no son correctas.");
    error.status = 401;
    throw error;
  }
  return createUserSession(
    existingUser.id,
    existingUser.name,
    existingUser.role,
    existingUser.role === "ADMIN" ? "/homeAdmin" : `/humanProfile/${existingUser.id}`
  );
}
async function updatePuntos(peludoId, puntos) {
  const peludo = await prisma.peludo.findUnique({ where: { id: peludoId } });
  const user = await prisma.user.findUnique({
    where: { id: peludo.usuarioId }
  });
  try {
    const updatePuntos2 = await prisma.user.update({
      where: { id: user.id },
      data: { puntos: (Number(user.puntos) + puntos).toString() }
    });
    return updatePuntos2;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
const safeDocument = typeof document !== "undefined" ? document : {};
const useScrollBlock = () => {
  const scrollBlocked = useRef();
  const html = safeDocument.documentElement;
  const { body } = safeDocument;
  const blockScroll = () => {
    if (!body || !body.style || scrollBlocked.current)
      return;
    const scrollBarWidth = window.innerWidth - html.clientWidth;
    const bodyPaddingRight = parseInt(
      window.getComputedStyle(body).getPropertyValue("padding-right")
    ) || 0;
    html.style.position = "relative";
    html.style.overflow = "hidden";
    body.style.position = "relative";
    body.style.overflow = "hidden";
    body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;
    scrollBlocked.current = true;
  };
  const allowScroll = () => {
    if (!body || !body.style || !scrollBlocked.current)
      return;
    html.style.position = "";
    html.style.overflow = "";
    body.style.position = "";
    body.style.overflow = "";
    body.style.paddingRight = "";
    scrollBlocked.current = false;
  };
  return [blockScroll, allowScroll];
};
const BurgerMenu = ({ userId, userName, role }) => {
  const [blockScroll, allowScroll] = useScrollBlock();
  const dialog = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const manageOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      console.log("cierra");
      dialog.current.close();
      console.log("ALLOW SCROLL");
      allowScroll();
    } else {
      console.log("NO SCROLL");
      blockScroll();
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed w-full z-50", children: isOpen ? /* @__PURE__ */ jsx(
    "button",
    {
      className: " text-gray-800 w-full bg-opacity-95  bg-gray-950 h-screen flex flex-col gap-1 justify-start content-start flex-wrap text-left ",
      onClick: manageOpen,
      children: /* @__PURE__ */ jsxs(
        "dialog",
        {
          ref: dialog,
          onClick: (event) => event.stopPropagation(),
          open: true,
          className: "m-0 text-gray-800 p-5  bg-gray-300 h-screen flex flex-col gap-1 justify-starts content-start flex-wrap text-left ",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: manageOpen,
                className: " flex gap-[0.2rem] flex-col",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "bg-gray-800 rounded-full h-[3px] w-6 rotate-45" }),
                  /* @__PURE__ */ jsx("div", { className: "bg-gray-800 rounded-full h-[3px] w-6 -rotate-45 -mt-[6px]" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-row flex-wrap gap-3 items-center my-5", children: [
              /* @__PURE__ */ jsx("div", { className: " pl-1 flex object-center items-center justify-center rounded-full w-7 h-7 bg-gray-800", children: /* @__PURE__ */ jsxs("h3", { className: " text-md  text-gray-200 ", children: [
                " ",
                userName.substring(0, 1).toUpperCase(),
                "."
              ] }) }),
              /* @__PURE__ */ jsx(Link, { onClick: manageOpen, to: `/humanProfile/${userId}`, children: "Ver Perfil" })
            ] }),
            role === "ADMIN" && /* @__PURE__ */ jsx(Link, { onClick: manageOpen, to: "/homeAdmin", children: "ADMIN HOME" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-row flex-wrap gap-3 items-center mt-5 ", children: /* @__PURE__ */ jsx(Link, { onClick: manageOpen, to: `/explorar`, children: "Explorar" }) }),
            role === "ADMIN" && /* @__PURE__ */ jsx("div", { className: "flex flex-row flex-wrap gap-3 items-center my-1", children: /* @__PURE__ */ jsx(Link, { onClick: manageOpen, to: `/buscarCliente`, children: "Buscar" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col my-5 mt-[25vh] md:mt-[50vh]", children: [
              /* @__PURE__ */ jsx(Link, { onClick: manageOpen, to: "/aviso_de_privacidad", children: "Aviso de Privacidad" }),
              /* @__PURE__ */ jsx(Link, { onClick: manageOpen, to: "/terminos_y_condiciones", children: "Condiciones de Uso" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: " mt-5 ", children: /* @__PURE__ */ jsx(
              Form,
              {
                onSubmit: manageOpen,
                method: "post",
                action: "/logout",
                id: "logout-form",
                children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Cerrar Sesión" })
              }
            ) })
          ]
        }
      )
    }
  ) : /* @__PURE__ */ jsx("div", { className: "p-5 h-1 bg-gray-950", children: /* @__PURE__ */ jsxs("button", { onClick: manageOpen, className: " flex gap-1 flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gray-300 rounded-full h-[2px] w-4" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-300 rounded-full h-[2px] w-3" }),
    /* @__PURE__ */ jsx("div", { className: "bg-gray-300 rounded-full h-[2px] w-4" })
  ] }) }) });
};
const styles = "/assets/tailwind-C8xHCflX.css";
const links = () => [{ rel: "stylesheet", href: styles }];
function Document({
  children,
  userId,
  userName,
  userRole
}) {
  return /* @__PURE__ */ jsxs("html", { className: " font-sans", lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: " bg-gray-950 text-gray-200 flex justify-center", children: [
      userId && /* @__PURE__ */ jsx(BurgerMenu, { role: userRole, userName, userId }),
      /* @__PURE__ */ jsx("section", { className: " pt-1 flex flex-col justify-center w-full items-center", children }),
      /* @__PURE__ */ jsx(MenuMobile, { userId }),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  const loaderData = useLoaderData();
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    setUserId(loaderData == null ? void 0 : loaderData.userId);
    setUserName(loaderData == null ? void 0 : loaderData.userName);
    setUserRole(loaderData == null ? void 0 : loaderData.role);
  }, [loaderData == null ? void 0 : loaderData.userId, loaderData == null ? void 0 : loaderData.userName, loaderData == null ? void 0 : loaderData.userRole]);
  const [clienteId, setClienteId] = useState(loaderData == null ? void 0 : loaderData.userId);
  const [peludoId, setPeludoId] = useState([]);
  const changeClientId = (id) => {
    setClienteId(id);
  };
  return /* @__PURE__ */ jsx(Document, { userName, userId, userRole, children: /* @__PURE__ */ jsx(
    Outlet,
    {
      context: {
        userRole,
        clienteId,
        peludoId,
        changeClientId,
        setClienteId
      }
    }
  ) });
}
async function loader$e({ request }) {
  const user = getUserFromSession(request);
  return user;
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links,
  loader: loader$e
}, Symbol.toStringTag, { value: "Module" }));
async function action$l({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  if (!email || typeof email !== "string") {
    return json(
      { error: "El correo electrónico es requerido" },
      { status: 400 }
    );
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return json(
        { error: "No se encontró ningún usuario con ese correo electrónico" },
        { status: 404 }
      );
    }
    if (user.isActivated) {
      return json({ error: "La cuenta ya está activada" }, { status: 400 });
    }
    const activationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = /* @__PURE__ */ new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        activationToken,
        tokenExpiry
      }
    });
    const activationLink = `https://jlhlealtad.com/activate/${activationToken}`;
    await sendEmail({
      to: email,
      subject: "Nuevo Código de Activación",
      text: `Activa tu cuenta haciendo clic en el siguiente enlace: ${activationLink}`
    });
    return json({
      message: "Se ha enviado un nuevo código de activación a tu correo electrónico"
    });
  } catch (error) {
    console.error("Error al solicitar un nuevo código de activación:", error);
    return json(
      { error: "Error al solicitar un nuevo código de activación" },
      { status: 500 }
    );
  }
}
function RequestNewActivationToken() {
  return /* @__PURE__ */ jsxs("div", { className: "mt-32    ", children: [
    /* @__PURE__ */ jsx("h2", { children: "Solicitar Nuevo Código de Activación" }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        className: "flex flex-col justify-center items-center content-center ",
        method: "post",
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "p-2 w-full my-3",
              type: "email",
              name: "email",
              placeholder: "Ingresa tu correo electrónico",
              required: true
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "bg-gray-800 p-5 w-10/12 flex justify-center", children: /* @__PURE__ */ jsx("button", { type: "submit", children: "Solicitar Nuevo Código" }) })
        ]
      }
    )
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$l,
  default: RequestNewActivationToken
}, Symbol.toStringTag, { value: "Module" }));
const terminos_y_condiciones = () => {
  return /* @__PURE__ */ jsxs("div", { className: " pt-16 flex flex-col gap-5 p-5 w-11/12 ", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-xl", children: [
      " ",
      "Términos y Condiciones del Programa de Lealtad de Just Like Home"
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "1. Introducción" }),
    /* @__PURE__ */ jsx("p", { children: "Bienvenido al Programa de Lealtad de Just Like Home. Estos términos y condiciones regulan el uso de nuestra web app y la participación en el programa de lealtad. Al registrarte y utilizar nuestra web app, aceptas cumplir con estos términos y condiciones." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "2. Registro y Uso del Programa" }),
    /* @__PURE__ */ jsx("p", { children: "2.1 Para participar en el programa de lealtad, debes registrarte proporcionando la siguiente información:" }),
    /* @__PURE__ */ jsx("p", { children: "Nombre del Humano" }),
    /* @__PURE__ */ jsx("p", { children: "Email" }),
    /* @__PURE__ */ jsx("p", { children: "Whatsapp" }),
    /* @__PURE__ */ jsx("p", { children: "Colonia" }),
    /* @__PURE__ */ jsx("p", { children: "Municipio" }),
    /* @__PURE__ */ jsx("p", { children: "Nombre del perro" }),
    /* @__PURE__ */ jsx("p", { children: "Raza del perro" }),
    /* @__PURE__ */ jsx("p", { children: "Fecha de nacimiento del perro" }),
    /* @__PURE__ */ jsx("p", { children: "2.2 Puedes subir una foto de perfil y nosotros actualizaremos la foto de tu perro según sea necesario." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "3. Cupones y Beneficios" }),
    /* @__PURE__ */ jsx("p", { children: "3.1 Los usuarios recibirán cupones a través del programa de lealtad. Estos cupones podrán ser utilizados según las condiciones especificadas en cada cupón." }),
    /* @__PURE__ */ jsx("p", { children: "3.2 Just Like Home recopilará información sobre el uso de los cupones para mejorar nuestros servicios y ofertas. Esto incluye datos sobre cuándo y cuáles cupones son utilizados y cuáles tienen mayor atractivo." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "4. Uso de la Información" }),
    /* @__PURE__ */ jsx("p", { children: "4.1 La información proporcionada será utilizada para gestionar tu participación en el programa de lealtad, ofrecerte cupones personalizados y mejorar nuestros servicios." }),
    /* @__PURE__ */ jsx("p", { children: "4.2 Nos comprometemos a proteger tu privacidad y la de tu mascota, conforme a nuestro Aviso de Privacidad." }),
    /* @__PURE__ */ jsx("p", { children: "5. Modificaciones a los Términos y Condiciones" }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "5.1 Just Like Home se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones serán efectivas una vez publicadas en nuestra web app." }),
    /* @__PURE__ */ jsx("p", { children: "5.2 Es tu responsabilidad revisar regularmente los términos y condiciones para estar al tanto de cualquier cambio." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "6. Contacto" }),
    /* @__PURE__ */ jsx("p", { children: "Para cualquier duda o consulta sobre estos términos y condiciones, puedes contactarnos a través de nuestro formulario de contacto en la web app." })
  ] });
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: terminos_y_condiciones
}, Symbol.toStringTag, { value: "Module" }));
const PeludoForm = ({ imageUrl, usuarioId }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  return /* @__PURE__ */ jsx("div", { className: "mt-10 w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsxs(
    Form,
    {
      method: "post",
      className: " rounded-xl  w-10/12 flex flex-col gap-3 text-gray-900",
      children: [
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "imageUrl", id: "imageUrl", value: imageUrl }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "usuarioId",
            id: "usuarioId",
            value: usuarioId
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: " w-12/12 flex flex-col gap-3 text-gray-900 bg-gray-800 px-3 py-6", children: [
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "nombre", children: "Nombre del peludo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "h-10 p-4",
              type: "text",
              name: "nombre",
              id: "nombre",
              required: true
            }
          ),
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "raza", children: "Raza" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              required: true,
              className: "h-10 p-4",
              type: "text",
              name: "raza",
              id: "raza"
            }
          ),
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "nacimiento", children: "Fecha de nacimiento" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "h-10 p-4",
              type: "date",
              name: "nacimiento",
              id: "nacimiento",
              required: true
            }
          ),
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "instagram", children: "Instagram" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              required: true,
              className: "h-10 p-4",
              type: "text",
              name: "instagram",
              id: "instagram"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-5 flex-wrap align-baseline", children: /* @__PURE__ */ jsx("button", { className: " rounded-lg self-center flex justify-center items-center text-lg text-gray-100 text-center  p-4 border-spacing-1 border-gray-600 border-2 mt-10 mb-10", children: isSubmitting ? "En ello..." : "Dar de alta" }) })
      ]
    }
  ) });
};
async function createFoto(peludoId, file) {
  console.log(
    "PARA HACER LA FOTO HAY QUE PASAR POR AQUI coN DATA CORRECTA",
    peludoId,
    file
  );
  const newFoto = await prisma.foto.create({
    data: {
      peludoId,
      url: file
    }
  });
  return newFoto;
}
async function newPeludo(dataPeludo, userId, file) {
  try {
    console.log("DATA FROm SERVER", dataPeludo);
    const newPeludo2 = await prisma.Peludo.create({
      data: {
        nombre: dataPeludo.nombre,
        usuario: { connect: { id: userId || void 0 } },
        raza: dataPeludo.raza,
        nacimiento: dataPeludo.nacimiento,
        foto: file,
        amigos: "",
        qrCode: "",
        instagram: dataPeludo.instagram
      }
    });
    console.log("NEPEULUDO ID", newPeludo2.id);
    if (newPeludo2.foto) {
      createFoto(newPeludo2.id, newPeludo2.foto);
    }
    return newPeludo2;
  } catch (error) {
    throw new Error(error);
  }
}
async function getPeludo(peludoId) {
  if (!ObjectId.isValid(peludoId)) {
    throw new Error("Invalid Peludo ID");
  }
  const peludo = await prisma.Peludo.findUnique({
    where: { id: peludoId },
    include: { fotos: { orderBy: { id: "desc" } } }
    // include: { fotos: true }
  });
  if (!peludo) {
    throw new Error("Peludo not found");
  }
  const data = {
    nombre: peludo.nombre,
    usuario: peludo.usuario,
    foto: peludo.foto,
    raza: peludo.raza,
    nacimiento: peludo.nacimiento,
    id: peludo.id,
    likes: peludo.likes,
    amigos: peludo.amigos,
    qrCode: peludo.qrCode,
    instagram: peludo.instagram,
    cupones: peludo.cupones,
    fotos: peludo.fotos
  };
  console.log("DATAPELUDOSERVER", data);
  return data;
}
async function getAllPeludosByUser(humanoId) {
  try {
    const peludos = await prisma.Peludo.findMany({
      where: { usuarioId: humanoId }
    });
    return peludos;
  } catch (error) {
    console.log("ERROR", error);
  }
}
async function getAllPeludos(humanoId) {
  try {
    const peludos = await prisma.Peludo.findMany({
      where: { usuarioId: humanoId }
    });
    return peludos;
  } catch (error) {
    console.log("ERROR", error);
  }
}
async function getPeludoByName(name) {
  try {
    const peludo = await prisma.Peludo.findMany({
      where: { nombre: name }
    });
    return peludo;
  } catch (error) {
    console.log("ERROR", error);
  }
}
async function updatePeludo(id, peludoData, file) {
  console.log("UPDATE peludo", id, peludoData, file);
  try {
    const updatePeludo2 = await prisma.Peludo.update({
      where: { id },
      data: {
        nombre: peludoData.nombre,
        raza: peludoData.raza,
        nacimiento: peludoData.nacimiento,
        instagram: peludoData.instagram,
        foto: file
      }
    });
    console.log("UPSATEPELUDO");
    if (file) {
      await createFoto(id, file);
    }
    console.log("createdFoto");
    return updatePeludo2;
  } catch (error) {
    console.log("ERROR", error);
    throw new Error("Failed to update peludo.");
  }
}
async function deletePeludo(id) {
  try {
    await prisma.Peludo.delete({
      where: { id }
    });
  } catch (error) {
    throw new Error("Failed to delete USER");
  }
}
const ImageUploader = ({ onChange, imageUrl, existedImage }) => {
  const [draggingOver, setDraggingOver] = useState(false);
  const fileInputRef = useRef(null);
  const dropRef = useRef(null);
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    preventDefaults(e);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  const handleChange = (event) => {
    console.log(event.currentTarget.files[0], "WHAT IS THIS");
    console.log(event.currentTarget.files, "ENTERING");
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      onChange(event.currentTarget.files[0]);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: dropRef,
      className: `${draggingOver ? "border-4 border-dashed border-yellow-300 border-rounded mt-20" : ""} group w-10/12 relative mt-20 flex justify-center items-center bg-gray-950 transition duration-300 ease-in-out hover:bg-gray-900 cursor-pointer hover:bg-opacity-20 h-60 min-h-[20rem] hover:border-gray-900 hover:border-[1px] border-[1px] border-gray-950 `,
      style: {
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        ...imageUrl ? { backgroundImage: `url(${imageUrl})` } : { backgroundImage: `url(${existedImage})` }
      },
      onDragEnter: () => setDraggingOver(true),
      onDragLeave: () => setDraggingOver(false),
      onDrag: preventDefaults,
      onDragStart: preventDefaults,
      onDragEnd: preventDefaults,
      onDragOver: preventDefaults,
      onDrop: handleDrop,
      onClick: () => {
        var _a;
        return (_a = fileInputRef.current) == null ? void 0 : _a.click();
      },
      children: [
        imageUrl && /* @__PURE__ */ jsx("div", { className: "absolute w-full h-full bg-gray-950 opacity-40  transition duration-300 ease-in-out group-hover:opacity-0" }),
        /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { className: "flex justify-center align-middle -mt-1 font-extrabold text-4xl text-gray-200 cursor-pointer select-none transition duration-300 ease-in-out group-hover:opacity-0 pointer-events-none z-10", children: "+" }),
          /* @__PURE__ */ jsx("p", { className: " ml-2 flex justify-center align-middle  text-gray-200 items-center select-none transition duration-300 ease-in-out group-hover:opacity-0 z-10", children: "carga una imagen" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            ref: fileInputRef,
            onChange: handleChange,
            className: "hidden"
          }
        )
      ]
    }
  );
};
const CreatePeludo$1 = () => {
  const navigate2 = useNavigate();
  const { userActivoId } = useLoaderData();
  console.log("DESDE NEW PELUDO despues de registro", userActivoId);
  const [formData, setFormData] = useState({});
  async function handleFileUpload(file) {
    const compressedImage = await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        // Ajusta la calidad de la compresión (0.1 - 1.0)
        maxWidth: 800,
        // Establece el ancho máximo de la imagen
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        }
      });
    });
    let inputFormData = new FormData();
    inputFormData.append("dream-pic", compressedImage);
    const response = await fetch("/images", {
      method: "POST",
      body: inputFormData
    });
    if (typeof document === "undefined") {
      console.log("running in a server environment");
    } else {
      console.log("running in a browser environment");
    }
    console.log("HANDELING", inputFormData.getAll("dream-pic"));
    const { imageUrl } = await response.json();
    console.log("IMAGEURL", imageUrl);
    setFormData({
      ...formData,
      peludoPicture: imageUrl
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "  w-full items-center flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx(
      ImageUploader,
      {
        onChange: handleFileUpload,
        imageUrl: formData.peludoPicture
      }
    ),
    /* @__PURE__ */ jsx(PeludoForm, { imageUrl: formData.peludoPicture, usuarioId: userActivoId }),
    /* @__PURE__ */ jsx("div", { className: "w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsx(
      "button",
      {
        className: "  self-center border-2 border-gray-600 rounded-lg text-lg text-gray-100 text-center py-3  px-5 mt-3 mb-20 ",
        onClick: () => navigate2(-1),
        children: "Regresar"
      }
    ) })
  ] });
};
async function action$k({ request }) {
  const userId = await requireUserSession(request);
  console.log(userId.userId, "by REQUEST");
  const formData = await request.formData();
  const dataPeludo = Object.fromEntries(formData);
  console.log("DATA PELUDO", dataPeludo);
  const file = await formData.get("imageUrl");
  const deHumano = dataPeludo.usuarioId.length > 8 ? dataPeludo.usuarioId : userId.userId;
  try {
    await newPeludo(dataPeludo, deHumano, file);
    console.log("action processed", dataPeludo.nombre);
    return redirect$1("/");
  } catch (error) {
    console.log(error);
    if (error.status === 422) {
      return { dataPeludo: error.message };
    } else {
      return { dataPeludo: error.message };
    }
  }
}
async function loader$d({ request, params }) {
  const userActivoId = params.id;
  console.log(userActivoId, "USER ACTIVO ID", "no debe ser el logeado");
  return { userActivoId };
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$k,
  default: CreatePeludo$1,
  loader: loader$d
}, Symbol.toStringTag, { value: "Module" }));
async function loader$c({ params }) {
  const { token } = params;
  const user = await prisma.user.findUnique({
    where: { passwordResetToken: token }
  });
  if (!user || user.tokenExpiry < /* @__PURE__ */ new Date()) {
    return json({ error: "Token inválido o expirado" }, { status: 400 });
  }
  return json({ token });
}
async function action$j({ request, params }) {
  const formData = await request.formData();
  const newPassword = formData.get("password");
  const user = await prisma.user.findUnique({
    where: { passwordResetToken: params.token }
  });
  if (!user || user.tokenExpiry < /* @__PURE__ */ new Date()) {
    return json({ error: "Token inválido o expirado" }, { status: 400 });
  }
  const hashedPassword = await pkg.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      tokenExpiry: null
    }
  });
  return redirect("/reset-password-success");
}
function ResetPassword() {
  useLoaderData();
  const actionData = useActionData();
  if (actionData == null ? void 0 : actionData.error) {
    return /* @__PURE__ */ jsx("div", { children: actionData.error });
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Restablecer contraseña" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        "Nueva contraseña:",
        /* @__PURE__ */ jsx("input", { type: "password", name: "password", required: true })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", children: "Restablecer" })
    ] })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$j,
  default: ResetPassword,
  loader: loader$c
}, Symbol.toStringTag, { value: "Module" }));
const aviso_de_privacidad = () => {
  return /* @__PURE__ */ jsxs("div", { className: "pt-16  flex flex-col gap-5 p-5 w-11/12 ", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-xl", children: [
      " ",
      "Aviso de Privacidad del Programa de Lealtad de Just Like Home"
    ] }),
    /* @__PURE__ */ jsx("p", { children: "Just Like Home, con domicilio en [DIRECCIÓN], es responsable de la protección de tus datos personales y los de tu mascota. Este aviso de privacidad explica cómo recopilamos, usamos y protegemos tu información personal conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "1. Datos Personales Recopilados" }),
    /* @__PURE__ */ jsx("p", { children: "Recopilamos los siguientes datos personales y de tu mascota:" }),
    /* @__PURE__ */ jsx("p", { children: "Nombre del Humano" }),
    /* @__PURE__ */ jsx("p", { children: "Email" }),
    /* @__PURE__ */ jsx("p", { children: "Whatsapp" }),
    /* @__PURE__ */ jsx("p", { children: "Colonia" }),
    /* @__PURE__ */ jsx("p", { children: "Municipio" }),
    /* @__PURE__ */ jsx("p", { children: "Nombre del perro" }),
    /* @__PURE__ */ jsx("p", { children: "Raza del perro" }),
    /* @__PURE__ */ jsx("p", { children: "Fecha de nacimiento del perro" }),
    /* @__PURE__ */ jsx("p", { children: "Además, los usuarios pueden subir una foto de perfil y nosotros actualizaremos la foto de su perro." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "2. Finalidades del Tratamiento de Datos" }),
    /* @__PURE__ */ jsx("p", { children: "Los datos personales serán utilizados para las siguientes finalidades:" }),
    /* @__PURE__ */ jsx("p", { children: "Gestionar tu participación en el programa de lealtad." }),
    /* @__PURE__ */ jsx("p", { children: "Ofrecerte cupones y beneficios personalizados." }),
    /* @__PURE__ */ jsx("p", { children: "Mejorar nuestros servicios mediante el análisis del uso de cupones y preferencias." }),
    /* @__PURE__ */ jsx("p", { children: "Contactarte para informarte sobre nuevos servicios y promociones." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "3. Derechos ARCO" }),
    /* @__PURE__ */ jsx("p", { children: "Tienes derecho a acceder, rectificar, cancelar u oponerte (ARCO) al tratamiento de tus datos personales. Para ejercer estos derechos, por favor envía una solicitud al correo [CORREO ELECTRÓNICO] o visita nuestras oficinas en [DIRECCIÓN]." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "4. Medidas de Seguridad" }),
    /* @__PURE__ */ jsx("p", { children: "Implementamos medidas de seguridad para proteger tu información personal contra el acceso no autorizado, alteración, divulgación o destrucción." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "5. Transferencias de Datos" }),
    /* @__PURE__ */ jsx("p", { children: "Just Like Home no transferirá tus datos personales a terceros sin tu consentimiento, salvo que sea requerido por ley." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "6. Modificaciones al Aviso de Privacidad" }),
    /* @__PURE__ */ jsx("p", { children: "Nos reservamos el derecho de modificar este aviso de privacidad en cualquier momento. Las modificaciones serán publicadas en nuestra web app." }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mt-10", children: "7. Contacto" }),
    /* @__PURE__ */ jsx("p", { children: "Para cualquier duda sobre este aviso de privacidad, puedes contactarnos a través del correo [CORREO ELECTRÓNICO] o en nuestras oficinas en [DIRECCIÓN]." })
  ] });
};
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: aviso_de_privacidad
}, Symbol.toStringTag, { value: "Module" }));
function ResetPasswordSuccess() {
  return /* @__PURE__ */ jsx("div", { children: "¡Tu contraseña ha sido restablecida con éxito!" });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ResetPasswordSuccess
}, Symbol.toStringTag, { value: "Module" }));
function ActivationSuccess() {
  const redirect2 = useNavigate();
  useEffect(() => {
    redirect2("/");
  }, []);
  return /* @__PURE__ */ jsx("div", { className: " mt-32 w-6/12 h-6/12 text-center", children: "¡Tu cuenta ha sido activada con éxito!" });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ActivationSuccess
}, Symbol.toStringTag, { value: "Module" }));
const Rewards = ({ numero, promocion, style }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: " p-5 w-40 h-40 rounded-xl flex flex-col justify-center align-middle items-center  text-center animate-placa",
      style: style ? { backgroundColor: `#1f2937${Math.ceil(style * 100)}` } : { backgroundColor: `#1f2937` },
      children: [
        numero && /* @__PURE__ */ jsxs("div", { className: "text-3xl animate-mensaje", children: [
          " ",
          numero,
          " "
        ] }),
        !numero ? /* @__PURE__ */ jsxs("div", { children: [
          " ",
          promocion,
          " "
        ] }) : /* @__PURE__ */ jsxs("div", { className: "text-xs mt-5 animate-mensaje", children: [
          " ",
          promocion,
          " "
        ] })
      ]
    }
  );
};
const Seccion = ({
  titulo,
  promociones,
  onClick,
  descripcion,
  cuponId,
  visitsRemaining,
  user
}) => {
  let firstClickableFound = false;
  return /* @__PURE__ */ jsx("div", { className: " bg-gray-500 rounded-2xl md:px-5 my-1 pt-10 pb-10 bg-opacity-10", children: titulo && /* @__PURE__ */ jsxs("div", { className: "flex gap-5 flex-col mb-20", children: [
    /* @__PURE__ */ jsx("p", { className: "ml-10 text-2xl", children: titulo }),
    /* @__PURE__ */ jsxs("div", { className: " flex flex-wrap justify-center gap-5 ", children: [
      user.role !== "ADMIN" && (promociones == null ? void 0 : promociones.map((promo, index) => /* @__PURE__ */ jsxs(Fragment, { children: [
        visitsRemaining[index] >= 1 && [...Array(visitsRemaining[index] - 1)].map((visit, i) => /* @__PURE__ */ jsx(
          "button",
          {
            disabled: false,
            onClick: () => onClick(
              promo,
              descripcion[index],
              cuponId[index],
              visitsRemaining[index] - i
            ),
            className: "flex flex-wrap justify-center gap-5 ",
            children: /* @__PURE__ */ jsx(
              Rewards,
              {
                numero: visitsRemaining[index] - i - 1,
                promocion: `para la siguiente promoción`,
                style: (i + 1 * 0.9) / [...Array(visitsRemaining[index])].length
              },
              visit
            )
          },
          index
        )),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: false,
            onClick: () => onClick(promo, descripcion[index], cuponId[index]),
            className: "flex flex-wrap justify-center gap-5 ",
            children: /* @__PURE__ */ jsx(Rewards, { promocion: promo })
          },
          index
        )
      ] }))),
      user.role === "ADMIN" && (promociones == null ? void 0 : promociones.map((promo, index) => /* @__PURE__ */ jsxs(React.Fragment, { children: [
        visitsRemaining[index] >= 1 && [...Array(visitsRemaining[index] - 1)].map((visit, i) => {
          const isClickable = !firstClickableFound;
          if (isClickable) {
            firstClickableFound = true;
          }
          return /* @__PURE__ */ jsx(
            "button",
            {
              disabled: !isClickable,
              onClick: () => onClick(
                promo,
                descripcion[index],
                cuponId[index],
                visitsRemaining[index] - i
              ),
              className: "flex flex-wrap justify-center gap-5",
              children: /* @__PURE__ */ jsx(
                Rewards,
                {
                  numero: visitsRemaining[index] - i - 1,
                  promocion: `para la siguiente promoción`,
                  style: (i + 1 * 0.9) / [...Array(visitsRemaining[index])].length
                },
                `reward-${index}-${i}`
              )
            },
            `visit-${index}-${i}`
          );
        }),
        /* @__PURE__ */ jsx(
          "button",
          {
            disabled: firstClickableFound,
            onClick: () => onClick(promo, descripcion[index], cuponId[index]),
            className: "flex flex-wrap justify-center gap-5",
            children: /* @__PURE__ */ jsx(Rewards, { promocion: promo })
          },
          `promo-${index}`
        ),
        !firstClickableFound && (firstClickableFound = true)
      ] }, `promo-${index}`)))
    ] })
  ] }) });
};
function Modal({ children, onClose, estado }) {
  const [blockScroll, allowScroll] = useScrollBlock();
  const dialog = useRef();
  useEffect(() => {
    if (estado) {
      blockScroll();
    } else {
      allowScroll();
    }
  }, [allowScroll, blockScroll, estado]);
  if (!estado)
    return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "top-0 right-0 fixed z-50 w-screen h-screen bg-opacity-95  modal-backdrop flex justify-items-center items-center bg-gray-800 pt-[8%] overflow-auto ",
      onClick: onClose,
      children: /* @__PURE__ */ jsx(
        "dialog",
        {
          ref: dialog,
          className: " w-10/12 artmodal bg-grey flex flex-row flex-wrap gap-5 bg-transparent justify-items-start mt-0 pt-5 justify-center",
          open: true,
          onClick: (event) => event.stopPropagation(),
          children
        }
      )
    }
  );
}
const UrlCreator = (id) => {
  const idPerruno = id.toString();
  const url = "http://localhost:5173/profile/";
  return url + idPerruno;
};
const more = "/img/newUser.png";
const goBigSearch = "/img/goBigSearch.png";
const goCupones = "/img/goCupones.png";
const goCuponesView = "/img/goCuponesView.png";
const loJLH = "/img/lo-JLH-hrz-big.png";
const Intro = ({ user }) => {
  return /* @__PURE__ */ jsxs("div", { className: " -mt-28 flex items-center content-center justify-center md:justify-start md:pt-[20vh] flex-col h-full", children: [
    /* @__PURE__ */ jsx("h1", { className: " font-montserrat  text-3xl ", children: "Programa" }),
    /* @__PURE__ */ jsx("h1", { className: " font-montserrat  text-5xl ", children: "de Lealtad" }),
    /* @__PURE__ */ jsx(
      "img",
      {
        className: "mt-3 w-11/12 max-w-[350px]",
        src: loJLH,
        alt: "logo Just Like Home"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid justify-evenly flex-wrap w-full mt-10", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          className: "rounded-br-[2rem]  bg-slate-800 rounded-2xl w-36 h-36 flex-col  flex justify-center items-center  ",
          to: "/auth?mode=signup",
          children: [
            /* @__PURE__ */ jsx("img", { className: "w-10 mb-3", src: more, alt: "more" }),
            /* @__PURE__ */ jsx("p", { className: "text-center", children: "Nuevo Cliente" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          style: { gridColumnStart: 2, gridRowStart: 2 },
          className: " bg-slate-800 rounded-2xl rounded-tl-[2rem]  w-36 h-36 flex-col  flex justify-center items-center  ",
          to: "/buscarCliente",
          children: [
            /* @__PURE__ */ jsx("img", { className: "w-10 mb-3", src: goBigSearch, alt: "more" }),
            /* @__PURE__ */ jsx("p", { className: "text-center", children: "Buscar Cliente" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex  items-center justify-center flex-col flex-wrap w-full", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          className: "mt-14 flex hover:text-gray-600 rounded-xl w-34 h-14  text-gray-200",
          to: "/creador",
          children: [
            " ",
            /* @__PURE__ */ jsx("img", { className: "w-5 h-5 m-3 mt-[3px]  ", src: goCupones, alt: "more" }),
            "Crear ofertas y Promociones"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          className: "mt-0  flex rounded-xl hover:text-gray-600 w-30 h-14 text-gray-200",
          to: "/cuponsList",
          children: [
            " ",
            /* @__PURE__ */ jsx(
              "img",
              {
                className: "w-5 h-5 m-3 mt-[3px] ",
                src: goCuponesView,
                alt: "more"
              }
            ),
            "Ver y editar tus cupones"
          ]
        }
      )
    ] })
  ] });
};
const PeludoOnHuman = ({ nombre, peludoId, foto, onClick }) => {
  return /* @__PURE__ */ jsxs("div", { className: "pt-6 flex flex-col mt-24 bg-[#37415142]  p-5 rounded-lg", children: [
    " ",
    /* @__PURE__ */ jsx("div", { className: "rounded-full place-self-center flex w-[130px] bottom h-[130px] bg-gray-700 overflow-hidden -mt-16 mb-10 z-10 justify-center items-stretch", children: /* @__PURE__ */ jsx(
      "img",
      {
        alt: "Foto de tu perrito",
        src: foto,
        className: "object-cover w-[130px]  "
      }
    ) }),
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/profile/${peludoId}`,
        className: " bg-gray-800 text-gray-300 mt-0 py-3 px-5  place-self-center justify-center flex rounded-lg",
        onClick,
        children: [
          "Ir al Perfil de",
          " ",
          /* @__PURE__ */ jsxs("span", { className: " first-letter:uppercase font-bold", children: [
            " ",
            "  ",
            nombre,
            " "
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      Link,
      {
        to: `/editPeludo/${peludoId}`,
        className: " bg-yellow-400 mt-6 w-28 p-2 justify-center flex place-self-center rounded-lg",
        onClick,
        children: "Editar"
      }
    )
  ] });
};
function ProfileForm(signUp) {
  const [searchParams] = useSearchParams();
  const { humano } = useLoaderData();
  console.log("PROFILE", humano);
  const navigation = useNavigation();
  const validationErrors = useActionData();
  console.log("MODE", searchParams.get("mode"));
  searchParams.get("mode") || "login";
  const defaultValues = humano && {
    name: humano.name,
    email: humano.email,
    whatsapp: humano.whatsapp,
    colonia: humano.colonia,
    municipio: humano.municipio,
    role: humano.role
  };
  useState(defaultValues.privacy);
  const isSubmitting = navigation.state !== "idle";
  return /* @__PURE__ */ jsx(Form, { method: "patch", className: "w-full flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col  gap-5 w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: "font-semibold px-4 text-gray-100 text-lg my-1",
          htmlFor: "name",
          children: "Nombre Completo"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "name",
          name: "name",
          className: "h-12 p-4 text-gray-800",
          type: "text",
          placeholder: "Tu nombre permanecerá privado, solo es para comunicarnos contigo",
          autoComplete: "off",
          defaultValue: defaultValues.name
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: "font-semibold px-4 text-gray-100 text-lg my-1",
          htmlFor: "email",
          children: "eMail"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "email",
          name: "email",
          className: "h-12 p-4 text-gray-800",
          type: "text",
          placeholder: "Te mandaremos ofertas, promociones y algun recordatorio",
          autoComplete: "off",
          defaultValue: defaultValues.email
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: "font-semibold my-1 px-4  text-gray-100",
          htmlFor: "whatsapp",
          children: "Whatsapp"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "h-12 p-4 text-gray-800",
          type: "tel",
          name: "whatsapp",
          id: "whatsapp",
          placeholder: "Es nuestro principal medio de comunicacion",
          required: true,
          defaultValue: defaultValues.whatsapp
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: " font-semibold my-1 px-4  text-gray-100",
          htmlFor: "colonia",
          children: "Colonia"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "h-10 p-4 text-gray-800",
          type: "text",
          name: "colonia",
          id: "colonia",
          defaultValue: defaultValues.colonia
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: " font-semibold my-1 px-4  text-gray-100",
          htmlFor: "municipio",
          children: "Municipio"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "h-10 p-4 text-gray-800",
          type: "text",
          name: "municipio",
          id: "municipio",
          defaultValue: defaultValues.municipio
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: " font-semibold my-1 px-4  text-gray-100",
          htmlFor: "password",
          children: "Password"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "h-10 p-4 text-gray-800",
          type: "password",
          name: "password",
          id: "password",
          placeholder: "********"
        }
      )
    ] }),
    validationErrors && /* @__PURE__ */ jsx("div", { children: Object.values(validationErrors).map((error) => /* @__PURE__ */ jsx("p", { children: error }, error)) }),
    /* @__PURE__ */ jsx("div", { className: " bg-gray-800 form-actions text-gray-200 border-2 border-gray-400 p-4 flex justify-center flex-wrap gap-2 items-center rounded-lg mt-5", children: /* @__PURE__ */ jsx(
      "button",
      {
        children: isSubmitting ? "Authenticating..." : "Actualizar"
      }
    ) })
  ] }) });
}
const HumanProfile = () => {
  UrlCreator("rocket");
  useNavigate();
  const { humano, peludos, user, humanoId } = useLoaderData();
  const { changeClientId, setClienteId } = useOutletContext();
  console.log("El ID a usar", humanoId);
  const [estado, setEstado] = useState(false);
  console.log("ESTADO", estado);
  function closeHandler() {
    setEstado(!estado);
  }
  function openModalHandler() {
    setEstado(true);
  }
  const changeContext = () => {
    setClienteId(humanoId);
  };
  return /* @__PURE__ */ jsxs("div", { className: "mt-10", children: [
    /* @__PURE__ */ jsx(Modal, { onClose: closeHandler, estado, children: /* @__PURE__ */ jsx(ProfileForm, {}) }),
    /* @__PURE__ */ jsx("div", { className: "text-gray-900", children: /* @__PURE__ */ jsxs("div", { className: "mb-10 flex items-center flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap w-9/12 md:w-10/12 justify-center items-center mb-10 gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-full flex w-[60px] h-[60px] self-end bottom  bg-gray-500 overflow-hidden  z-10 shadow-black/0 shadow-2xl justify-center items-center -mr-7", children: humano.foto ? /* @__PURE__ */ jsx(
          "img",
          {
            alt: "Foto de tu humano",
            src: "/img/portrait-of-a-businesswoman-standing-in-an-office-2023-11-27-05-11-19-utc.png",
            className: " object-cover h-[100%]"
          }
        ) : /* @__PURE__ */ jsxs("p", { className: " uppercase text-2xl text-gray-200 ", children: [
          " ",
          humano.name[0],
          ".",
          " "
        ] }) }),
        peludos.length > 0 && peludos.map((peludo, index) => /* @__PURE__ */ jsx(
          Link,
          {
            style: { zIndex: index + 10 },
            to: `/profile/${peludo.id}`,
            className: " hover:z-40 rounded-full flex w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-gray-500 overflow-hidden mt-4 z-10 shadow-black/50 shadow-2xl -mr-7",
            onClick: changeContext,
            children: /* @__PURE__ */ jsx(
              "img",
              {
                alt: "Foto de tu perrito",
                src: peludo.foto,
                className: " object-cover w-[60px] md:w-[130px]"
              }
            )
          },
          peludo.id
        )),
        /* @__PURE__ */ jsxs(
          Link,
          {
            className: "rounded-full justify-center items-center flex w-[40px] h-[40px] md:w-[40px] md:h-[40px] bg-gray-300 overflow-hidden mt-4 z-10 shadow-black/50 shadow-2xl ml-7",
            to: "/newPeludo",
            onClick: changeContext,
            children: [
              " ",
              /* @__PURE__ */ jsx("p", { className: "text-[40px] -mt-1", children: "+" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "  min-w-60  pt-6 -mt-1 bg-gray-200   p-5 rounded-lg", children: [
        " ",
        /* @__PURE__ */ jsxs("section", { className: "flex flex-col flex-wrap gap-5 justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "first-letter:uppercase text-3xl", children: humano.name }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
              " ",
              humano.email,
              " "
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: " flex flex-col justify-center text-left my-5", children: [
            /* @__PURE__ */ jsx("p", { className: " text-xs text-gray-700", children: " Activo desde" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xl", children: [
              " ",
              new Date(humano.createdAt).toLocaleDateString("es-MX")
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            " ",
            /* @__PURE__ */ jsx("p", { children: " Puntos acumulados " }),
            " ",
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-bold", children: humano.puntos })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 ", children: [
          humano.whatsapp && /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Whatsapp:" }),
            /* @__PURE__ */ jsxs("span", { children: [
              " ",
              humano.whatsapp,
              " "
            ] })
          ] }),
          humano.colonia && /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Colonia: " }),
            " ",
            /* @__PURE__ */ jsxs("span", { className: "first-letter:uppercase", children: [
              " ",
              humano.colonia,
              " "
            ] })
          ] }),
          humano.municipio && /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Municipio:" }),
            /* @__PURE__ */ jsxs("span", { className: "first-letter:uppercase", children: [
              " ",
              humano.municipio,
              " "
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: openModalHandler,
            className: " bg-yellow-400 mt-6 w-20 justify-center flex ",
            children: "Editar"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("section", { className: "flex flex-wrap gap-5 justify-center", children: peludos.length >= 0 && peludos.map((peludo) => /* @__PURE__ */ jsx(
        PeludoOnHuman,
        {
          foto: peludo.foto,
          nombre: peludo.nombre,
          peludoId: peludo.id,
          onClick: changeContext
        },
        peludos.id
      )) }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/newPeludo",
          className: " flex flex-col justify-center items-center mt-10 px-6 py-4",
          onClick: changeContext,
          children: [
            /* @__PURE__ */ jsxs("div", { className: " w-[120px] h-[120px]  bg-gray-400 flex flex-col justify-center items-center ", children: [
              " ",
              /* @__PURE__ */ jsx("p", { className: "text-[100px] -mt-3 ", children: "+" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400 my-3", children: " Agregar Lomito" })
          ]
        }
      )
    ] }) })
  ] });
};
async function loader$b({ request, params }) {
  const humanoId = params.id;
  if (humanoId === "undefined") {
    return redirect$1("/login");
  }
  const humano = await getUser(humanoId);
  const user = await requireUserSession(request);
  const peludos = await getAllPeludosByUser(humanoId);
  try {
    if (user.role !== "ADMIN") {
      if (user.userId !== humanoId) {
        console.log("USERIDACTION");
        return redirect$1(`/humanProfile/${user.userId}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return { humano, peludos, user, humanoId };
}
async function action$i({ request, params }) {
  const humanoId = params.id;
  const user = await getUserFromSession(request);
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);
  await requireUserSession(request);
  try {
    if (user.userId !== humanoId) {
      console.log("USERIDACTION");
      return redirect$1("/");
    }
  } catch (error) {
    console.log(error);
  }
  if (request.method === "PATCH") {
    console.log("editTime");
    await updateUser(humanoId, userData);
    return redirect$1(`/humanProfile/${humanoId}`);
  } else if (request.method === "DELETE") {
    await deleteUser(humanoId);
    return redirect$1("/");
  }
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$i,
  default: HumanProfile,
  loader: loader$b
}, Symbol.toStringTag, { value: "Module" }));
async function newCupon(dataCupon, userId) {
  try {
    console.log("cupon SERVER", dataCupon);
    return await prisma.Cupon.create({
      data: {
        nombre: dataCupon.nombre,
        oferta: dataCupon.oferta,
        categoria: dataCupon.categoria,
        servicio: dataCupon.servicio,
        descripcion: dataCupon.descripcion,
        formulaData: dataCupon.formulaData,
        usuario: { connect: { id: userId || void 0 } },
        visitsRequired: Number(dataCupon.visitsRequired),
        visitsRemaining: Number(dataCupon.visitsRequired),
        activo: dataCupon.activo === "on" ? true : false
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}
async function registerVisit(userId, couponId) {
  const coupon = await prisma.Cupon.findUnique({
    where: { id: couponId }
  });
  console.log("LLAMADO DE REGITRO DE VISITA");
  const newVisitsRemaining = coupon.visitsRemaining - 1;
  return prisma.Cupon.update({
    where: { id: couponId },
    data: {
      visitsRemaining: newVisitsRemaining,
      activo: newVisitsRemaining === 0 ? true : coupon.activo
    }
  });
}
async function getCupones(categoria, peludoId) {
  try {
    const cupones = await prisma.cupon.findMany({
      where: { categoria },
      include: {
        used: {
          where: { peludoId }
        }
      }
    });
    const cuponesActualizados = cupones.filter((cupon) => {
      const usage = cupon.used.find((usage2) => usage2.peludoId === peludoId);
      return !usage || (cupon.visitsRemaining = cupon.visitsRequired - usage.timesUsed);
    });
    const cuponesFiltrados = cuponesActualizados.filter((cupon) => {
      const usage = cupon.used.find((usage2) => usage2.peludoId === peludoId);
      return !usage || usage && usage.timesUsed < cupon.visitsRequired;
    });
    return cuponesFiltrados;
  } catch (error) {
    console.log(error);
  }
}
async function getCuponById(id) {
  try {
    return await prisma.Cupon.findFirst({
      where: { id },
      include: {
        _count: {
          select: { used: true }
        }
      }
    });
  } catch (error) {
    throw new Error("Feiled to get cupon");
  }
}
async function getAllCupons() {
  try {
    return await prisma.Cupon.findMany({
      where: {},
      orderBy: [{ fecha: "asc" }]
    });
  } catch (error) {
    console.log(error);
  }
}
async function updateCupon(id, cuponData) {
  try {
    await prisma.Cupon.update({
      where: { id },
      data: {
        nombre: cuponData.nombre,
        formulaData: cuponData.formulaData,
        descripcion: cuponData.descripcion,
        categoria: cuponData.categoria,
        servicio: cuponData.servicio,
        activo: cuponData.activo ? true : false,
        oferta: cuponData.oferta,
        fecha: cuponData.fecha && new Date(cuponData.fecha),
        visitsRequired: Number(cuponData.visitsRequired)
      }
    });
  } catch (error) {
    console.log(error, "EL ERRROR AL ACTUALIZAR CUPON");
    throw new Error("Failed to update cupon.");
  }
}
async function deleteCupon(id) {
  try {
    await prisma.Cupon.delete({
      where: { id }
    });
  } catch (error) {
    throw new Error("Failed to delete cupon.");
  }
}
let action$h = async ({ request }) => {
  const formData = await request.formData();
  const userId = formData.get("clienteId");
  const couponId = formData.get("couponId");
  console.log("REGISTRAR VISITA", couponId, userId);
  if (!userId || !couponId) {
    return json$1({ error: "Faltan parámetros" }, { status: 400 });
  }
  try {
    await registerVisit(userId, couponId);
    return json$1({ success: true });
  } catch (error) {
    return json$1({ error: error.message }, { status: 500 });
  }
};
let loader$a = () => {
  return json$1({ message: "Método no permitido" }, { status: 405 });
};
function RegistrarVisita() {
  return null;
}
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$h,
  default: RegistrarVisita,
  loader: loader$a
}, Symbol.toStringTag, { value: "Module" }));
async function loader$9({ params }) {
  const { token } = params;
  const user = await prisma.user.findFirst({
    where: { activationToken: token }
  });
  if (!user || user.tokenExpiry < /* @__PURE__ */ new Date()) {
    return json({ error: "Token inválido o expirado" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActive: true,
      activationToken: null,
      tokenExpiry: null
    }
  });
  return redirect("/activationSuccess");
}
function ActivateAccount() {
  const data = useLoaderData();
  if (data.error) {
    return /* @__PURE__ */ jsx("div", { children: data.error });
  }
  return /* @__PURE__ */ jsx("div", { children: "Activando tu cuenta..." });
}
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ActivateAccount,
  loader: loader$9
}, Symbol.toStringTag, { value: "Module" }));
const EditPeludo = () => {
  const navigation = useNavigation();
  const peludo = useLoaderData();
  const [formData, setFormData] = useState({});
  const isSubmitting = navigation.state !== "idle";
  const defaultValues = peludo && {
    nombre: peludo.nombre,
    raza: peludo.raza,
    nacimiento: peludo.nacimiento,
    instagram: peludo.instagram,
    foto: peludo.foto
  };
  async function HandleFileUpload(file) {
    const compressedImage = await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        // Ajusta la calidad de la compresión (0.1 - 1.0)
        maxWidth: 800,
        // Establece el ancho máximo de la imagen
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        }
      });
    });
    let inputFormData = new FormData();
    inputFormData.append("dream-pic", compressedImage);
    const response = await fetch("/images", {
      method: "POST",
      body: inputFormData
    });
    if (typeof document === "undefined") {
      console.log("running in a server environment");
    } else {
      console.log("running in a browser environment");
    }
    console.log("HANDELING", inputFormData.getAll("dream-pic"));
    const { imageUrl } = await response.json();
    console.log("IMAGEURL in HANDLER", imageUrl);
    setFormData({
      ...formData,
      peludoPicture: imageUrl
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: " max-w-[700px]  w-full items-center flex flex-col gap-0", children: [
    /* @__PURE__ */ jsx(
      ImageUploader,
      {
        onChange: HandleFileUpload,
        imageUrl: formData.peludoPicture
      }
    ),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "patch",
        className: " mt-0   w-10/12 flex flex-col gap-3 text-gray-900",
        children: [
          formData.peludoPicture ? /* @__PURE__ */ jsx(
            "input",
            {
              type: "hidden",
              name: "imageUrl",
              id: "imageUrl",
              value: formData.peludoPicture
            }
          ) : /* @__PURE__ */ jsx(
            "input",
            {
              type: "hidden",
              name: "imageUrl",
              id: "imageUrl",
              value: defaultValues.foto
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl w-12/12 flex flex-col gap-3 text-gray-900 bg-gray-800 px-12 py-10", children: [
            /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "nombre", children: "Nombre del peludo" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "h-10 p-4",
                type: "text",
                name: "nombre",
                id: "nombre",
                required: true,
                defaultValue: defaultValues.nombre
              }
            ),
            /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "raza", children: "Raza" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                required: true,
                className: "h-10 p-4",
                type: "text",
                name: "raza",
                id: "raza",
                defaultValue: defaultValues.raza
              }
            ),
            /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "nacimiento", children: "Fecha de nacimiento" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "h-10 p-4",
                type: "date",
                name: "nacimiento",
                id: "nacimiento",
                required: true,
                defaultValue: defaultValues.nacimiento
              }
            ),
            /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "instagram", children: "Instagram" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                required: true,
                className: "h-10 p-4",
                type: "text",
                name: "instagram",
                id: "instagram",
                defaultValue: defaultValues.instagram
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-5 flex-wrap align-baseline mb-20", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "  self-center border-2 border-gray-600 rounded-lg text-lg text-gray-100 text-center py-3  px-5 mt-3 mb-10 ",
                onClick: () => navigate(-1),
                children: "Regresar"
              }
            ),
            /* @__PURE__ */ jsx("button", { className: " rounded-lg self-center flex justify-center items-center text-lg text-gray-100 text-center py-3 px-5 border-spacing-1 border-gray-600 border-2 mt-3 mb-10", children: isSubmitting ? "En ello..." : "Actualizar" })
          ] })
        ]
      }
    )
  ] });
};
async function loader$8({ request, params }) {
  const peludoId = params.id;
  const peludo = await getPeludo(peludoId);
  return peludo;
}
async function action$g({ request, params }) {
  const peludoId = params.id;
  const formData = await request.formData();
  const userData = Object.fromEntries(formData);
  const file = await formData.get("imageUrl");
  if (request.method === "PATCH") {
    console.log("editTime", formData);
    await updatePeludo(peludoId, userData, file);
    return redirect$1(`/profile/${peludoId}`);
  } else if (request.method === "DELETE") {
    await deletePeludo(peludoId);
    return redirect$1("/");
  }
}
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$g,
  default: EditPeludo,
  loader: loader$8
}, Symbol.toStringTag, { value: "Module" }));
async function action$f({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const passwordResetToken = generateToken();
    const tokenExpiry = /* @__PURE__ */ new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1);
    await prisma.user.update({
      where: { email },
      data: {
        passwordResetToken,
        tokenExpiry
      }
    });
    const resetLink = `https://tuapp.com/reset-password/${passwordResetToken}`;
    await sendEmail({
      to: email,
      subject: "Restablece tu contraseña",
      text: `Restablece tu contraseña haciendo clic en el siguiente enlace: ${resetLink}`
    });
  }
  return json({ success: true });
}
function ForgotPassword() {
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Restablecer contraseña" }),
    /* @__PURE__ */ jsxs(Form, { method: "post", children: [
      /* @__PURE__ */ jsxs("label", { children: [
        "Email:",
        /* @__PURE__ */ jsx("input", { type: "email", name: "email", required: true })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "submit", children: "Enviar" })
    ] }),
    (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("p", { children: "Si el email existe, se ha enviado un enlace para restablecer la contraseña." })
  ] });
}
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$f,
  default: ForgotPassword
}, Symbol.toStringTag, { value: "Module" }));
const BusquedaForm = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const [changeValuePromocion, setChangeValuePromocion] = useState("");
  useState("");
  useState(false);
  const handleChangePromocion = (event) => {
    let index = event.target.selectedIndex;
    setChangeValuePromocion(event.target.options[index].value);
  };
  return /* @__PURE__ */ jsxs(
    Form,
    {
      method: "post",
      className: "w-11/12 m-20 flex-col flex gap-5 text-gray-800",
      children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: " p-4 w-full ",
            id: "especie",
            name: "especie",
            required: true,
            onChange: handleChangePromocion,
            value: changeValuePromocion,
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: " Buscar por " }),
              /* @__PURE__ */ jsx("option", { value: "peludo", children: "Peludo " }),
              /* @__PURE__ */ jsx("option", { value: "humano", children: "Humano" })
            ]
          }
        ),
        changeValuePromocion && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "Nombre ", children: [
            /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "nombre", children: [
              " ",
              "Nombre del ",
              changeValuePromocion
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "h-10 p-4 w-full",
                type: "text",
                id: "nombre",
                name: "nombre"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("button", { className: " bg-gray-800 h-[130px] w-[130px] rounded-full self-center flex justify-center items-center text-2xl text-gray-100 text-center  p-4 border-spacing-1 border-gray-600 border-2 mt-10 mb-5", children: isSubmitting ? /* @__PURE__ */ jsx("div", { className: "text-sm", children: "Buscando..." }) : "Buscar" })
        ] })
      ]
    }
  );
};
const BuscarCliente = () => {
  const actionData = useActionData();
  console.log("PELUDeOS", actionData == null ? void 0 : actionData.especie);
  const [especie, setEspecie] = useState(actionData == null ? void 0 : actionData.especie);
  useEffect(() => {
    setEspecie(actionData == null ? void 0 : actionData.especie);
  }, [actionData == null ? void 0 : actionData.especie]);
  return /* @__PURE__ */ jsx("div", { className: "flex content-center justify-center h-screen mt-14", children: /* @__PURE__ */ jsxs("div", { className: "flex  content-center items-center flex-col w-10/12 ", children: [
    /* @__PURE__ */ jsx("p", { children: "Busca por humano o por perro, " }),
    /* @__PURE__ */ jsx(BusquedaForm, {}),
    /* @__PURE__ */ jsxs("section", { className: "text-lg mt-0 mb-5", children: [
      (actionData == null ? void 0 : actionData.especie) === "humano" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { children: [
        (actionData == null ? void 0 : actionData.nombre.length) >= 1 ? /* @__PURE__ */ jsx("div", { className: "text-2xl", children: " Resultados " }) : /* @__PURE__ */ jsx("div", { className: "text-xl", children: " Nombre de Humano no encontrado" }),
        " "
      ] }) }),
      (actionData == null ? void 0 : actionData.especie) === "peludo" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { children: [
        (actionData == null ? void 0 : actionData.nombre.length) >= 1 ? /* @__PURE__ */ jsx("div", { className: "text-2xl", children: " Resultados" }) : /* @__PURE__ */ jsxs("div", { className: "text-xl", children: [
          " ",
          "Nombre de perrito no encontrado",
          " "
        ] }),
        " "
      ] }) })
    ] }),
    (actionData == null ? void 0 : actionData.especie) && /* @__PURE__ */ jsx("div", { className: "flex content-center flex-col flex-wrap gap-3 w-full justify-start pb-52 ", children: (actionData == null ? void 0 : actionData.especie) === "peludo" ? actionData == null ? void 0 : actionData.nombre.map((peludo) => /* @__PURE__ */ jsxs(
      Link,
      {
        className: " bg-gray-900 p-5 hover:bg-gray-800 flex gap-5 items-center",
        to: `/profile/${peludo.id}`,
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              className: "w-10 h-10 rounded-full object-fill",
              src: peludo.foto,
              alt: "dog"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: " first-letter:uppercase", children: peludo.nombre }),
          /* @__PURE__ */ jsx("p", { className: " text-xs font-extralight", children: peludo.raza })
        ]
      },
      peludo.id
    )) : actionData == null ? void 0 : actionData.nombre.map((humano) => /* @__PURE__ */ jsxs(
      Link,
      {
        className: " bg-gray-900 p-5 flex  hover:bg-gray-800 gap-2 items-center",
        to: `/humanProfile/${humano.id}`,
        children: [
          /* @__PURE__ */ jsx("p", { className: " first-letter:uppercase", children: humano.name }),
          /* @__PURE__ */ jsx("p", { className: " text-xs font-extralight", children: humano.email })
        ]
      },
      humano.id
    )) })
  ] }) });
};
async function action$e({ request }) {
  const formData = await request.formData();
  const dataSearch = Object.fromEntries(formData);
  const especie = dataSearch.especie;
  let nombre = {};
  try {
    if (dataSearch.especie === "peludo") {
      nombre = await getPeludoByName(dataSearch.nombre);
      console.log(dataSearch.nombre, nombre);
      console.log(dataSearch.especie, especie);
      return { nombre, especie };
    } else {
      nombre = await getHumanoByName(dataSearch.nombre);
      console.log(dataSearch.nombre);
      return { nombre, especie };
    }
  } catch (error) {
    console.log(error);
  }
}
async function loader$7({ request }) {
  const user = await requireUserSession(request);
  return user;
}
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$e,
  default: BuscarCliente,
  loader: loader$7
}, Symbol.toStringTag, { value: "Module" }));
function CuponForm({ categorias, promociones, cuponData }) {
  const navigate2 = useNavigate();
  const navigation = useNavigation();
  const defaultValues = cuponData ? {
    nombre: cuponData.nombre,
    oferta: cuponData.oferta,
    descripcion: cuponData.descripcion,
    fecha: cuponData.fecha,
    categoria: cuponData.categoria,
    servicio: cuponData.servicio,
    visitsRequired: cuponData.visitsRequired,
    activo: cuponData.activo,
    formulaData: cuponData.formulaData
  } : {
    nombre: "",
    descripcion: "",
    fecha: "",
    categoria: "",
    servicio: "",
    activo: "",
    oferta: "",
    visitsRequired: 1
  };
  (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const validationErrors = useActionData();
  useMatches();
  useParams();
  useRef();
  const [share, setShare] = useState(true);
  const handleShare = (tof) => {
    const trueShare = tof;
    setShare(trueShare);
    navigate2("/");
  };
  const [changeValuePromocion, setChangeValuePromocion] = useState(
    defaultValues.oferta
  );
  const [getFormulaData, setGetFormulaData] = useState("");
  const [dataUno, setDataUno] = useState("");
  const [dataDos, setDataDos] = useState("");
  const [changeValue, setChangeValue] = useState(defaultValues.categoria);
  const handleFormulaData = (event) => {
    let uno = dataUno;
    let dos = dataDos;
    if (event.target.name === "dataUno") {
      uno = event.target.value;
      setDataUno(uno);
    }
    if (event.target.name === "dataDos") {
      dos = event.target.value;
      setDataDos(dos);
    }
    const signo = " X ";
    const formulaData = uno + signo + dos;
    setGetFormulaData(formulaData);
    console.log("EVENT TARGET", formulaData);
  };
  useEffect(() => {
    if (defaultValues.formulaData) {
      if (defaultValues.oferta === "bogo" || defaultValues.oferta === "unoporuno") {
        let d1 = "";
        let d2 = "";
        const formula = defaultValues.formulaData;
        const indeX = formula.indexOf(" X ");
        d1 = formula.slice(0, indeX).trim();
        d2 = formula.slice(indeX + 2, formula.length).trim();
        setDataUno(d1);
        setDataDos(d2);
        console.log("separar formula data", d1, " X ", d2);
      } else {
        console.log("no separar formula data");
      }
    }
  }, [defaultValues.formulaData, defaultValues.oferta, setDataUno, setDataDos]);
  const handleChangePromocion = (event) => {
    let index = event.target.selectedIndex;
    setChangeValuePromocion(event.target.options[index].value);
  };
  const handleChange = (event) => {
    let index = event.target.selectedIndex;
    setChangeValue(event.target.options[index].value);
  };
  console.log("cuponsSSSSSS", cuponData);
  const isSubmitting = navigation.state !== "idle";
  const [activar, setActivar] = useState(cuponData.activo);
  const handleActivar = () => {
    setActivar(!activar);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: cuponData ? "patch" : "post",
        className: "w-11/12 md:min-w-[450px]  flex-col flex gap-5 text-gray-800",
        id: "dream-form",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "form-row flex flex-col gap-2 text-xl", children: [
            /* @__PURE__ */ jsxs("div", { className: "Nombre flex flex-col items-start  gap-3", children: [
              /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "nombre", children: "Nombre" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "h-10 p-4 w-full",
                  type: "text",
                  id: "nombre",
                  name: "nombre",
                  required: true,
                  maxLength: 30,
                  defaultValue: defaultValues.nombre
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "oferta promocion", children: [
              /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "oferta", children: [
                " ",
                "Promoción",
                " "
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: " block appearance-auto w-full rounded-sm  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600  p-4  focus:outline-none focus:bg-white focus:border-gray-500 border border-gray-400 hover:border-gray-200 leading-tight",
                  id: "oferta",
                  name: "oferta",
                  required: true,
                  onChange: handleChangePromocion,
                  value: changeValuePromocion,
                  defaultValue: defaultValues.oferta,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: " Tipo de promoción " }),
                    /* @__PURE__ */ jsx("option", { value: "dinero", children: "Descuento $ " }),
                    /* @__PURE__ */ jsx("option", { value: "unoporuno", children: " # x #" }),
                    /* @__PURE__ */ jsx("option", { value: "bogo", children: " BOGO" }),
                    promociones.map((promocion) => /* @__PURE__ */ jsxs("option", { value: promocion.nombre, children: [
                      " ",
                      promocion.nombre
                    ] }, promocion.id))
                  ]
                }
              ),
              changeValuePromocion && /* @__PURE__ */ jsxs("div", { className: " bg-gray-600 p-3 flex justify-center", children: [
                changeValuePromocion === "Porcentaje" && /* @__PURE__ */ jsxs("div", { className: "flex  items-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-gray-300", children: "Porcentaje a otorgar " }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "h-10 text-center ml-5 mr-1 p-4 w-[130px] my-1",
                      type: "number",
                      max: "100",
                      id: "formulaData",
                      name: "formulaData",
                      defaultValue: defaultValues.formulaData
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { className: "text-gray-300 text-xl", children: "% " })
                ] }),
                changeValuePromocion === "dinero" && /* @__PURE__ */ jsxs("div", { className: "flex  items-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-gray-300", children: "Cantidad de Descuento " }),
                  /* @__PURE__ */ jsx("div", { className: "text-gray-300 text-xl  ml-5 mr-1", children: "$ " }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      className: "h-10 text-center p-4 w-[130px] my-1",
                      type: "number",
                      id: "formulaData",
                      name: "formulaData",
                      defaultValue: defaultValues.formulaData
                    }
                  )
                ] }),
                changeValuePromocion === "unoporuno" && /* @__PURE__ */ jsxs("div", { className: "flex  items-center  ", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-gray-300 mr-5", children: [
                    " ",
                    "¿Cuanto por cuanto?",
                    " "
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "flex items-center",
                      onChange: handleFormulaData,
                      children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            name: "dataUno",
                            className: "h-10 p-4 w-1/3 my-1",
                            type: "number",
                            defaultValue: dataUno
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { className: "text-gray-300 text-xl  ml-5 mr-5", children: [
                          " ",
                          "X",
                          " "
                        ] }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            name: "dataDos",
                            className: "h-10 p-4 w-1/3 my-1",
                            type: "number",
                            defaultValue: dataDos
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      id: "formulaData",
                      name: "formulaData",
                      hidden: true,
                      value: getFormulaData
                    }
                  )
                ] }),
                changeValuePromocion === "bogo" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onChange: handleFormulaData,
                    className: "flex flex-col gap-5 w-full ",
                    children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("div", { className: "text-gray-300", children: "Buy One " }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            name: "dataUno",
                            className: "h-10 p-4 w-full my-1",
                            type: "text",
                            defaultValue: dataUno
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("div", { className: "text-gray-300 mb-0", children: "Get One " }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            name: "dataDos",
                            className: "h-10 p-4 w-full my-1 mt-0",
                            type: "text",
                            defaultValue: dataDos
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            id: "formulaData",
                            name: "formulaData",
                            hidden: true,
                            value: getFormulaData
                          }
                        )
                      ] })
                    ]
                  }
                ) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "Categoria ", children: [
              /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "categoria", children: [
                " ",
                "Categoría",
                " "
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: " p-4 w-full ",
                  id: "categoria",
                  name: "categoria",
                  required: true,
                  onChange: handleChange,
                  value: changeValue,
                  defaultValue: defaultValues.categoria,
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: " Categoría " }),
                    categorias.map((categoria) => /* @__PURE__ */ jsxs("option", { value: categoria.nombre, children: [
                      " ",
                      categoria.nombre
                    ] }, categoria.id))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "etiqueta ", children: [
              /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "servicio", children: [
                " ",
                "Servicio",
                " "
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "servicio",
                  className: "h-10 p-4 w-full",
                  type: "text",
                  name: "servicio",
                  defaultValue: defaultValues.servicio
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "descripcion flex flex-col items-start  gap-3", children: [
              /* @__PURE__ */ jsx("label", { className: "mt-5 text-gray-100", htmlFor: "descripcion", children: "Descripción" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  type: "text",
                  id: "descripcion",
                  name: "descripcion",
                  className: "p-2 h-[30vh] w-full",
                  required: true,
                  defaultValue: defaultValues.descripcion
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex  items-center  ", children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "visitsRequired", className: "text-gray-300 mr-5", children: [
                " ",
                "Visitas Requeridas",
                " "
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "visitsRequired",
                  name: "visitsRequired",
                  className: "h-10 p-4 w-1/3 my-1",
                  min: "1",
                  max: "4",
                  type: "number",
                  defaultValue: defaultValues.visitsRequired,
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "Activar flex align-middle gap-5 ", children: [
              /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "activo", children: [
                " ",
                "Activar",
                " "
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: " tw-5 h-5 ",
                  id: "activo",
                  name: "activo",
                  type: "checkbox",
                  checked: activar,
                  onChange: handleActivar,
                  defaultValue: defaultValues.activo
                }
              )
            ] })
          ] }),
          validationErrors && /* @__PURE__ */ jsx("div", { children: Object.values(validationErrors).map((error) => /* @__PURE__ */ jsx("p", { children: error }, error)) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-wrap text-gray-200 mt-16  mb-2 form-actions flex flex-row gap-5 justify-end ", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/cuponsList", className: "bg-gray-800 w-min p-5 rounded-lg", children: [
              " ",
              "Regresar",
              " "
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "border-gray-300 rounded-lg border bg-darkest p-5 py-3 ",
                onClick: () => handleShare(true),
                disabled: isSubmitting,
                children: isSubmitting ? "Actualizando..." : "Actualizar"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(Form, { method: "delete", children: /* @__PURE__ */ jsx(
      "button",
      {
        className: "border-gray-300 rounded-lg border bg-gray-950 p-5 py-5 ",
        to: "..",
        children: "Borrar"
      }
    ) })
  ] });
}
async function newCategoria(dataCupon, userId) {
  try {
    console.log("cupon SERVER", dataCupon);
    return await prisma.Categoria.create({
      data: {
        nombre: dataCupon.nombre,
        usuario: { connect: { id: userId || void 0 } }
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}
async function getCategorias() {
  try {
    return await prisma.Categoria.findMany({});
  } catch (error) {
    console.log(error);
  }
}
async function newFormula(dataFormula, userId) {
  try {
    console.log("Formula SERVER", dataFormula);
    return await prisma.Formula.create({
      data: {
        nombre: dataFormula.nombre,
        formula: dataFormula.formula,
        usuario: { connect: { id: userId || void 0 } }
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}
async function getFormula() {
  try {
    return await prisma.Formula.findMany({});
  } catch (error) {
    console.log(error);
  }
}
const EditCupon = () => {
  const { cupon, categorias, promociones } = useLoaderData();
  return /* @__PURE__ */ jsx("section", { className: "mt-10 max-w-[700px] flex flex-col justify-center items-center ", children: /* @__PURE__ */ jsxs("div", { className: "mt-10 mb-20 flex flex-col justify-center items-center gap-5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-left uppercase text-xl ", children: "Analítica y edición por cupón." }),
    " ",
    /* @__PURE__ */ jsxs("p", { className: "mb-10", children: [
      "Usado ",
      /* @__PURE__ */ jsx("span", { className: "mx-2 text-lg", children: cupon._count.used }),
      " ",
      cupon._count.used === 1 ? "vez" : "veces",
      " "
    ] }),
    /* @__PURE__ */ jsx(
      CuponForm,
      {
        cuponData: cupon,
        promociones,
        categorias
      }
    )
  ] }) });
};
async function loader$6({ params, request }) {
  const cuponId = await params.id;
  const categorias = await getCategorias();
  const promociones = await getFormula();
  const cupon = await getCuponById(cuponId);
  console.log("CUPON DATA", cupon);
  return { cupon, categorias, promociones };
}
async function action$d({ request, params }) {
  const cuponId = params.id;
  const formData = await request.formData();
  const cuponData = Object.fromEntries(formData);
  if (request.method === "PATCH") {
    console.log("editTime", cuponData);
    await updateCupon(cuponId, cuponData);
    return redirect$1(`/editCupon/${cuponId}`);
  } else if (request.method === "DELETE") {
    await deleteCupon(cuponId);
    return redirect$1("/cuponsList");
  }
}
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$d,
  default: EditCupon,
  loader: loader$6
}, Symbol.toStringTag, { value: "Module" }));
const CategoriaForm = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  return /* @__PURE__ */ jsxs(
    Form,
    {
      method: "post",
      className: "w-11/12 md:w-2/5 m-20 flex-col flex gap-5 text-gray-800",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "Nombre ", children: [
          /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "nombre", children: [
            " ",
            "Nombre",
            " "
          ] }),
          /* @__PURE__ */ jsx("input", { className: "h-10 p-4 w-full", type: "text", name: "nombre" })
        ] }),
        /* @__PURE__ */ jsx("button", { className: " bg-gray-800 h-[130px] w-[130px] rounded-full self-center flex justify-center items-center text-xl text-gray-100 text-center  p-4 border-spacing-1 border-gray-400 border-2 mt-10 mb-20", children: isSubmitting ? "En ello..." : "Crear Categoría" })
      ]
    }
  );
};
const CreateCategoria$1 = () => {
  return /* @__PURE__ */ jsxs("main", { className: "w-full items-center flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx(CategoriaForm, {}),
    /* @__PURE__ */ jsx("div", { className: "w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsx(
      "a",
      {
        className: " bg-gray-800 w-[150px] self-center text-2xl text-gray-100 text-center p-3 mt-10 mb-20 ",
        href: "/",
        children: "Regresar"
      }
    ) })
  ] });
};
async function action$c({ request }) {
  const userId = await requireUserSession(request);
  console.log(userId.userId, "by REQUEST");
  const formData = await request.formData();
  const dataCategoria = Object.fromEntries(formData);
  try {
    await newCategoria(dataCategoria, userId.userId);
    console.log("action processed", dataCategoria.nombre);
    return redirect$1("/");
  } catch (error) {
    console.log(error);
    if (error.status === 422) {
      return { dataCategoria: error.message };
    } else {
      return { dataCategoria: error.message };
    }
  }
}
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$c,
  default: CreateCategoria$1
}, Symbol.toStringTag, { value: "Module" }));
const CuponesId = () => {
  const [estado, setEstado] = useState(true);
  const navigate2 = useNavigate();
  function closeHandler() {
    setEstado(!estado);
    navigate2("..");
  }
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Modal, { estado, onClose: closeHandler, children: /* @__PURE__ */ jsx(CuponForm, {}) }) });
};
async function action$b({ params, request }) {
  const cuponId = params.id;
  console.log("---PARAMS---", cuponId);
  if (request.method === "PATCH") {
    const formData = await request.formData();
    const cuponData = Object.fromEntries(formData);
    console.log(cuponData);
    await updateCupon(cuponId, cuponData);
    return redirect$1("/cupons");
  } else if (request.method === "DELETE") {
    await deleteCupon(cuponId);
    return redirect$1("/cupons");
  }
  return null;
}
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$b,
  default: CuponesId
}, Symbol.toStringTag, { value: "Module" }));
async function newEtiqueta(dataCupon, userId) {
  try {
    console.log("cupon SERVER", dataCupon);
    return await prisma.Etiqueta.create({
      data: {
        nombre: dataCupon.nombre,
        usuario: { connect: { id: userId || void 0 } }
      }
    });
  } catch (error) {
    throw new Error(error);
  }
}
const EtiquetaForm = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  return /* @__PURE__ */ jsxs(
    Form,
    {
      method: "post",
      className: "w-11/12 md:w-2/5 m-20 flex-col flex gap-5 text-gray-800",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "Nombre ", children: [
          /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "nombre", children: [
            " ",
            "Nombre",
            " "
          ] }),
          /* @__PURE__ */ jsx("input", { className: "h-10 p-4 w-full", type: "text", name: "nombre" })
        ] }),
        /* @__PURE__ */ jsx("button", { className: " bg-gray-800 h-[130px] w-[130px] rounded-full self-center flex justify-center items-center text-2xl text-gray-100 text-center  p-4 border-spacing-1 border-gray-400 border-2 mt-10 mb-20", children: isSubmitting ? "En ello..." : "Crear Etiqueta" })
      ]
    }
  );
};
const CreateEtiqueta = () => {
  const navigate2 = useNavigate();
  return /* @__PURE__ */ jsxs("main", { className: "w-full items-center flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx(EtiquetaForm, {}),
    /* @__PURE__ */ jsx("div", { className: "w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsx(
      "button",
      {
        className: " bg-gray-800 w-[150px] self-center text-2xl text-gray-100 text-center p-3 mt-10 mb-20 ",
        onClick: () => navigate2(-1),
        children: "Regresar"
      }
    ) })
  ] });
};
async function action$a({ request }) {
  const userId = await requireUserSession(request);
  console.log(userId.userId, "by REQUEST");
  const formData = await request.formData();
  const dataEtiqueta = Object.fromEntries(formData);
  try {
    await newEtiqueta(dataEtiqueta, userId.userId);
    console.log("action processed", dataEtiqueta.nombre);
    return redirect$1("/");
  } catch (error) {
    console.log(error);
    if (error.status === 422) {
      return { dataEtiqueta: error.message };
    } else {
      return { dataEtiqueta: error.message };
    }
  }
}
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$a,
  default: CreateEtiqueta
}, Symbol.toStringTag, { value: "Module" }));
const Carrusel = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const length = images.length;
  const timeoutRef = useRef(null);
  const startX = useRef(0);
  const endX = useRef(0);
  useEffect(() => {
    const nextSlide2 = () => {
      setCurrent((current2) => current2 === length - 1 ? 0 : current2 + 1);
    };
    timeoutRef.current = setTimeout(nextSlide2, 5e3);
    return function() {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [current, length]);
  useEffect(() => {
    if (document.querySelector(".carousel-slide.active")) {
      gsap.fromTo(
        ".carousel-slide.active ",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }
  }, [current]);
  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };
  const handleTouchStart = (e) => {
    console.log("Touch Start:", e.touches[0].clientX);
    startX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    console.log("Touch Move:", e.touches[0].clientX);
    endX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    console.log("Touch End:", startX.current, endX.current);
    if (startX.current - endX.current > 100) {
      console.log("Swiped left");
      nextSlide();
    } else if (endX.current - startX.current > 100) {
      console.log("Swiped right");
      prevSlide();
    }
  };
  if (!Array.isArray(images) || images.length <= 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "shadow-2xl shadow-black/50 carousel w-full mt-10 flex justify-center h-96 bg-gray-950",
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      children: [
        /* @__PURE__ */ jsx("button", { className: "left-arrow ", onClick: prevSlide, children: "❮" }),
        /* @__PURE__ */ jsx("button", { className: "right-arrow", onClick: nextSlide, children: "❯" }),
        /* @__PURE__ */ jsx("div", { className: "carousel-wrapper  w-full rounded-xl overflow-hidden", children: images.map((image, index) => /* @__PURE__ */ jsx(
          "div",
          {
            className: index === current ? "carousel-slide active w-full" : "carousel-slide",
            children: index === current && /* @__PURE__ */ jsx(
              "img",
              {
                src: image.url,
                alt: "peludo",
                className: "carousel-image object-cover max-h-96 z-10 shadow-2xl shadow-black/50 h-full w-full rounded-xl "
              }
            )
          },
          index
        )) })
      ]
    }
  );
};
async function upsertUsed(cuponId, peludoId) {
  try {
    await prisma.Used.upsert({
      where: {
        peludoId_cuponId: {
          peludoId,
          cuponId
        }
      },
      update: {
        timesUsed: { increment: 1 }
        // Incrementar timesUsed en 1 si el registro ya existe
      },
      create: {
        cupon: { connect: { id: cuponId } },
        peludo: { connect: { id: peludoId } },
        timesUsed: 1
        // Establecer timesUsed en 1 si el registro no existe
      }
    });
    console.log("Cupón creado o actualizado correctamente");
  } catch (error) {
    console.error("Error al actualizar el uso del cupón:", error);
  }
}
const Profile = () => {
  var _a, _b, _c, _d, _e, _f;
  const {
    cuponesEstetica,
    cuponesGuarderia,
    cuponesHotel,
    cuponesAmigos,
    cuponesDinamicas,
    cuponesEspeciales,
    peludo,
    user
  } = useLoaderData();
  const navigate2 = useNavigate();
  useOutletContext();
  useState(false);
  useFetcher();
  const actionClose = useActionData();
  const url = UrlCreator(peludo.id);
  const [estado, setEstado] = useState(false);
  const [modalData, setModalData] = useState({
    nombre: "nombre",
    formula: "formula",
    descripcion: "descripcion",
    cuponId: "id"
  });
  const [adminButtons, setAdminButtons] = useState(true);
  useEffect(() => {
    if (user.role !== "ADMIN") {
      setAdminButtons(false);
    }
  }, [user]);
  useEffect(() => {
    if (actionClose) {
      setEstado(false);
    }
  }, [actionClose]);
  function closeHandler() {
    setEstado(false);
  }
  function submitHandler() {
    setEstado(false);
  }
  function openCuponHandler(nombre, descripcion, cuponId, cuponVacio) {
    setEstado(true);
    const describe = descripcion;
    setModalData({ nombre, descripcion, cuponId, cuponVacio });
    console.log(describe, "modalDATa", cuponId);
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-[720px]", children: [
    /* @__PURE__ */ jsx(Modal, { estado, onClose: closeHandler, children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 flex flex-col justify-center items-center p-3 rounded-2xl w-full md:w-1/2", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl p-5  w-[98%] bg-gray-300 ", children: [
        modalData.cuponVacio && /* @__PURE__ */ jsxs("div", { children: [
          " ",
          modalData.cuponVacio,
          " mas para activar el cupon"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xl", children: modalData.nombre }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
          " ",
          modalData == null ? void 0 : modalData.descripcion,
          " "
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex mt-5 justify-evenly w-full", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: closeHandler,
            className: " hover:border-yellow-400 border-2 border-gray-100 hover:bg-gray-500 bg-[#F9AC19] p-2 px-5 rounded-xl",
            children: adminButtons ? /* @__PURE__ */ jsx(Fragment, { children: "CANCELAR" }) : /* @__PURE__ */ jsx(Fragment, { children: "CERRAR" })
          }
        ),
        adminButtons && (modalData.cuponVacio ? /* @__PURE__ */ jsxs(Form, { method: "post", onSubmit: submitHandler, children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "peludoId", value: peludo.id }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "hidden",
              name: "cuponId",
              value: modalData.cuponId
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: " border-yellow-400 border-2 p-2 px-5 hover:bg-yellow-400 rounded-lg",
              children: "Registrar"
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Form, { method: "post", onSubmit: submitHandler, children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "peludoId", value: peludo.id }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "hidden",
              name: "cuponId",
              value: modalData.cuponId
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: " border-yellow-400 border-2 p-2 px-5 hover:bg-yellow-400 rounded-lg",
              children: "USAR"
            }
          )
        ] }))
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "text-gray-900 mt-10 ", children: /* @__PURE__ */ jsxs("div", { className: "mb-10  flex items-center flex-col", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "text-gray-300 border-2 border-gray-500 px-5 py-3 rounded-md",
          onClick: () => navigate2(-1),
          children: "Volver"
        }
      ),
      /* @__PURE__ */ jsx(Carrusel, { images: peludo.fotos }),
      console.log("TODAS LAS FOTOS", peludo.fotos),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 -mt-1 bg-gray-200 w-10/12  py-3 pl-4 pr-2 rounded-b-lg", children: [
        " ",
        /* @__PURE__ */ jsx("p", { className: "text-center leading-none text-3xl font-thin -mt-4", children: "^" }),
        /* @__PURE__ */ jsx("p", { className: " first-letter:uppercase text-3xl", children: peludo.nombre }),
        /* @__PURE__ */ jsxs("p", { className: "first-letter:uppercase", children: [
          " ",
          peludo.raza,
          " "
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "  my-5", children: [
          /* @__PURE__ */ jsx("p", { className: " text-xs text-gray-700", children: " Activo desde" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl", children: [
            " ",
            peludo.nacimiento,
            " "
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "my-5", children: [
          /* @__PURE__ */ jsx("p", { className: " text-xs text-gray-700", children: " Amigos" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl", children: " 10" })
        ] }),
        peludo.instagram && /* @__PURE__ */ jsxs("div", { className: "my-5", children: [
          /* @__PURE__ */ jsx("p", { className: " text-xs text-gray-700", children: " instagram" }),
          /* @__PURE__ */ jsxs("p", { className: " text-xl text-gray-700", children: [
            " ",
            peludo.instagram,
            " "
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: " -mt-16 flex items-end justify-between", children: [
          user.role === "ADMIN" ? /* @__PURE__ */ jsxs(
            Link,
            {
              className: " px-3 py-2 rounded-xl bg-[#F9AC19] text-sm",
              to: `/editPeludo/${peludo.id}`,
              children: [
                " ",
                "EDITAR",
                " "
              ]
            }
          ) : /* @__PURE__ */ jsxs(
            Link,
            {
              className: " px-3 py-2 rounded-xl bg-[#F9AC19] text-sm",
              href: "/invitar",
              children: [
                " ",
                "Invitar Amigos",
                " "
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            QRCode,
            {
              size: "120",
              removeQrCodeBehindLogo: "true",
              logoImage: "/logo/lo-vert-JustLikeHome-small-black.png",
              logoWidth: "30",
              logoHeight: "23",
              bgColor: "#ffffff",
              ecLevel: "H",
              value: url,
              qrStyle: "dots",
              logoPadding: "5",
              eyeRadius: [
                [5, 5, 5, 5],
                // top/left eye
                [5, 5, 5, 5],
                // top/right eye
                [5, 5, 5, 5]
                // bottom/left
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col mb-20", children: [
      cuponesEspeciales.length > 0 && /* @__PURE__ */ jsx(
        Seccion,
        {
          user,
          promociones: cuponesEspeciales.map((cupon) => cupon.nombre),
          descripcion: cuponesEspeciales.map((cupon) => cupon.descripcion),
          formula: cuponesEspeciales.map((cupon) => cupon.formula),
          cuponId: cuponesEspeciales.map((cupon) => cupon.id),
          titulo: (_a = cuponesEspeciales[0]) == null ? void 0 : _a.categoria,
          onClick: openCuponHandler,
          visitsRemaining: cuponesEspeciales.map(
            (cupon) => cupon.visitsRequired
          )
        }
      ),
      cuponesEstetica.length > 0 && /* @__PURE__ */ jsx(
        Seccion,
        {
          user,
          promociones: cuponesEstetica.map((cupon) => cupon.nombre),
          descripcion: cuponesEstetica.map((cupon) => cupon.descripcion),
          formula: cuponesEstetica.map((cupon) => cupon.formula),
          cuponId: cuponesEstetica.map((cupon) => cupon.id),
          titulo: (_b = cuponesEstetica[0]) == null ? void 0 : _b.categoria,
          onClick: openCuponHandler,
          visitsRemaining: cuponesEstetica.map((cupon) => cupon.visitsRequired)
        }
      ),
      cuponesGuarderia.length > 0 && /* @__PURE__ */ jsx(
        Seccion,
        {
          user,
          promociones: cuponesGuarderia.map((cupon) => cupon.nombre),
          descripcion: cuponesGuarderia.map((cupon) => cupon.descripcion),
          cuponId: cuponesGuarderia.map((cupon) => cupon.id),
          titulo: (_c = cuponesGuarderia[0]) == null ? void 0 : _c.categoria,
          visitsRemaining: cuponesGuarderia.map(
            (cupon) => cupon.visitsRequired
          ),
          onClick: openCuponHandler
        }
      ),
      cuponesHotel.length > 0 && /* @__PURE__ */ jsx(
        Seccion,
        {
          user,
          promociones: cuponesHotel.map((nombre) => nombre.nombre),
          descripcion: cuponesHotel.map((cupon) => cupon.descripcion),
          cuponId: cuponesHotel.map((cupon) => cupon.id),
          titulo: (_d = cuponesHotel[0]) == null ? void 0 : _d.categoria,
          visitsRemaining: cuponesHotel.map((cupon) => cupon.visitsRequired),
          onClick: openCuponHandler
        }
      ),
      cuponesAmigos.length > 0 && /* @__PURE__ */ jsx(
        Seccion,
        {
          user,
          promociones: cuponesAmigos.map((nombre) => nombre.nombre),
          descripcion: cuponesAmigos.map((cupon) => cupon.descripcion),
          cuponId: cuponesAmigos.map((cupon) => cupon.id),
          titulo: (_e = cuponesAmigos[0]) == null ? void 0 : _e.categoria,
          onClick: openCuponHandler,
          visitsRemaining: cuponesAmigos.map((cupon) => cupon.visitsRequired)
        }
      ),
      cuponesDinamicas.length > 0 && /* @__PURE__ */ jsx(
        Seccion,
        {
          user,
          promociones: cuponesDinamicas.map((nombre) => nombre.nombre),
          descripcion: cuponesDinamicas.map((cupon) => cupon.descripcion),
          cuponId: cuponesDinamicas.map((cupon) => cupon.id),
          titulo: (_f = cuponesDinamicas[0]) == null ? void 0 : _f.categoria,
          onClick: openCuponHandler,
          visitsRemaining: cuponesDinamicas.map(
            (cupon) => cupon.visitsRrequired
          )
        }
      )
    ] })
  ] });
};
async function loader$5({ params, request }) {
  const peludoId = params.id;
  const user = await getUserFromSession(request);
  const cuponesEstetica = await getCupones("Estética", peludoId);
  const cuponesGuarderia = await getCupones("Guardería", peludoId);
  const cuponesHotel = await getCupones("Hotel", peludoId);
  const cuponesAmigos = await getCupones("Amigos", peludoId);
  const cuponesDinamicas = await getCupones("Dinámicas", peludoId);
  const cuponesEspeciales = await getCupones("Especiales", peludoId);
  const peludo = await getPeludo(peludoId);
  console.log(cuponesGuarderia, "CUPONESGUARDERIA");
  return {
    cuponesEstetica,
    cuponesGuarderia,
    cuponesHotel,
    cuponesAmigos,
    cuponesDinamicas,
    cuponesEspeciales,
    peludo,
    user
  };
}
async function action$9({ request }) {
  const formData = await request.formData();
  getUserFromSession(request);
  const cuponData = Object.fromEntries(formData);
  const cuponId = cuponData.cuponId;
  const peludoId = cuponData.peludoId;
  console.log("CUPON ID", cuponId);
  console.log("PELUDO ID", peludoId);
  if (cuponId) {
    await updatePuntos(peludoId, 10);
    await upsertUsed(cuponId, peludoId);
    return true;
  }
  return true;
}
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$9,
  default: Profile,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const ListCupons = ({ cupons }) => {
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-5 justify-center mb-20 flex-wrap", children: Object.keys(cupons).length > 0 && Object.keys(cupons).map((categoria) => /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex flex-col gap-5 justify-center mb-10 flex-wrap",
      children: [
        /* @__PURE__ */ jsx("h2", { children: categoria }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-5 justify-center mb-10 flex-wrap", children: cupons[categoria].map((cupon) => /* @__PURE__ */ jsx(
          Link,
          {
            to: `/editCupon/${cupon.id}`,
            className: "flex  flex-col mb-10 bg-gray-800 hover:bg-gray-600 w-[150px] rounded-lg text-center p-5 justify-center items-center",
            children: cupon.nombre
          },
          cupon.id
        )) })
      ]
    },
    categoria
  )) });
};
const CuponsList = () => {
  const totalCupon = useLoaderData();
  console.log("STATS", totalCupon);
  const groupedCupones = totalCupon.reduce((acc, cupon) => {
    if (!acc[cupon.categoria]) {
      acc[cupon.categoria] = [];
    }
    acc[cupon.categoria].push(cupon);
    return acc;
  }, {});
  return /* @__PURE__ */ jsx("div", { className: "mt-10 w-full flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "w-10/12", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-lg mb-5", children: "Todos los Cupones" }),
    /* @__PURE__ */ jsx(ListCupons, { cupons: groupedCupones })
  ] }) });
};
async function loader$4() {
  const cuponsList = await getAllCupons();
  return cuponsList;
}
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CuponsList,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const FormulaForm = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  return /* @__PURE__ */ jsx("div", { className: "  w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsxs(
    Form,
    {
      method: "post",
      className: " mt-20  w-10/12 flex flex-col gap-3 text-gray-900",
      children: [
        /* @__PURE__ */ jsxs("div", { className: " w-12/12 flex flex-col gap-3 text-gray-900 bg-gray-600 p-3", children: [
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "nombre", children: "Nombre de la Fórmula" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "h-10 p-4",
              type: "text",
              name: "nombre",
              id: "nombre",
              autoComplete: true
            }
          ),
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "formula", children: "Fórmula" }),
          /* @__PURE__ */ jsx("input", { className: "h-10 p-4", type: "text", name: "formula", id: "formula" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-5 flex-wrap align-baseline", children: /* @__PURE__ */ jsx("button", { className: " bg-gray-800 h-[130px] w-[130px] rounded-full self-center flex justify-center items-center text-xl text-gray-100 text-center  p-4 border-spacing-1 border-gray-400 border-2 mt-10 mb-20", children: isSubmitting ? "En ello..." : "Crear Fórmula" }) })
      ]
    }
  ) });
};
const CreateCategoria = () => {
  return /* @__PURE__ */ jsxs("main", { className: "w-full items-center flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx(FormulaForm, {}),
    /* @__PURE__ */ jsx("div", { className: "w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsx(
      "a",
      {
        className: " bg-gray-800 w-[150px] self-center text-2xl text-gray-100 text-center p-3 mt-10 mb-20 ",
        href: "/",
        children: "Regresar"
      }
    ) })
  ] });
};
async function action$8({ request }) {
  const userId = await requireUserSession(request);
  console.log(userId.userId, "by REQUEST");
  const formData = await request.formData();
  const dataCategoria = Object.fromEntries(formData);
  try {
    await newFormula(dataCategoria, userId.userId);
    console.log("action processed", dataCategoria);
    return redirect$1("/");
  } catch (error) {
    console.log(error);
    if (error.status === 422) {
      return { dataCategoria: error.message };
    } else {
      return { dataCategoria: error.message };
    }
  }
}
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$8,
  default: CreateCategoria
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = () => {
  return [
    { title: "Programa de Lealtad Just Like Home" },
    { name: "description", content: "Programa de lealtad" }
  ];
};
function HomeAdmin() {
  const navigate2 = useNavigate$1();
  useActionData$1();
  const user = useLoaderData$1();
  useEffect(() => {
    if ((user == null ? void 0 : user.role) !== "ADMIN") {
      {
        navigate2(`/`);
      }
    }
  }, [user, navigate2]);
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("div", { className: " animate-buscador flex items-center flex-col content-center justify-center h-screen bg-gray-950 mt-10  ", children: /* @__PURE__ */ jsx(Intro, { user: user == null ? void 0 : user.userName }) }) });
}
async function action$7({ request }) {
  const { userId } = await getUserFromSession(request);
  try {
    if ((userId == null ? void 0 : userId.role) !== "ADMIN") {
      console.log("NOESADMIN", userId == null ? void 0 : userId.role);
      return redirect$2("/");
    }
  } catch (error) {
    console.log("ERROR ERRRRRROR", error);
  }
  console.log("FROM ACTION", userId.userId);
  return userId;
}
async function loader$3({ request }) {
  const user = await getUserFromSession(request);
  return user;
}
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$7,
  default: HomeAdmin,
  loader: loader$3,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const CreatePeludo = () => {
  const navigate2 = useNavigate();
  const { clienteId } = useOutletContext();
  console.log("DESDE NEW PELUDO", clienteId);
  const [formData, setFormData] = useState({});
  async function handleFileUpload(file) {
    const compressedImage = await new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: 0.6,
        // Ajusta la calidad de la compresión (0.1 - 1.0)
        maxWidth: 800,
        // Establece el ancho máximo de la imagen
        success(result) {
          resolve(result);
        },
        error(err) {
          reject(err);
        }
      });
    });
    let inputFormData = new FormData();
    inputFormData.append("dream-pic", compressedImage);
    const response = await fetch("/images", {
      method: "POST",
      body: inputFormData
    });
    if (typeof document === "undefined") {
      console.log("running in a server environment");
    } else {
      console.log("running in a browser environment");
    }
    console.log("HANDELING", inputFormData.getAll("dream-pic"));
    const { imageUrl } = await response.json();
    console.log("IMAGEURL", imageUrl);
    setFormData({
      ...formData,
      peludoPicture: imageUrl
    });
  }
  return /* @__PURE__ */ jsxs("div", { className: "  w-full items-center flex flex-col gap-5", children: [
    /* @__PURE__ */ jsx(
      ImageUploader,
      {
        onChange: handleFileUpload,
        imageUrl: formData.peludoPicture
      }
    ),
    /* @__PURE__ */ jsx(PeludoForm, { imageUrl: formData.peludoPicture, usuarioId: clienteId }),
    /* @__PURE__ */ jsx("div", { className: "w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsx(
      "button",
      {
        className: "  self-center border-2 border-gray-600 rounded-lg text-lg text-gray-100 text-center py-3  px-5 mt-3 mb-20 ",
        onClick: () => navigate2(-1),
        children: "Regresar"
      }
    ) })
  ] });
};
async function action$6({ request }) {
  const userId = await requireUserSession(request);
  console.log(userId.userId, "by REQUEST");
  const formData = await request.formData();
  const dataPeludo = Object.fromEntries(formData);
  console.log("DATA PELUDO", dataPeludo);
  const file = await formData.get("imageUrl");
  const deHumano = dataPeludo.usuarioId.length > 8 ? dataPeludo.usuarioId : userId.userId;
  try {
    await newPeludo(dataPeludo, deHumano, file);
    console.log("action processed", dataPeludo.nombre);
    return redirect$1("/");
  } catch (error) {
    console.log(error);
    if (error.status === 422) {
      return { dataPeludo: error.message };
    } else {
      return { dataPeludo: error.message };
    }
  }
}
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$6,
  default: CreatePeludo
}, Symbol.toStringTag, { value: "Module" }));
const ImgPeludoCard = ({ foto, role }) => {
  gsap$1.registerPlugin(useGSAP, ScrollTrigger);
  const imageRef = useRef();
  useGSAP(
    () => {
      gsap$1.to(imageRef.current, {
        scale: 1.151,
        // rotation: 10,
        y: 0,
        ease: "expo.out",
        // duration: 3,
        scrollTrigger: {
          trigger: imageRef.current,
          start: "clamp(center center)",
          end: "clamp(200px  50%)",
          // markers: true,
          toggleActions: "restart pause reverse pause",
          scrub: true
        }
      });
    },
    { scope: imageRef }
  );
  return /* @__PURE__ */ jsx(Fragment, { children: role === "ADMIN" ? /* @__PURE__ */ jsx(
    "img",
    {
      ref: imageRef,
      alt: "Foto de tu perrito",
      src: foto,
      className: " object-cover rounded-full  flex w-[100px] h-[100px] md:w-[130px] md:h-[130px] bg-gray-500 overflow-hidden self-center -mt-12 scroll-mx-32 z-10 shadow-black/50 shadow-2xl "
    }
  ) : /* @__PURE__ */ jsx(
    "img",
    {
      ref: imageRef,
      alt: "Foto de tu perrito",
      src: foto,
      className: " object-none  rounded-full  flex w-[100px] h-[100px] md:w-[130px] md:h-[130px] bg-gray-500 overflow-hidden self-center -mt-12 scroll-mx-32 z-10 shadow-black/50 shadow-2xl "
    }
  ) });
};
const PeludoCard = ({
  id,
  nombre,
  raza,
  instagram,
  foto,
  adminButtons,
  role
}) => {
  gsap$1.registerPlugin(useGSAP, ScrollTrigger);
  useRef();
  useRef();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "flex flex-col gap-2 first-letter:uppercase  min-w-36 bg-[#101622]   pb-5 px-3 mb-14 rounded-lg  justify-center text-center items-center",
      children: [
        adminButtons ? /* @__PURE__ */ jsx(Link, { to: `/profile/${id}`, children: /* @__PURE__ */ jsx(ImgPeludoCard, { role, foto }) }) : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("a", { href: `https://www.instagram.com/${instagram}`, children: /* @__PURE__ */ jsx(ImgPeludoCard, { foto }) }) }),
        /* @__PURE__ */ jsx("div", { className: "text-lg ", children: nombre }),
        /* @__PURE__ */ jsx("div", { className: "text-xs font-thin   ", children: raza }),
        instagram && /* @__PURE__ */ jsxs("button", { className: "text-sm", children: [
          "@",
          instagram.slice(0, 8),
          "... "
        ] })
      ]
    }
  );
};
const Explorar = () => {
  const { user, allPeludos } = useLoaderData();
  const [adminButtons, setAdminButtons] = useState(true);
  useEffect(() => {
    if (user.role !== "ADMIN") {
      setAdminButtons(false);
    }
  }, [user]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "w-10/12 md:w-8/12 ", children: [
      /* @__PURE__ */ jsx("p", { className: "mt-32 text-left text-3xl font-extralight ", children: "Conoce a los compañeros de tu peludo, ¡hay que seguirnos entre todos!" }),
      /* @__PURE__ */ jsx("p", { children: "Solo los peludos que compartieron sus perfiles de Instagram abiertamente están en esta lista." }),
      /* @__PURE__ */ jsxs(Link, { className: " underline", to: "/aviso_de_privacidad", children: [
        " ",
        "Mira el aviso de privacidad",
        " "
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-28  pb-24 flex flex-col justify-center items-center content-center w-full", children: /* @__PURE__ */ jsx("section", { className: "pt-5 w-10/12 flex gap-y-16 gap-x-3 gap flex-wrap  justify-center max-w-[750px] ", children: allPeludos && allPeludos.map(
      (peludo) => peludo.instagram && /* @__PURE__ */ jsx(
        PeludoCard,
        {
          id: peludo.id,
          nombre: peludo.nombre,
          raza: peludo.raza,
          foto: peludo.foto,
          instagram: peludo.instagram,
          adminButtons,
          role: user.role
        },
        peludo.id
      )
    ) }) })
  ] });
};
async function loader$2({ request }) {
  const allPeludos = await getAllPeludos();
  const user = await requireUserSession(request);
  return { allPeludos, user };
}
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Explorar,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const notFound = () => {
  return /* @__PURE__ */ jsx("div", { className: "mt-12", children: /* @__PURE__ */ jsx("h1", { className: "text-4xl", children: "404 Not Found" }) });
};
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: notFound
}, Symbol.toStringTag, { value: "Module" }));
const CuponesForm = ({ categorias, promociones }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  const [changeValuePromocion, setChangeValuePromocion] = useState("");
  const [changeValue, setChangeValue] = useState("");
  const [activar, setActivar] = useState(false);
  const handleChangePromocion = (event) => {
    let index = event.target.selectedIndex;
    setChangeValuePromocion(event.target.options[index].value);
  };
  const handleChange = (event) => {
    let index = event.target.selectedIndex;
    setChangeValue(event.target.options[index].value);
  };
  const handleActivar = () => {
    setActivar(!activar);
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs(
    Form,
    {
      method: "post",
      className: "w-11/12 md:w-2/5  flex-col flex gap-5 text-gray-800",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "Nombre ", children: [
          /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "nombre", children: [
            " ",
            "Nombre",
            " "
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "h-10 p-4 w-full",
              type: "text",
              name: "nombre",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "Promocion ", children: [
          /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "promocion", children: [
            " ",
            "Promoción",
            " "
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: " block appearance-auto w-full rounded-sm  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-600  p-4  focus:outline-none focus:bg-white focus:border-gray-500 border border-gray-400 hover:border-gray-200 leading-tight",
              id: "oferta",
              name: "oferta",
              required: true,
              onChange: handleChangePromocion,
              value: changeValuePromocion,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: " Tipo de promoción " }),
                /* @__PURE__ */ jsx("option", { value: "dinero", children: "Descuento $ " }),
                /* @__PURE__ */ jsx("option", { value: "unoporuno", children: " # x #" }),
                /* @__PURE__ */ jsx("option", { value: "bogo", children: " BOGO" }),
                promociones.map((promocion) => /* @__PURE__ */ jsxs("option", { value: promocion.nombre, children: [
                  " ",
                  promocion.nombre
                ] }, promocion.id))
              ]
            }
          ),
          changeValuePromocion && /* @__PURE__ */ jsxs("div", { className: " bg-gray-600 p-3 flex justify-center", children: [
            changeValuePromocion === "Porcentaje" && /* @__PURE__ */ jsxs("div", { className: "flex  items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-gray-300", children: "Porcentaje a otorgar " }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "h-10 text-center ml-5 mr-1 p-4 w-[130px] my-1",
                  type: "number",
                  max: "100"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "text-gray-300 text-xl", children: "% " })
            ] }),
            changeValuePromocion === "dinero" && /* @__PURE__ */ jsxs("div", { className: "flex  items-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-gray-300", children: "Cantidad de Descuento " }),
              /* @__PURE__ */ jsx("div", { className: "text-gray-300 text-xl  ml-5 mr-1", children: "$ " }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  className: "h-10 text-center p-4 w-[130px] my-1",
                  type: "number"
                }
              )
            ] }),
            changeValuePromocion === "unoporuno" && /* @__PURE__ */ jsxs("div", { className: "flex  items-center  ", children: [
              /* @__PURE__ */ jsx("div", { className: "text-gray-300 mr-5", children: " Cuanto por cuanto " }),
              /* @__PURE__ */ jsx("input", { className: "h-10 p-4 w-1/3 my-1", type: "text" }),
              /* @__PURE__ */ jsx("div", { className: "text-gray-300 text-xl  ml-5 mr-5", children: " X " }),
              /* @__PURE__ */ jsx("input", { className: "h-10 p-4 w-1/3 my-1", type: "text" })
            ] }),
            changeValuePromocion === "bogo" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-5 w-full ", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-gray-300", children: "Buy One " }),
                /* @__PURE__ */ jsx("input", { className: "h-10 p-4 w-full my-1", type: "text" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-gray-300 mb-0", children: "Get One " }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    className: "h-10 p-4 w-full my-1 mt-0",
                    type: "text"
                  }
                )
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "Categoria ", children: [
          /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "categoria", children: [
            " ",
            "Categoría",
            " "
          ] }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: " p-4 w-full ",
              id: "categoria",
              name: "categoria",
              required: true,
              onChange: handleChange,
              value: changeValue,
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: " Categoría " }),
                categorias.map((categoria) => /* @__PURE__ */ jsxs("option", { value: categoria.nombre, children: [
                  " ",
                  categoria.nombre
                ] }, categoria.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "etiqueta ", children: [
          /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "servicio", children: [
            " ",
            "Servicio",
            " "
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "servicio",
              className: "h-10 p-4 w-full",
              type: "text",
              name: "servicio"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "descripcion flex-col flex align-middle gap-5 ", children: [
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "descripcion", children: "Descripción" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              id: "descripcion",
              name: "descripcion",
              className: "px-3 py-2 min-h-40 h-44",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex  items-center  ", children: [
          /* @__PURE__ */ jsxs("label", { htmlFor: "visitsRequired", className: "text-gray-300 mr-5", children: [
            " ",
            "Visitas",
            " "
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "visitsRequired",
              name: "visitsRequired",
              className: "h-10 p-4 w-1/3 my-1",
              min: "0",
              max: "4",
              type: "number",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "Activar flex align-middle gap-5 ", children: [
          /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "activo", children: [
            " ",
            "Activar",
            " "
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "w-5 h-5",
              name: "activo",
              id: "activo",
              type: "checkbox",
              checked: activar,
              onChange: handleActivar
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: " rounded-lg self-center flex justify-center items-center text-2xl text-gray-100 text-center py-4 px-6 border-spacing-1 border-gray-500 border-2 mt-10 mb-20",
            disabled: isSubmitting,
            children: isSubmitting ? "En ello..." : "Crear Cupón"
          }
        )
      ]
    }
  ) });
};
const Creador = () => {
  const { categorias, promociones } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "w-full  flex justify-center items-center flex-col pt-10", children: [
    /* @__PURE__ */ jsx("div", { className: "w-1/2 md:w-2/5" }),
    /* @__PURE__ */ jsx("p", { className: "mb-14", children: "Llena el formulario para crear cupones" }),
    categorias && /* @__PURE__ */ jsx(CuponesForm, { categorias, promociones }),
    /* @__PURE__ */ jsxs(
      Link,
      {
        className: " bg-gray-800 w-[150px] self-center text-2xl text-gray-100 text-center p-3 mt-10 mb-20 ",
        to: "/",
        children: [
          " ",
          "Regresar",
          " "
        ]
      }
    )
  ] });
};
async function action$5({ request }) {
  const userId = await requireUserSession(request);
  console.log(userId.userId, "by REQUEST");
  const formData = await request.formData();
  const dataCupon = Object.fromEntries(formData);
  try {
    await newCupon(dataCupon, userId.userId);
    console.log("action processed", dataCupon);
    return redirect$1("/");
  } catch (error) {
    console.log(error);
    if (error.status === 422) {
      return { dataCupon: error.message };
    } else {
      return { dataCupon: error.message };
    }
  }
}
async function loader$1({ request }) {
  const categorias = await getCategorias();
  const promociones = await getFormula();
  console.log("promociones", promociones);
  return { categorias, promociones };
}
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: Creador,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const invitar = () => {
  return /* @__PURE__ */ jsxs("div", { className: " mt-12 flex flex-col items-center gap-5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-2xl w-10/12", children: "Ingresa el whatsapp de tu amigo" }),
    /* @__PURE__ */ jsxs(Form, { className: " w-10/12 flex flex-col gap-3 text-gray-900", children: [
      /* @__PURE__ */ jsxs("label", { className: " text-gray-100", htmlFor: "number", children: [
        " ",
        "WhatsApp",
        " "
      ] }),
      /* @__PURE__ */ jsx("input", { className: "h-10 p-4", type: "number", name: "number" })
    ] }),
    /* @__PURE__ */ jsxs(
      "a",
      {
        className: " bg-gray-800 w-[150px] self-center text-2xl text-gray-100 text-center p-3 mt-10 mb-20 ",
        href: "/profile",
        children: [
          " ",
          "Invitar",
          " "
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-5", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xl w-10/12", children: "También si quieres puedes compartirle tu código personal, así cuando tu amigo nos de tu referencia, se desbloquea tu cupón" }),
      /* @__PURE__ */ jsx("div", { className: "w-10/12 p-3 bg-gray-600 text-gray-100 flex justify-center ", children: /* @__PURE__ */ jsx("p", { className: "text-l ", children: "Rocket@JustLikeHome2405B" }) })
    ] })
  ] });
};
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: invitar
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "Programa de Lealtad Just Like Home" },
    { name: "description", content: "Programa de lealtad" }
  ];
};
function Index() {
  useNavigate();
  const { user, perritos } = useLoaderData();
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: " animate-buscador flex flex-col items-center content-center justify-center h-screen bg-gray-950 ", children: [
    /* @__PURE__ */ jsxs("section", { className: " -mt-52 flex flex-col gap-2 justify-center items-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-montserrat text-2xl ", children: "Bienvenido " }),
      /* @__PURE__ */ jsx("h2", { className: "font-montserrat text-3xl -my-2", children: "al Programa " }),
      /* @__PURE__ */ jsx("h2", { className: "font-montserrat text-5xl ", children: "de lealtad " }),
      /* @__PURE__ */ jsx(
        "img",
        {
          className: " w-11/12 max-w-[400px] mt-7",
          src: loJLH,
          alt: "logo Just Like Home"
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-lg", children: "El hub para tus perritos" })
    ] }),
    (user == null ? void 0 : user.role) === "USER" && /* @__PURE__ */ jsxs("section", { className: "mt-10 flex flex-col gap-5 items-center", children: [
      "Mira los cupones de",
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "flex ", children: perritos.map((perrito) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `profile/${perrito.id}`,
          className: "w-30 h-30 rounded-full overflow-hidden",
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                className: " object-fill w-36 h-36",
                alt: "perritos",
                src: perrito.foto
              }
            ),
            " "
          ]
        },
        perrito.id
      )) }) }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          className: " text-center mt-10 flex flex-col gap-5 items-center",
          to: "/login",
          children: [
            /* @__PURE__ */ jsx("br", {}),
            " y empieza a recibir beneficios.",
            " "
          ]
        }
      )
    ] }),
    !(user == null ? void 0 : user.role) && /* @__PURE__ */ jsxs("section", { className: "mt-10 flex flex-col gap-5 items-center", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/login", children: [
        "¿Tienes cuenta?",
        " ",
        /* @__PURE__ */ jsx("span", { className: " decoration-solid underline", children: "pasa por aquí." })
      ] }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          className: " text-center mt-10 flex flex-col gap-5 items-center",
          to: "/login",
          children: [
            "Si quieres una cuenta ",
            /* @__PURE__ */ jsx("br", {}),
            "ven a Just Like Home",
            /* @__PURE__ */ jsx("br", {}),
            " y empieza a recibir beneficios.",
            " "
          ]
        }
      )
    ] }),
    (user == null ? void 0 : user.role) === "ADMIN" && /* @__PURE__ */ jsx("section", { className: "mt-10 flex flex-col gap-5 items-center", children: /* @__PURE__ */ jsxs(Link, { to: "/login", children: [
      "¿Tienes cuenta?",
      " ",
      /* @__PURE__ */ jsx("span", { className: " decoration-solid underline", children: "pasa por aquí." })
    ] }) })
  ] }) });
}
async function loader({ request }) {
  const user = await getUserFromSession(request);
  let perritos = {};
  if (user == null ? void 0 : user.userId) {
    perritos = await getAllPeludosByUser(user.userId);
  }
  return { user, perritos };
}
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const s3 = new S3Client({
  region: process.env.DREAMS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.DREAMS_ACCES_KEY_ID,
    secretAccessKey: process.env.DREAMS_SECRET_ACCESS_KEY
  }
});
async function uploadHandler(args) {
  console.log("ARGS", await args);
  if (args.name !== "dream-pic") {
    args.data.resume();
    return;
  }
  const chunks = [];
  for await (const chunk of args.data) {
    chunks.push(chunk);
  }
  const imageData = Buffer.concat(chunks);
  const cuidName = `${createId()}.${args.filename.split(".").slice(-1)}`;
  const command = new PutObjectCommand({
    Bucket: process.env.DREAMS_BUCKET_NAME || "",
    Key: cuidName,
    Body: imageData
  });
  try {
    const response = await s3.send(command);
    console.log("FU:L RESPONSE?", response);
    return `https://${process.env.DREAMS_BUCKET_NAME}.s3.amazonaws.com/${cuidName}`;
  } catch (err) {
    console.error("ES UN ERROR", err);
  }
}
async function uploadImage(request) {
  var _a;
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const file = ((_a = formData.get("dream-pic")) == null ? void 0 : _a.toString()) || "";
  console.log({ imageUrl: file });
  return file;
}
const action$4 = async ({ request }) => {
  console.log("FROM IMAGES.JS");
  const imageUrl = await uploadImage(request);
  return json({ imageUrl });
};
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4
}, Symbol.toStringTag, { value: "Module" }));
function action$3({ request }) {
  if (request.method !== "POST") {
    throw json({ message: "Invalid request method" }, { status: 400 });
  }
  return destroyUserSession(request);
}
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3
}, Symbol.toStringTag, { value: "Module" }));
function Signup() {
  var _a, _b;
  const actionData = useActionData();
  return /* @__PURE__ */ jsxs(Form, { method: "post", children: [
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("input", { type: "email", name: "email" }),
      ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? /* @__PURE__ */ jsx("em", { children: actionData == null ? void 0 : actionData.errors.email }) : null
    ] }),
    /* @__PURE__ */ jsxs("p", { children: [
      /* @__PURE__ */ jsx("input", { type: "password", name: "password" }),
      ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) ? /* @__PURE__ */ jsxs("em", { children: [
        " ",
        actionData == null ? void 0 : actionData.errors.password,
        " "
      ] }) : null
    ] }),
    /* @__PURE__ */ jsx("button", { type: "submit", children: "Sign Up" })
  ] });
}
async function action$2(request) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const errors = {};
  if (!email.includes("@")) {
    errors.email = "Invalid email address";
  }
  if (password.length < 12) {
    errors.password = "Password should be at least 12 characters";
  }
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  return redirect("/dashboard");
}
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: Signup
}, Symbol.toStringTag, { value: "Module" }));
function AuthForm(userRole) {
  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const validationErrors = useActionData();
  console.log("UZDER", userRole);
  console.log("MODE", searchParams.get("mode"));
  let authMode = searchParams.get("mode") || "login";
  const [getRole, setRole] = useState(userRole);
  useEffect(() => {
    setRole(userRole);
    console.log("USERfoLOG", userRole);
  }, [userRole]);
  const submitBtnCaption = authMode === "login" ? "Login" : "Crear Usuario";
  const isSubmitting = navigation.state !== "idle";
  return /* @__PURE__ */ jsxs(
    Form,
    {
      method: "post",
      className: "form rounded-lg flex flex-col gap-3 p-5 justify-between bg-darkest w-10/12 md:w-1/3 md:p-8 text-gray-900",
      id: "auth-form",
      children: [
        /* @__PURE__ */ jsx("div", { className: "icon-img text-gray-100", children: authMode === "login" ? "Lock" : "Plus" }),
        authMode !== "login" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "email", children: "Nombre del Humano" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "p-3 h-8 text-darkest",
              type: "text",
              id: "name",
              name: "name",
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "email", children: "eMail" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "p-3 h-8 text-darkest",
            type: "email",
            id: "email",
            name: "email",
            required: true
          }
        ),
        authMode !== "login" && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "whatsapp", children: "Whatsapp" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "h-10 p-4",
              type: "tel",
              name: "whatsapp",
              id: "whatsapp",
              required: true
            }
          ),
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "colonia", children: "Colonia" }),
          /* @__PURE__ */ jsx("input", { className: "h-10 p-4", type: "text", name: "colonia", id: "colonia" }),
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "municipio", children: "Municipio" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "h-10 p-4",
              type: "text",
              name: "municipio",
              id: "municipio"
            }
          )
        ] }),
        getRole.userRole === "ADMIN" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { className: " text-gray-100", htmlFor: "password", children: "Password Automático" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "p-3 h-8 text-darkest",
              type: "password",
              id: "password",
              name: "password",
              hidden: true,
              value: "0123456789"
            }
          )
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("label", { className: " text-gray-100 ", htmlFor: "password", children: "Password" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "p-3 h-8 text-darkest",
              type: "password",
              id: "password",
              name: "password",
              minLength: 7
            }
          )
        ] }),
        validationErrors && /* @__PURE__ */ jsx("div", { children: Object.values(validationErrors).map((error) => /* @__PURE__ */ jsx("p", { className: "text-gray-100", children: error }, error)) }),
        /* @__PURE__ */ jsx("div", { className: "text-gray-100 form-actions justify-center flex flex-row flex-wrap gap-2 ", children: /* @__PURE__ */ jsx(
          "button",
          {
            className: "p-3 my-7 rounded-lg border-gray-400 border-2",
            disable: isSubmitting,
            children: isSubmitting ? "Authenticating..." : submitBtnCaption
          }
        ) })
      ]
    }
  );
}
function isValidEmail(value) {
  return value && value.includes("@");
}
function isValidPassword(value) {
  return value && value.trim().length >= 7;
}
function validateCredentials(input) {
  let validationErrors = {};
  if (!isValidEmail(input.email)) {
    validationErrors.email = "Invalid email address.";
  }
  if (!isValidPassword(input.password)) {
    validationErrors.password = "Invalid password. Must be at least 7 characters long.";
  }
  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}
function LogIn() {
  return (
    // <main className="p-8 flex justify-center w-screen items-center">
    /* @__PURE__ */ jsx("div", { className: "mt-10  w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsx(AuthForm, { signUp: true }) })
  );
}
async function action$1({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);
  try {
    validateCredentials(credentials);
  } catch (error) {
    return error;
  }
  try {
    if (authMode === "login") {
      console.log("ITS LOGIN");
      console.log({ authMode });
      console.log(credentials);
      return await login(credentials);
    } else {
      console.log("ITS SIGNUP");
      return await signup(credentials);
    }
  } catch (error) {
    if (error.status === 422) {
      return { credentials: error.message };
    } else {
      return { credentials: error.message };
    }
  }
}
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: LogIn
}, Symbol.toStringTag, { value: "Module" }));
const GeneralForm = () => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("p", { children: "Form" }),
    /* @__PURE__ */ jsx("p", { children: "Nombre" }),
    /* @__PURE__ */ jsx("p", { children: " Email " }),
    /* @__PURE__ */ jsx("p", { children: " Nombre Humano " }),
    /* @__PURE__ */ jsx("p", { children: " Colobnia " }),
    /* @__PURE__ */ jsx("p", { children: " Municipio" }),
    /* @__PURE__ */ jsx("p", { children: "Raza" }),
    /* @__PURE__ */ jsx("a", { href: "/profile", children: " Agregar " })
  ] });
};
const nuevo = () => {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(GeneralForm, {}) });
};
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: nuevo
}, Symbol.toStringTag, { value: "Module" }));
function AuthPage() {
  const { userRole, changeClientId } = useOutletContext();
  console.log("USER ROLE CONTEXT", userRole);
  return (
    // <main className="p-8 flex justify-center w-screen items-center">
    /* @__PURE__ */ jsx("div", { className: "mt-10  w-full items-center flex flex-col gap-5", children: /* @__PURE__ */ jsx(AuthForm, { signUp: false, userRole }) })
  );
}
async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get("mode") || "login";
  const usuarioActivo = await getUserFromSession(request);
  const formData = await request.formData();
  let credentials = Object.fromEntries(formData);
  const { name, email, password, whatsapp, colonia, municipio } = Object.fromEntries(formData);
  const updatedPassword = name.toLowerCase() + "@JustLikeHome@" + whatsapp.slice(-4);
  if (usuarioActivo.role === "ADMIN") {
    credentials = {
      name,
      email,
      password: updatedPassword,
      whatsapp,
      colonia,
      municipio,
      role: usuarioActivo.role
    };
  }
  try {
    validateCredentials(credentials);
  } catch (error) {
    return error;
  }
  try {
    if (authMode === "login") {
      console.log("ITS LOGIN");
      console.log({ authMode });
      console.log(credentials);
      return await login(credentials);
    } else {
      console.log("ITS SIGNUP");
      return await signup(credentials);
    }
  } catch (error) {
    if (error.status === 422) {
      return { credentials: error.message };
    } else {
      return { credentials: error.message };
    }
  }
}
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: AuthPage
}, Symbol.toStringTag, { value: "Module" }));
const scan = () => {
  return /* @__PURE__ */ jsx("div", { children: "SE ABRE LA CAMARA O SCANEAMOS CON LECTOR QR EN COMPU" });
};
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: scan
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-Br40F3BO.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BE_EfLZ3.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js", "/assets/useScrollBlock-BHwmHjvX.js"], "css": [] }, "routes/requestNewActivationToken": { "id": "routes/requestNewActivationToken", "parentId": "root", "path": "requestNewActivationToken", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/requestNewActivationToken-DHnoC9Tv.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js"], "css": [] }, "routes/terminos_y_condiciones": { "id": "routes/terminos_y_condiciones", "parentId": "root", "path": "terminos_y_condiciones", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/terminos_y_condiciones-AvR5AWi_.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js"], "css": [] }, "routes/newRegistroPeludo.$id": { "id": "routes/newRegistroPeludo.$id", "parentId": "root", "path": "newRegistroPeludo/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/newRegistroPeludo._id-Bon5WTGD.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/PeludoForm-N8Rgk3n0.js", "/assets/ImageUploader-BnT2WFw1.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/reset-password.$token": { "id": "routes/reset-password.$token", "parentId": "root", "path": "reset-password/:token", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/reset-password._token-1UDFKo0o.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/aviso_de_privacidad": { "id": "routes/aviso_de_privacidad", "parentId": "root", "path": "aviso_de_privacidad", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/aviso_de_privacidad-DW-MUHMY.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js"], "css": [] }, "routes/resetPasswordSucces": { "id": "routes/resetPasswordSucces", "parentId": "root", "path": "resetPasswordSucces", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/resetPasswordSucces-D6H_OksK.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js"], "css": [] }, "routes/activationSuccess": { "id": "routes/activationSuccess", "parentId": "root", "path": "activationSuccess", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/activationSuccess-DzwHNIVO.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js"], "css": [] }, "routes/humanProfile.$id": { "id": "routes/humanProfile.$id", "parentId": "root", "path": "humanProfile/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/humanProfile._id-5Ii5islO.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/useScrollBlock-BHwmHjvX.js", "/assets/UrlCreator-CsYKP98J.js", "/assets/Modal-CImQWA-D.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/registrar-visita": { "id": "routes/registrar-visita", "parentId": "root", "path": "registrar-visita", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/registrar-visita-CSxRPO1x.js", "imports": [], "css": [] }, "routes/activate.$token": { "id": "routes/activate.$token", "parentId": "root", "path": "activate/:token", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/activate._token-B9fTr-Al.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/editPeludo.$id": { "id": "routes/editPeludo.$id", "parentId": "root", "path": "editPeludo/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/editPeludo._id-B-QOCL0q.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/ImageUploader-BnT2WFw1.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/forgotPassword": { "id": "routes/forgotPassword", "parentId": "root", "path": "forgotPassword", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/forgotPassword-D6MfBHDt.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/buscarCliente": { "id": "routes/buscarCliente", "parentId": "root", "path": "buscarCliente", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/buscarCliente-gDBKyok9.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/editCupon.$id": { "id": "routes/editCupon.$id", "parentId": "root", "path": "editCupon/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/editCupon._id-xyytXmOj.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js", "/assets/CuponForm-CcXiUxHr.js"], "css": [] }, "routes/newCategoria": { "id": "routes/newCategoria", "parentId": "root", "path": "newCategoria", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/newCategoria-DZlU4TOQ.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js"], "css": [] }, "routes/cupones.$id": { "id": "routes/cupones.$id", "parentId": "root", "path": "cupones/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cupones._id-DqL5peBt.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/useScrollBlock-BHwmHjvX.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js", "/assets/Modal-CImQWA-D.js", "/assets/CuponForm-CcXiUxHr.js"], "css": [] }, "routes/newEtiqueta": { "id": "routes/newEtiqueta", "parentId": "root", "path": "newEtiqueta", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/newEtiqueta-DSq70mj2.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js"], "css": [] }, "routes/profile.$id": { "id": "routes/profile.$id", "parentId": "root", "path": "profile/:id", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/profile._id-DQ_91WsG.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/useScrollBlock-BHwmHjvX.js", "/assets/UrlCreator-CsYKP98J.js", "/assets/Modal-CImQWA-D.js", "/assets/index-DjKJqAo0.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/cuponsList": { "id": "routes/cuponsList", "parentId": "root", "path": "cuponsList", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cuponsList-Bm202rq-.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/newFormula": { "id": "routes/newFormula", "parentId": "root", "path": "newFormula", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/newFormula-Cw7L_SYi.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js"], "css": [] }, "routes/homeAdmin": { "id": "routes/homeAdmin", "parentId": "root", "path": "homeAdmin", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/homeAdmin-J6EBGldW.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/lo-JLH-hrz-big-CwKL34rO.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/newPeludo": { "id": "routes/newPeludo", "parentId": "root", "path": "newPeludo", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/newPeludo-B25L_MQ5.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/PeludoForm-N8Rgk3n0.js", "/assets/ImageUploader-BnT2WFw1.js"], "css": [] }, "routes/explorar": { "id": "routes/explorar", "parentId": "root", "path": "explorar", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/explorar-BoYvfwLT.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/index-DjKJqAo0.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/notFound": { "id": "routes/notFound", "parentId": "root", "path": "notFound", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/notFound-BkeNcaam.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js"], "css": [] }, "routes/creador": { "id": "routes/creador", "parentId": "root", "path": "creador", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/creador-CCC4YpI9.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/invitar": { "id": "routes/invitar", "parentId": "root", "path": "invitar", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/invitar-BapIAeQP.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-CWgMDtZ8.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/lo-JLH-hrz-big-CwKL34rO.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/images": { "id": "routes/images", "parentId": "root", "path": "images", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/images-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logout-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/signup": { "id": "routes/signup", "parentId": "root", "path": "signup", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/signup-CaTB9oL-.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js"], "css": [] }, "routes/logIn": { "id": "routes/logIn", "parentId": "root", "path": "logIn", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/logIn-Oeyu2PJb.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js", "/assets/AuthForm-D3ayBKNm.js"], "css": [] }, "routes/nuevo": { "id": "routes/nuevo", "parentId": "root", "path": "nuevo", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/nuevo-DZsoVX_W.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js"], "css": [] }, "routes/auth": { "id": "routes/auth", "parentId": "root", "path": "auth", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/auth-Cff51gMs.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js", "/assets/index-CD45sefw.js", "/assets/index-zFQnOIg2.js", "/assets/components-Cuo2WHyh.js", "/assets/AuthForm-D3ayBKNm.js"], "css": [] }, "routes/scan": { "id": "routes/scan", "parentId": "root", "path": "scan", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/scan-lKkMkiep.js", "imports": ["/assets/jsx-runtime-D2HyDbKh.js"], "css": [] } }, "url": "/assets/manifest-75064aac.js", "version": "75064aac" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "unstable_singleFetch": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/requestNewActivationToken": {
    id: "routes/requestNewActivationToken",
    parentId: "root",
    path: "requestNewActivationToken",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/terminos_y_condiciones": {
    id: "routes/terminos_y_condiciones",
    parentId: "root",
    path: "terminos_y_condiciones",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/newRegistroPeludo.$id": {
    id: "routes/newRegistroPeludo.$id",
    parentId: "root",
    path: "newRegistroPeludo/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/reset-password.$token": {
    id: "routes/reset-password.$token",
    parentId: "root",
    path: "reset-password/:token",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/aviso_de_privacidad": {
    id: "routes/aviso_de_privacidad",
    parentId: "root",
    path: "aviso_de_privacidad",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/resetPasswordSucces": {
    id: "routes/resetPasswordSucces",
    parentId: "root",
    path: "resetPasswordSucces",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/activationSuccess": {
    id: "routes/activationSuccess",
    parentId: "root",
    path: "activationSuccess",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/humanProfile.$id": {
    id: "routes/humanProfile.$id",
    parentId: "root",
    path: "humanProfile/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/registrar-visita": {
    id: "routes/registrar-visita",
    parentId: "root",
    path: "registrar-visita",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/activate.$token": {
    id: "routes/activate.$token",
    parentId: "root",
    path: "activate/:token",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  },
  "routes/editPeludo.$id": {
    id: "routes/editPeludo.$id",
    parentId: "root",
    path: "editPeludo/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route11
  },
  "routes/forgotPassword": {
    id: "routes/forgotPassword",
    parentId: "root",
    path: "forgotPassword",
    index: void 0,
    caseSensitive: void 0,
    module: route12
  },
  "routes/buscarCliente": {
    id: "routes/buscarCliente",
    parentId: "root",
    path: "buscarCliente",
    index: void 0,
    caseSensitive: void 0,
    module: route13
  },
  "routes/editCupon.$id": {
    id: "routes/editCupon.$id",
    parentId: "root",
    path: "editCupon/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route14
  },
  "routes/newCategoria": {
    id: "routes/newCategoria",
    parentId: "root",
    path: "newCategoria",
    index: void 0,
    caseSensitive: void 0,
    module: route15
  },
  "routes/cupones.$id": {
    id: "routes/cupones.$id",
    parentId: "root",
    path: "cupones/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route16
  },
  "routes/newEtiqueta": {
    id: "routes/newEtiqueta",
    parentId: "root",
    path: "newEtiqueta",
    index: void 0,
    caseSensitive: void 0,
    module: route17
  },
  "routes/profile.$id": {
    id: "routes/profile.$id",
    parentId: "root",
    path: "profile/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route18
  },
  "routes/cuponsList": {
    id: "routes/cuponsList",
    parentId: "root",
    path: "cuponsList",
    index: void 0,
    caseSensitive: void 0,
    module: route19
  },
  "routes/newFormula": {
    id: "routes/newFormula",
    parentId: "root",
    path: "newFormula",
    index: void 0,
    caseSensitive: void 0,
    module: route20
  },
  "routes/homeAdmin": {
    id: "routes/homeAdmin",
    parentId: "root",
    path: "homeAdmin",
    index: void 0,
    caseSensitive: void 0,
    module: route21
  },
  "routes/newPeludo": {
    id: "routes/newPeludo",
    parentId: "root",
    path: "newPeludo",
    index: void 0,
    caseSensitive: void 0,
    module: route22
  },
  "routes/explorar": {
    id: "routes/explorar",
    parentId: "root",
    path: "explorar",
    index: void 0,
    caseSensitive: void 0,
    module: route23
  },
  "routes/notFound": {
    id: "routes/notFound",
    parentId: "root",
    path: "notFound",
    index: void 0,
    caseSensitive: void 0,
    module: route24
  },
  "routes/creador": {
    id: "routes/creador",
    parentId: "root",
    path: "creador",
    index: void 0,
    caseSensitive: void 0,
    module: route25
  },
  "routes/invitar": {
    id: "routes/invitar",
    parentId: "root",
    path: "invitar",
    index: void 0,
    caseSensitive: void 0,
    module: route26
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route27
  },
  "routes/images": {
    id: "routes/images",
    parentId: "root",
    path: "images",
    index: void 0,
    caseSensitive: void 0,
    module: route28
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: route29
  },
  "routes/signup": {
    id: "routes/signup",
    parentId: "root",
    path: "signup",
    index: void 0,
    caseSensitive: void 0,
    module: route30
  },
  "routes/logIn": {
    id: "routes/logIn",
    parentId: "root",
    path: "logIn",
    index: void 0,
    caseSensitive: void 0,
    module: route31
  },
  "routes/nuevo": {
    id: "routes/nuevo",
    parentId: "root",
    path: "nuevo",
    index: void 0,
    caseSensitive: void 0,
    module: route32
  },
  "routes/auth": {
    id: "routes/auth",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: route33
  },
  "routes/scan": {
    id: "routes/scan",
    parentId: "root",
    path: "scan",
    index: void 0,
    caseSensitive: void 0,
    module: route34
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
