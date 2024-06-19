// import PropTypes from 'prop-types'

import { Link } from '@remix-run/react'

// import Rewards from './Rewards'

const ListCupons = ({ cupons }) => {
  const categoryOrder = ['Categoria1', 'Categoria2', 'Categoria3', 'Categoria4']

  {
    /* Object.keys(cupons).map(categoria => ( */
  }
  return (
    <div className="flex flex-col gap-5 justify-center mb-20 flex-wrap">
      {Object.keys(cupons).length > 0 &&
        Object.keys(cupons).map(categoria => (
          <div
            className="flex flex-col gap-5 justify-center mb-10 flex-wrap"
            key={categoria}
          >
            <h2>{categoria}</h2>
            <div className="flex gap-5 justify-center mb-10 flex-wrap">
              {cupons[categoria].map(cupon => (
                <Link
                  to={`/editCupon/${cupon.id}`}
                  className="flex  flex-col mb-10 bg-gray-800 hover:bg-gray-600 w-[150px] rounded-lg text-center p-5 justify-center items-center"
                  key={cupon.id}
                >
                  {cupon.nombre}
                  {/* <div className="flex justify-center"> */}
                  {/* <h2 className="text-xl font-bold text-center">
                {cupon.categoria}
              </h2> */}
                  {/* <button className="flex justify-center items-center content-center">
                      <div className="flex justify-center align-middle items-center  text-center">
                        {' '}
                        {cupon.nombre}
                      </div>
                    </button>
                  </div> */}
                  {/* <div className="flex rounded-b-lg align-middle justify-center bg-gray-700  h-10 items-center"> */}
                  {/* <p className="">{cupon._count.used}</p> */}
                  {/* </div> */}
                </Link>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}

export default ListCupons

{
  /* <p> {stat.nombre}</p>
<p> {stat.descripcion}</p>
 */
}

// CuponsList.propTypes = {
//   cupons: PropTypes.string.isRequired
// }
