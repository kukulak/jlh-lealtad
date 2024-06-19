import { Form, Link } from '@remix-run/react'
import { Outlet, useOutletContext } from '@remix-run/react'

const NewUser = () => {
  return (
    <div className="  w-full items-center flex flex-col gap-5">
      <div className="my-5">
        <p className=" text-xl"> Hola Diana </p>
        <p> Captura los datos del nuevo Peludo </p>
      </div>
      <Form className=" w-10/12 flex flex-col gap-3 text-gray-900">
        <label className=" text-gray-100" htmlFor="humano">
          Nombre del Humano
        </label>
        <input className="h-10 p-4" type="text" name="humano" id="humano" />
        <label className=" text-gray-100" htmlFor="email">
          eMail
        </label>
        <input
          className="h-10 p-4"
          type="email"
          name="email"
          id="email"
          autoComplete
        />
        <label className=" text-gray-100" htmlFor="whatsApp">
          Whatsapp
        </label>
        <input className="h-10 p-4" type="tel" name="whatsApp" id="whatsApp" />

        <label className=" text-gray-100" htmlFor="colonia">
          Colonia
        </label>
        <input className="h-10 p-4" type="text" name="colonia" id="colonia" />
        <label className=" text-gray-100" htmlFor="municipio">
          Municipio
        </label>
        <input
          className="h-10 p-4"
          type="text"
          name="municipio"
          id="municipio"
        />

        <Outlet context={useOutletContext()} />

        <Link
          className=" bg-gray-800 w-[150px] self-center text-2xl text-gray-100 text-center p-3 mt-10 mb-20 "
          to="/newPeludo"
        >
          Entrar
        </Link>
      </Form>
      <a
        className=" bg-gray-800 w-[150px] self-center text-2xl text-gray-100 text-center p-3 mt-10 mb-20 "
        href="/"
      >
        Regresar
      </a>
    </div>
  )
}

export default NewUser
