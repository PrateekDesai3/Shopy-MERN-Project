import React from 'react'
import Hero from '../Components/Hero/Hero'
import NewCollection from '../Components/NewCollections/NewCollection'
import NewsLetter from '../Components/NewsLetter/NewsLetter'
import Offer from '../Components/Offer/Offer'
import Popular from '../Components/Popular/Popular'

const Shop = () => {
  return (
    <div>
      <Hero></Hero>
      <Popular></Popular>
      <Offer></Offer>
      <NewCollection></NewCollection>
      <NewsLetter></NewsLetter>
    </div>
  )
}

export default Shop
