import React, { useState, useEffect , forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import Loader from "./Loader/Loader.jsx";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addItem } from "../features/Cart/cart.js";
import { ToastContainer, toast } from "react-toastify";



const Products=forwardRef(({priceMin,priceMax,gender,category},ref)=>{

  const [page,setPage]=useState(1)
  const [products, setProducts] = useState([]);
  const [filterProducts,setFilterProducts]=useState([])
  const [loading, setLoading] = useState(false);
  const [totalPages,setTotalPages]=useState()
  const dispatch = useDispatch();
  const totalStars = 5;
 

  console.log("gender",gender)
  

  ///data fetching for all products with pagination

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/get-all-products?page=${page}`,{withCredentials:true}
      );
      setProducts(data?.data?.products);
      setTotalPages(data?.data?.totalPages)
      setLoading(false);

      console.log(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  //// fetching filtered Data with priceMin, priceMax, gender

  const fetchFilteredData=async()=>{
    console.log("data is fetched ")
    try {
      setLoading(true);
      const { data } = await axios.get(      
         `http://localhost:3000/api/v1/filter?priceMax=${priceMax}&priceMin=${priceMin}&${gender.map(c=>`gender=${c}`).join("&")}`
      );

      if(data.data.products.length===0){
        toast.error("No products found for this category")

      }
      setFilterProducts(data.data.products)
      console.log("filtered data",data)
      setLoading(false)
     

      
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

  }


  ///// fetching product for Men or Woman obtained from url

  const fetchCategoryProducts=async()=>{
    console.log("category product  is  fetching ............. ")
    try {
      setLoading(true);
      const { data } = await axios.get(      
         `http://localhost:3000/api/v1/filter?gender=${category}`
      );
      setFilterProducts(data.data.products)
      console.log("data from fetch  category products",data)
      setLoading(false)
     

      
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

  }


  useEffect(() => {
    if(priceMin==null && priceMax==null && gender.length==0){
      fetchData();
      
    }
  
}, [page]);



useEffect(()=>{
  console.log(" useEffect render")
  if(category){
    fetchCategoryProducts()
    console.log("data has been fetched by useEffect")
  }

},[])




  const handleAddtoCart = (product) => {

    console.log(product)
    dispatch(
      addItem({
        id: product._id,
        title: product.title,
        price: product.discountPrice,
        image: product.images[0],
      })
    );
    toast("Item added to cart!");
  };


 


  useImperativeHandle(ref,()=>(
    {
      fetchFilteredData,
    }
  ))






 



  const  increasePage=()=>{
    if(page==totalPages) return;
    
    setPage(prev=>prev+1)
  }

  

 const decreasePage=()=>{
  if(page==1) return;
  setPage(prev=>prev-1)
 }


  return (
    <>
      <ToastContainer />

      {loading && <Loader />}

      <div className="bg-white font-serif">
        <div className="mx-auto max-w-2xl px-4  sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            
            { filterProducts.length>0 ? (
               
            filterProducts.map((product) => (
              <div
                key={product._id}
                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    className="p-8 rounded-t-lg  h-96"
                    src={product.images[0]}
                    alt="product image"
                  />
                </Link>
                <div className="px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl h-24 font-semibold tracking-tight text-gray-900 dark:text-white">
                      {product.title.length > 60
                        ? product.title.slice(0, 60) + "....."
                        : product.title}
                    </h5>
                  </a>
                  <div className="flex items-center mt-2.5 mb-5">
                    {/* Render stars */}
                    {Array.from({ length: totalStars }, (_, index) => {
                      const coloredStars = Math.round(product.rating);

                      return (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${
                            index < coloredStars
                              ? "text-yellow-300"
                              : "text-gray-200"
                          }`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      );
                    })}

                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-2xl line-through text-gray-900 dark:text-white">
                    ₹ {product.price}
                    </span>
                    <span className="text-sm lg:text-2xl font-bold text-gray-900 dark:text-white">
                      
                      ₹ {product.discountPrice}
                    </span>
                    <button
                      onClick={() => handleAddtoCart(product)}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4  focus:outline-none focus:ring-blue-300 font-medium  rounded-lg text-xs lg:text-sm px-2 lg:px-5 py-1 lg:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))



            ): (
               
            products.map((product) => (
              <div
                key={product._id}
                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    className="p-8 rounded-t-lg  h-96"
                    src={product.images[0]}
                    alt="product image"
                  />
                </Link>
                <div className="px-5 pb-5">
                  <a href="#">
                    <h5 className="text-xl h-24 font-semibold tracking-tight text-gray-900 dark:text-white">
                      {product.title.length > 60
                        ? product.title.slice(0, 60) + "....."
                        : product.title}
                    </h5>
                  </a>
                  <div className="flex items-center mt-2.5 mb-5">

                    {/* Render stars */}
                    {Array.from({ length: totalStars }, (_, index) => {
                      const coloredStars = Math.round(product.rating);

                      return (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${
                            index < coloredStars
                              ? "text-yellow-300"
                              : "text-gray-200"
                          }`}
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 22 20"
                        >
                          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                        </svg>
                      );
                    })}

                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                      {product.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm lg:text-2xl line-through text-gray-900 dark:text-white">
                    ₹ {product.price}
                    </span>
                    <span className="text-sm lg:text-2xl font-bold text-gray-900 dark:text-white">
                      
                      ₹ {product.discountPrice}
                    </span>
                    <button
                      onClick={() => handleAddtoCart(product)}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4  focus:outline-none focus:ring-blue-300 font-medium  rounded-lg text-xs lg:text-sm px-2 lg:px-5 py-1 lg:py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))


            )}
            
           

          </div>
        </div>
      </div>

      {/* pagination button */}

      <div className="flex justify-center  space-x-1 mt-2">
      <button disabled={page==1} onClick={decreasePage} className={`min-w-9 rounded-md bg-blue-100  border border border-slate-300 py-2 px-3 text-white font-serif font-bold text-center text-sm transition-all  text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800  active:border-slate-800 active:text-white active:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2`}>
            Prev
          </button>
          
          <button disabled={page==totalPages} onClick={increasePage} className={`min-w-9 rounded-md bg-blue-100  border border border-slate-300 py-2 px-3 text-white font-serif font-bold text-center text-sm transition-all  text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800  active:border-slate-800 active:text-white active:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2`}>
            Next
          </button>
      </div>
    </>
  );



})




export default Products;
