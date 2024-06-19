import {
  useLoaderData,
  Outlet,
  useOutletContext,
  useNavigate,
  redirect
} from '@remix-run/react'
import CuponsList from '../components/ListCupons'

import {
  deleteCupon,
  getCuponById,
  getCupones,
  updateCupon,
  getAllCupons
} from '../data/cupon.server'
import Seccion from '../components/Seccion'
import { useState } from 'react'

const Cupons = () => {
  const cupons = useLoaderData()
  // const { cupons } = useLoaderData()
  // console.log(cupon)
  const navigate = useNavigate()

  // const {
  //   cuponesEstetica,
  //   cuponesGuarderia,
  //   cuponesHotel,
  //   cuponesAmigos,
  //   cuponesDinamicas
  // } = useLoaderData()

  const [estado, setEstado] = useState(false)

  const [modalData, setModalData] = useState({
    nombre: 'nombre',
    formula: 'formula',
    descripcion: 'descripcion',
    cuponId: 'id'
  })

  function openCuponHandler(nombre, descripcion, cuponId) {
    setEstado(true)
    const describe = descripcion
    setModalData({ nombre, descripcion, cuponId })
    navigate(`./${cuponId}`)
    console.log(cuponId, 'modalDATa')
    console.log('ABRE')
  }

  return (
    <div>
      <Outlet context={useOutletContext} />
      <CuponsList cupons={cupons} />

      {/* {cuponesEstetica && (
        <Seccion
          promociones={cuponesEstetica.map(cupon => cupon.nombre)}
          descripcion={cuponesEstetica.map(cupon => cupon.descripcion)}
          titulo={cuponesEstetica[0]?.categoria}
          cuponId={cuponesEstetica.map(cupon => cupon.id)}
          onClick={openCuponHandler}
        />
      )}
      {cuponesGuarderia && (
        <Seccion
          promociones={cuponesGuarderia.map(cupon => cupon.nombre)}
          descripcion={cuponesGuarderia.map(cupon => cupon.descripcion)}
          titulo={cuponesGuarderia[0]?.categoria}
          cuponId={cuponesEstetica.map(cupon => cupon.id)}
          onClick={openCuponHandler}
        />
      )}
      {cuponesHotel && (
        <Seccion
          promociones={cuponesHotel.map(nombre => nombre.nombre)}
          descripcion={cuponesHotel.map(cupon => cupon.descripcion)}
          titulo={cuponesHotel[0]?.categoria}
          cuponId={cuponesEstetica.map(cupon => cupon.id)}
          onClick={openCuponHandler}
        />
      )}
      {cuponesAmigos && (
        <Seccion
          promociones={cuponesAmigos.map(nombre => nombre.nombre)}
          descripcion={cuponesAmigos.map(cupon => cupon.descripcion)}
          titulo={cuponesAmigos[0]?.categoria}
          cuponId={cuponesEstetica.map(cupon => cupon.id)}
          onClick={openCuponHandler}
        />
      )}

      {cuponesDinamicas && (
        <Seccion
          promociones={cuponesDinamicas.map(nombre => nombre.nombre)}
          descripcion={cuponesDinamicas.map(cupon => cupon.descripcion)}
          titulo={cuponesDinamicas[0]?.categoria}
          cuponId={cuponesEstetica.map(cupon => cupon.id)}
          onClick={openCuponHandler}
        />
      )} */}

      {/* <Outlet context={useOutletContext()} /> */}
    </div>
  )
}

export default Cupons

export async function loader({ params, request }) {
  const cuponId = await params.id
  const cupon = await getCuponById(cuponId)
  const cupons = await getAllCupons()
  const cuponesEstetica = await getCupones('Estética')
  const cuponesGuarderia = await getCupones('Guardería')
  const cuponesHotel = await getCupones('Hotel')
  const cuponesAmigos = await getCupones('Amigos')
  const cuponesDinamicas = await getCupones('Dinámicas')

  // return cupon
  // return {
  //   cuponesEstetica,
  //   cuponesGuarderia,
  //   cuponesHotel,
  //   cuponesAmigos,
  //   cuponesDinamicas,
  //   cupon,
  //   cupons
  // }
  return cupons
}

// export async function loader({ params, request }) {
//   const cuponId = params.id

//   console.log('CUPON ID', cuponId)
//   const cupon = await getCuponById(cuponId)

//   return cupon
// }

// export async function action({ params, request }) {
//   const cuponId = params.id
//   console.log('---PARAMS---', cuponId)
//   const getFormData = await request.formData()
//   console.log('la data de l forma', getFormData)
//   if (request.method === 'PATCH') {
//     const formData = await request.formData()
//     const cuponData = Object.fromEntries(formData)

//     await updateCupon(cuponId, cuponData)
//     return redirect('/cupons')
//   } else if (request.method === 'DELETE') {
//     await deleteCupon(cuponId)
//     return redirect('/cupons')
//   }
//   // return cuponId
// }
