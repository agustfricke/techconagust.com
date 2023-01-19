import React, { useState, useEffect } from "react";
import Loader from '../utils/Loader';
import Error from "../utils/Error";
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../utils/Rating'
import { listCursoDetails, createCursoReview } from '../../actions/cursoActions'
import { CURSO_CREATE_REVIEW_RESET } from '../../constants/cursoConstants'
import logo from '../../media/logo.png';
import { HiArrowUpOnSquareStack } from "react-icons/hi2";
import { FaStar } from "react-icons/fa"
import { listUsers } from '../../actions/userActions';

const Reviews = ({match}) => {


  const URL = (process.env.REACT_APP_API_URL)

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('')

  const detailsCurso = useSelector(state => state.detailsCurso)
  const { loading, error, curso } = detailsCurso

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const createReview = useSelector(state => state.createReview)
  const { loading: loadingcursoReview, error: errorcursoReview, success: successcursoReview } = createReview

  const userList = useSelector(state => state.userList);
  const { users } = userList;

  const dispatch = useDispatch()


  useEffect(() => {
    if (successcursoReview) {
      setRating(0)
      setComment('')
      dispatch({ type: CURSO_CREATE_REVIEW_RESET })
    }

    dispatch(listCursoDetails(match.params.id))
    dispatch(listUsers());

  }, [dispatch, match, successcursoReview])


  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createCursoReview(
      match.params.id, {
      rating,
      comment
    }
    ))
  }

  const {reviews} = curso
  
  const isFound = reviews.some(element => {
    if (element.user === userInfo.username ) {
      return true;
    }
  
    return false;
  });




  
  if (isFound) {

    return (
        <>
        <div className="flex items-center justify-between mt-10 mb-16">
        <h2 className="text-3xl text-grey-1 font-mono">
          Reviews de

          <span className='text-orange ml-3.5'>
            {curso.title}
          </span>

        </h2>
      </div>

<div className='border border-t-white mb-7 mt-7'>

</div>
<>
{curso.reviews.length && curso.reviews.length === 0 && <h1>No Reviews</h1>}
{curso.reviews.map((review) => (
  <>
    {users && users.map(user => (
      <>
        {user.username === review.user &&
          <>
            <div className="flex items-center mb-4 space-x-4">
              <img className="w-10 h-10 rounded-full" src={`${URL}${user.avatar}`} alt="" />
              <div className="space-y-1 font-medium text-white text-mono">
                <p>{review.user}  {curso.id} {curso.user}</p>
                <p className="text-grey"> {review.created?.substring(0, 10)}</p>
              </div>
            </div>

            <div className="flex items-center mb-1 ml-[65px]">
              <p className="mt-1 text-sm text-amarillo"> <Rating value={review.rating} />
              </p>
            </div>
            <div className="flex items-center mb-1 ml-7">

              <p className="ml-10 mt-1  text-grey text-mono">
                {review.comment}
              </p>
            </div>
          </>

        }
      </>
    ))}
  </>

))}
</>
</>

    );} else {


      return (
        <>
        <div className="flex items-center justify-between mt-10 mb-16">
        <h2 className="text-3xl text-grey-1 font-mono">
          Reviews de

          <span className='text-orange ml-3.5'>
            {curso.title}
          </span>

        </h2>
      </div>




<div className="flex min-h-full items-center justify-center ">
<div className=' m-4 p-4 bg-grey-3 rounded-lg'>
  <div className="w-[400px] max-w-md space-y-8 ">
    <div >
     
      <h2 className="mt-6 text-center text-xl font-mono  text-grey">
        Crea una Review
       
      </h2>
    </div>
    <form  className="mt-8 space-y-6" method="POST" onSubmit={submitHandler}>

    <div className="star-rating text-3xl text-center">
  {[...Array(5)].map((star, index) => {
    index += 1;
    return (
      <button 
      required
        type="button"
        key={index}
        className={index <= ((rating && hover) || hover) ? "on" : "off"}
        onClick={() => setRating(index)}
        onMouseEnter={() => setHover(index)}
        onMouseLeave={() => setHover(rating)}
        
      >
        <span> <FaStar /> </span>
      </button>
    );
  })}
</div>

      <div className="">
        <div className='mb-2'>

          <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
            type="text"
            required
            class="bg-grey-2 w-full py-4 pl-10 pr-4 rounded-lg text-grey placeholder:font-mono outline-none "
            placeholder="Escribe aqui ..."
          />
        </div>

        
      </div>

      <div className='items-center'>
        <button
          type="submit"
          className=" space-x-2 block w-full transition-colors  text-grey-3  bg-orange hover:bg-yellow font-bold font-mono rounded-lg p-3 px-10"
        >

          Publicar
        </button>
      </div>
    </form>
  </div>
</div>
</div>


<div className='border border-t-white mb-7 mt-7'>

</div>
<>
{curso.reviews.map((review) => (
  <>
    {users && users.map(user => (
      <>
        {user.username === review.user &&
          <>
            <div className="flex items-center mb-4 space-x-4">
              <img className="w-10 h-10 rounded-full" src={`${URL}${user.avatar}`} alt="" />
              <div className="space-y-1 font-medium text-white text-mono">
                <p>{review.user}  {curso.id} {curso.user}</p>
                <p className="text-grey"> {review.created?.substring(0, 10)}</p>
              </div>
            </div>

            <div className="flex items-center mb-1 ml-[65px]">
              <p className="mt-1 text-sm text-amarillo"> <Rating value={review.rating} />
              </p>
            </div>
            <div className="flex items-center mb-1 ml-7">

              <p className="ml-10 mt-1  text-grey text-mono">
                {review.comment}
              </p>
            </div>
          </>

        }
      </>
    ))}
  </>

))}
</>
</>
      );
    }
  
  
  };

export default Reviews