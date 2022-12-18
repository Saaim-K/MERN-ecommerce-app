import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

let baseUrl = '';
if (window.location.href.split(':')[0] === 'http') { baseUrl = 'http://localhost:4444' }

const App = () => {
  // ----------------------------- States -----------------------------
  const [product, setProduct] = useState([])
  const [addProduct, setAddProduct] = useState(false)//Runs every time product is added ,deleted or edited 
  const [editMode, setEditMode] = useState(false)
  const [editProduct, setEditProduct] = useState({})
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [ratings, setRatings] = useState('')
  const [description, setDescription] = useState('')
  // ----------------------------- States -----------------------------


  // ----------------------------- Create Product Function -----------------------------
  const createPost = (e) => {
    e.preventDefault();
    axios.post(`${baseUrl}/product`, { name, price, ratings, description })
      .then(response => {
        console.log("Response Sent ", response.data);
        setAddProduct(!addProduct)
        console.log('Product added Succesfully 👍')
      })
      .catch(error => {
        console.log('Error occured while adding product ❌', error)
      })
  }
  // ----------------------------- Create Product Function -----------------------------


  // ----------------------------- Get Product Function -----------------------------
  useEffect(() => {
    const allProducts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/products`)
        setProduct(response.data.data)
        console.log('Product fetched Succesfully 👍')
      }
      catch (error) {
        console.log('Error occured while fetching product ❌', error)
      }
    }
    allProducts()

    //   // ---------- Cleanup Function ----------
    return () => { allProducts() }
    //   // ---------- Cleanup Function ----------

  }, [addProduct])
  // ----------------------------- Get Product Function -----------------------------


  // ----------------------------- Delete Product Function -----------------------------
  const deleteFunction = async (id) => {
    try {
      const response = await axios.delete(`${baseUrl}/product/${id}`)
      console.log("response: ", response.data);
      setAddProduct(!addProduct)
      console.log('Product deleted Succesfully 👍')
    } catch (error) {
      console.log('Error occured while deleting product ❌', error)
    }
  }
  // ----------------------------- Delete Product Function -----------------------------


  // ----------------------------- Edit Product Function -----------------------------
  const editFunction = (product) => {
    setEditMode(!editMode)
    setEditProduct(product)
  }

  const editProductFunc = (id) => {
    console.log("first")
    axios.put(`${baseUrl}/product/${id}`, { name, price, ratings, description })
      .then(response => {
        console.log("Response Sent ", response.data);
        setAddProduct(!addProduct)
        console.log('Product edited Succesfully 👍')
        setEditMode(!editMode)

      })
      .catch(error => {
        console.log('Error occured while editing product ❌', error)
      })
  }
  // ----------------------------- Edit Product Function -----------------------------

  return (
    <>
      <form onSubmit={createPost}>
        <h1>Product</h1>
        <h3>
          Name:
          <input placeholder='Enter Product' type="text" onChange={(e) => (setName(e.target.value))} /> <br />
          Price:
          <input placeholder='Enter Product Price' type="number" onChange={(e) => (setPrice(e.target.value))} /> <br />
          Ratings:
          <input placeholder='Enter Product Ratings' type="number" onChange={(e) => (setRatings(e.target.value))} /> <br />
          Description:
          <input placeholder='Enter Product Description' type="text" onChange={(e) => (setDescription(e.target.value))} /> <br />
          <button>Post</button>
        </h3>
      </form>

      <div>
        {product.map((eachProduct, i) =>
        (
          <div key={i}>
            <hr />
            <h2><b>Name</b> :{eachProduct.name}</h2>
            <p><b>ID</b> :{eachProduct.id}</p>
            <p><b>Price</b> :{eachProduct.price}</p>
            <p><b>Ratings</b> :{eachProduct.ratings}</p>
            <p><b>Description</b> :{eachProduct.description}</p>
            <button onClick={() => { deleteFunction(eachProduct.id) }}>Delete</button>
            <button onClick={() => { editFunction(eachProduct, i) }}>Edit</button>
            {
              (editMode && editProduct.id === eachProduct.id) ?
                <>
                  <form onSubmit={(e) => { e.preventDefault(); editProductFunc(editProduct.id) }}>
                    <h5>
                      Edited Name:
                      <input placeholder='Enter Product' type="text" onChange={(e) => (setName(e.target.value))} /> <br />
                      Edited Price:
                      <input placeholder='Enter Product Price' type="number" onChange={(e) => (setPrice(e.target.value))} /> <br />
                      Edited Ratings:
                      <input placeholder='Enter Product Ratings' type="number" onChange={(e) => (setRatings(e.target.value))} /> <br />
                      Edited Description:
                      <input placeholder='Enter Product Description' type="text" onChange={(e) => (setDescription(e.target.value))} /> <br />
                      <button>Post</button>
                    </h5>
                  </form>
                </>
                : null
            }
            <hr />
            <br />
          </div>
        ))}
      </div>
    </>
  )
}

export default App