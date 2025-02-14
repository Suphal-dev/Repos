import React, { useState,useEffect } from "react";
import "./watches.css";
import Products from "../../Components/Products";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";






const Watches = () => {


  const [priceMin,setPriceMin]=useState(null)
  const [priceMax,setPriceMax]=useState(null)
  const [selectedGender,setSelectedGender]=useState([])
  const [searchParams]=useSearchParams()

  const childRef=useRef(null)
  
   
  const cart = useSelector((state) => state.cart);
   


  

   const isSidebarOpen = useSelector((state) => state.toggle.isSidebarOpen);


  // get the category from the url 
   const category=searchParams.get("category")
   console.log("category obtained from url",category)
  



 /// if category is present in url , set it in gender
   useEffect(()=>{

    if(category){
      setSelectedGender([category])
    }
    
    
   
    
    },[])

  
const handleCheckboxChange=(e)=>{
  console.log("checkbox clicked")
  console.log(e.target.checked)
  console.log(e.target.value)
  let string=e.target.value;
  let parts = string.split("-"); // Splitting the string into an array
  let Min = parseInt(parts[0]); // First value
  let Max = parseInt(parts[1]); // Second value
  setPriceMax(Max)
  setPriceMin(Min)

}




////handling checkbox
const handleChange=(e)=>{
   const {checked,value}=e.target;

   if(checked){
    setSelectedGender([...selectedGender,value])
   }else{
    setSelectedGender(selectedGender.filter((item)=>item !==value))
   }
}


const handleFetch=async()=>{
  
  if(childRef.current){
    const response=await childRef.current.fetchFilteredData()
    console.log("button clicked")
  }
}




  return (
    <>
      <div>
        {/* navbar */}

       



        {/* sidebar */}

        <aside
          id="logo-sidebar"
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }   bg-gray-800  sm:translate-x-0  aria-label="Sidebar"`}
        >
          <div className="h-full  px-3 pb-4 overflow-y-auto bg-gray-800  dark:bg-gray-800">


           

            {/*  side bar content*/}

            <div className="w-full p-4   ">
              {/* First Row */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold text-white font-serif">
                  Filter
                </div>
                <div className="text-xl text-white">
                  <i className="fa-solid fa-filter"></i>
                </div>
              </div>

              {/* Second Row */}
              <div className="mb-6">
                <div className="text-md text-white font-semibold  font-mono mb-2">
                  Gender
                </div>
                <div className="space-y-2 text-white">
                  {["Men","Woman","Unisex"].map((c,i)=>(
                     <label key={i}  className="flex items-center">
                     <input
                       type="checkbox"
                       id={c}
                       key={i}
                       name="gender"
                       value={c}
                       className="mr-2"
                       onChange={handleChange}
                       checked={selectedGender.includes(c)}
                      
                     />
                     {c}
                   </label>

                  ))}
                 {console.log(selectedGender)}


                </div>
              </div>

              {/* Third Row */}
              <div>
                <div className="text-md font-semibold mb-2 text-white font-mono">
                  Price
                </div>
                <div className="space-y-2 text-white">
                  {[
                    { label: "0-1000", value: "0-1000" },
                    { label: "1001-2000", value: "1001-2000" },
                    { label: "2001-3000", value: "2001-3000" },
                    { label: "3001-4000", value: "3001-4000" },
                    { label: "4001-5000", value: "4001-5000" },
                    { label: "5001-10000", value: "5001-10000" },
                    { label: "10001-20000", value: "10001-20000" },
                    { label: "20001-30000", value: "20001-30000" },
                  ].map((price, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        id={price.value}
                        key={index}
                        name="price"
                        value={price.value}
                        onChange={handleCheckboxChange}
                        className="mr-2"
                      />
                      {price.label}
                    </label>
                  ))}
                </div>

                <button  onClick={handleFetch}  className="mt-4 w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
                  Apply
                </button>


              </div>
            </div>


          </div>
        </aside>

        <div className="p-4 sm:ml-64">

          {/* main content here */}

          <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 sm:mt-6">
            <Products category={category}  priceMin={priceMin} priceMax={priceMax} gender={selectedGender} ref={childRef} />
          </div>


        </div>
      </div>
    </>
  );
};

export default Watches;
