import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios'

import { EPISODIO_UPDATE_RESET } from '../../constants/cursoConstants';
import { listEpisodioDetails, updateEpisodio } from '../../actions/cursoActions'

import Error from '../utils/Error';
import Loader from '../utils/Loader'



const EditEpisodio = ({ match }) => {

  const URL = (process.env.REACT_APP_API_URL)

  let history = useHistory();

  const episodioId = match.params.id

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState('')
  const [setUploadingFile] = useState(false)

  const dispatch = useDispatch()

  const episodioDetails = useSelector(state => state.episodioDetails)
  const { error, loading, episodio } = episodioDetails

  const episodioUpdate = useSelector(state => state.episodioUpdate)
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = episodioUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: EPISODIO_UPDATE_RESET })
      history.push(`/epi/${episodio.curso}`)
    } else {
      if (!episodio.title || episodio.id !== Number(episodioId)) {
        dispatch(listEpisodioDetails(episodioId))
      } else {
        setTitle(episodio.title)
        setUrl(episodio.url)
        setDescription(episodio.description)
        setFile(episodio.file)
      }
    }
  }, [dispatch, episodio, episodioId, history, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateEpisodio({
      id: episodioId,
      title,
      url,
      description,
      file,
    }))
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()

    formData.append('file', file)
    formData.append('episodio_id', episodioId)

    setUploadingFile(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const { data } = await axios.post(`${URL}cursos/uploadFileEpisodio/`, formData, config)

      setFile(data)
      setUploadingFile(false)

    } catch (error) {
      setUploadingFile(false)
    }
  }



  return (
    <>
      {errorUpdate && <Error>{errorUpdate}</Error>}
      {loading || loadingUpdate ? <Loader /> : error ? <Error>{error}</Error>
        : (
          <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className=' m-5 p-10 bg-grey-3'>
              <div className="w-[400px] max-w-md space-y-8 ">
                <div>
                  <h2 className="mt-6 text-center text-3xl font-mono  text-grey">
                    Edit Episodio
                  </h2>
                </div>
                <form onSubmit={submitHandler} className="mt-8 space-y-6" action="#" method="POST">
                  <div className="">
                    <div className='mb-2'>

                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        required
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Titulo"
                      />
                    </div>
                    <div className='mb-2'>
                      <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="text"
                        required
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Descripcion"
                      />
                    </div>
                    <div className='mb-2'>
                      <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        type="text"
                        required
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="URL"
                      />
                    </div>
                    <div className='mb-2'>
                      <input
                        type='file'
                        onChange={uploadFileHandler}
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Correo Electronico"
                      />
                    </div>
                  </div>
                  <div className='items-center'>
                    <button
                      type="submit"
                      className=" space-x-2 block w-full transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a href={`/epi/${episodio.curso}`} className="text-mono font-mono text-grey ">
                      <span className='hover:text-orange ml-2 transition-colors'>
                        Volver atras
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  )
}

export default EditEpisodio