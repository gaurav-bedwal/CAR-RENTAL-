import React from 'react'

const Title = ({ title, subTitle }) => {
  return (
    <>
      <h1 className='font-bold text-3xl tracking-wide text-white'>{title}</h1>
      <p className='text-sm md:text-base text-gray-400 mt-2 max-w-156 font-light'>{subTitle}</p>
    </>
  )
}

export default Title
