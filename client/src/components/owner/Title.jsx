import React from 'react'

const Title = ({ title, subTitle }) => {
  return (
    <div className='mb-12'>
      <h1 className='font-black text-4xl md:text-6xl tracking-tighter text-white uppercase leading-none'>{title}</h1>
      <p className='text-xs md:text-sm text-gray-500 mt-4 max-w-2xl font-bold tracking-[0.2em] uppercase opacity-70'>{subTitle}</p>
      <div className='w-24 h-1.5 bg-gradient-to-r from-primary to-transparent mt-6 rounded-full'></div>
    </div>
  )
}

export default Title
