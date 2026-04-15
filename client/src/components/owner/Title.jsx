import React from 'react'

const Title = ({ title, subTitle }) => {
  return (
    <div className='mb-8'>
      <h1 className='font-black text-4xl tracking-tighter text-black uppercase'>{title}</h1>
      <p className='text-lg text-gray-600 mt-2 max-w-2xl font-bold'>{subTitle}</p>
      <div className='w-20 h-2 bg-primary mt-4'></div>
    </div>
  )
}

export default Title
