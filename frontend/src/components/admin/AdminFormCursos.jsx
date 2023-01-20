import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import axios from 'axios'

import { listCursoDetails, updateCurso } from '../../actions/cursoActions'
import { CURSO_UPDATE_RESET } from '../../constants/cursoConstants';

import Error from '../utils/Error';
import Loader from '../utils/Loader'



const AdminFormCursos = ({ match }) => {

  useEffect(() => {
    document.title = 'Tech con Agust | Admin'
  }, []);


  const URL = (process.env.REACT_APP_API_URL)

  let history = useHistory();

  const cursoId = match.params.id

  const [title, setTitle] = useState('')
  const [trailer, setTrailer] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')

  const [image, setImage] = useState('')
  const [setUploading] = useState(false)
  const [file, setFile] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)

  const dispatch = useDispatch()

  const detailsCurso = useSelector(state => state.detailsCurso)
  const { error, loading, curso } = detailsCurso

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const cursoUpdate = useSelector(state => state.cursoUpdate)
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = cursoUpdate

  useEffect(() => {
    if (userInfo.is_superuser === false) {
      history.push('/');
  }
    if (successUpdate) {
      dispatch({ type: CURSO_UPDATE_RESET })
      history.push('/cursos/admin/')
    } else {
      if (!curso.title || curso.id !== Number(cursoId)) {
        dispatch(listCursoDetails(cursoId))
      } else {
        setTitle(curso.title)
        setTrailer(curso.trailer)
        setDescription(curso.description)
        setImage(curso.image)
        setCategory(curso.category)
        setFile(curso.file)
      }
    }
  }, [dispatch, curso, cursoId, history, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateCurso({
      id: cursoId,
      title,
      description,
      trailer,
      image,
      category,
      file,
    }))
  }

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()

    formData.append('file', file)
    formData.append('curso_id', cursoId)

    setUploadingFile(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const { data } = await axios.post(`${URL}cursos/uploadFile/`, formData, config)

      setFile(data)
      setUploadingFile(false)

    } catch (error) {
      setUploadingFile(false)
    }
  }

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()

    formData.append('image', file)
    formData.append('curso_id', cursoId)

    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const { data } = await axios.post(`${URL}cursos/image/`, formData, config)

      setImage(data)
      setUploading(false)

    } catch (error) {
      setUploading(false)
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
                    Crear Curso
                  </h2>
                </div>
                <form onSubmit={submitHandler} className="mt-8 space-y-6" action="#" method="POST">
                  <div>
                    <div className='mb-2'>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Titulo"
                      />
                    </div>
                    
                    <div className='mb-2'>
                      <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        type="text"
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Categoria"
                      />
                    </div>
                    <div className='mb-2'>
                      <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        type="text"
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Descripcion"
                      />
                    </div>
                    <div className='mb-2'>
                      <input
                        value={trailer}
                        onChange={(e) => setTrailer(e.target.value)}
                        type="text"
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Trailer URL"
                      />
                    </div>
                    <div className='mb-2'>
                      <p className='sm text-white font-mono'>Imege</p>
                      <input
                        type='file'
                        onChange={uploadImageHandler}
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                      />
                    </div>
                    <div className='mb-2'>
                      <p className='sm text-white font-mono'>File</p>
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
                      Crear
                    </button>
                  </div>
                </form>
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a  href="/register" className="text-mono font-mono text-grey ">

                      <span className='hover:text-orange ml-2 transition-colors'>
                        Volver a Cursos
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
export default AdminFormCursos