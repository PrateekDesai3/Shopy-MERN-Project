import React, { useContext } from 'react'
import Breadcrum from '../Components/Breadcrums/Breadcrum';
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router-dom';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProduct from '../Components/RelatedProduct/RelatedProduct';
const Product = () => {
  const {all_product}=useContext(ShopContext);
  const {productId} = useParams();
  const product=all_product.find((e)=>e.id === Number(productId))
 // console.log('Product ID:', productId);
//console.log('All Products:', all_product);

  return (
    <div className=''>
      <Breadcrum product={product}></Breadcrum>
      <ProductDisplay product={product}></ProductDisplay>
      <DescriptionBox></DescriptionBox>
      <RelatedProduct></RelatedProduct>
    </div>
  )
}

export default Product
