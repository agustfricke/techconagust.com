import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Message from '../utils/Message';
import Loader from '../utils/Loader'
import { listCursoDetails, updateCurso } from '../../actions/cursoActions'
import { CURSO_UPDATE_RESET } from '../../constants/cursoConstants';
import { useHistory } from "react-router-dom";


const AdminFormCursos = ({ match }) => {

  let history = useHistory();

  const cursoId = match.params.id

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [trailer, setTrailer] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)

  const [file, setFile] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)

  const URL = 'http://127.0.0.1:8000/'
  // const URL = 'https://techconagust.com/'



  const dispatch = useDispatch()

  const detailsCurso = useSelector(state => state.detailsCurso)
  const { error, loading, curso } = detailsCurso

  const cursoUpdate = useSelector(state => state.cursoUpdate)
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = cursoUpdate

  useEffect(() => {

    if (successUpdate) {
      dispatch({ type: CURSO_UPDATE_RESET })
      history.push('/admin/cursos')
    } else {
      if (!curso.title || curso.id !== Number(cursoId)) {
        dispatch(listCursoDetails(cursoId))
      } else {
        setTitle(curso.title)
        setPrice(curso.price)
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
      price,
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
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
        : (
          <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className=' m-5 p-10 bg-grey-3'>
              <div className="w-[400px] max-w-md space-y-8 ">
                <div >

                  <h2 className="mt-6 text-center text-3xl font-mono  text-grey">
                    Crear Curso

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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                  type="text"
                  required
                  class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                  placeholder="Titulo"
                />
                </div>

                    <div className='mb-2'>

                      <input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                        type="text"
                        required
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Categoria"
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
                      value={trailer}
                      onChange={(e) => setTrailer(e.target.value)}
                        type="text"
                        required
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                        placeholder="Trailer URL"
                      />
                    </div>

                    

                    <div className='mb-2'>
<p>Imege</p>
                      <input
                        type='file'
                        onChange={uploadImageHandler}
                        required
                        class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
                      />
                    </div>


                      

                    <div className='mb-2'>
                    <p>File</p>
                      <input
                          type='file'
                          onChange={uploadFileHandler}
                        required
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
                    <a style={{ textDecoration: 'none' }} href="/register" className="text-mono font-mono text-grey ">

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