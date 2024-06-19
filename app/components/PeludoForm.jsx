import { Form, useNavigation } from '@remix-run/react'
const PeludoForm = ({ imageUrl, usuarioId }) => {
  const navigation = useNavigation()

  const isSubmitting = navigation.state !== 'idle'

  return (
    <div className="mt-10 w-full items-center flex flex-col gap-5">
      <Form
        method="post"
        // method={peludoData ? 'patch' : 'post'}
        className=" rounded-xl  w-10/12 flex flex-col gap-3 text-gray-900"
      >
        {/* //peludo */}
        <input type="hidden" name="imageUrl" id="imageUrl" value={imageUrl} />

        <input
          type="hidden"
          name="usuarioId"
          id="usuarioId"
          value={usuarioId}
        />

        <div className=" w-12/12 flex flex-col gap-3 text-gray-900 bg-gray-800 px-3 py-6">
          <label className=" text-gray-100" htmlFor="nombre">
            Nombre del peludo
          </label>
          <input
            className="h-10 p-4"
            type="text"
            name="nombre"
            id="nombre"
            required
          />
          <label className=" text-gray-100" htmlFor="raza">
            Raza
          </label>
          <input
            required
            className="h-10 p-4"
            type="text"
            name="raza"
            id="raza"
          />

          <label className=" text-gray-100" htmlFor="nacimiento">
            Fecha de nacimiento
          </label>
          <input
            className="h-10 p-4"
            type="date"
            name="nacimiento"
            id="nacimiento"
            required
          />

          <label className=" text-gray-100" htmlFor="instagram">
            Instagram
          </label>
          <input
            required
            className="h-10 p-4"
            type="text"
            name="instagram"
            id="instagram"
          />
          {/* <label className=" text-gray-100" htmlFor="foto">
            Foto
          </label>
          <input className="h-10 p-0" type="file" name="foto" id="foto" /> */}
        </div>
        <div className="flex justify-center gap-5 flex-wrap align-baseline">
          {/* <button
            className=" bg-gray-800 h-[110px] w-[110px] rounded-full self-center flex justify-center items-center text-sm text-gray-100 text-center  p-[0.7rem] border-spacing-1 border-gray-400 border-2 mt-10 mb-20 "
            href="/humanProfile"
          ></button> */}
          {/* <div className="mb-10 flex items-center flex-col">
            <button className="py-4 h-[130px] w-[130px]">
              <div className="mt-6 bg-gray-400 flex h-[130px] w-[130px] flex-col justify-center items-center ">
                {' '}
                <p className="text-[100px]">+</p>
              </div>
              <p className="text-sm text-gray-400 my-3">
                {isSubmitting
                  ? 'En ello...'
                  : 'Dar de alta y agregar otro Peludo'}
              </p>
            </button>
          </div> */}
          <button className=" rounded-lg self-center flex justify-center items-center text-lg text-gray-100 text-center  p-4 border-spacing-1 border-gray-600 border-2 mt-10 mb-10">
            {isSubmitting ? 'En ello...' : 'Dar de alta'}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default PeludoForm
