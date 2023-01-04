const { Int32, ObjectId } = require('bson')
var express = require('express')
const { login,insertProduct,getAllProducts,
        deleteProductById,updateProduct,findProductById,searchProductByName } = require('./databaseHandler')
var app = express()

app.set('view engine','hbs')
app.use(express.urlencoded({extended:true}))



app.post('/search',async (req,res)=>{
    const search = req.body.search
    const results = await searchProductByName(search)
    console.log(results)
    res.render('view',{'results':results})
})

app.post('/edit',async (req,res)=>{
    const id = req.body.id
    const name = req.body.txtName
    const price = req.body.txtPrice
    const picture = req.body.txtPic
    await updateProduct(id, name, price, picture)
    res.redirect('/view')
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id
    const productToEdit = await findProductById(id)
    res.render('edit',{product:productToEdit})
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    await deleteProductById(id)
    res.redirect('/view')
})

app.get('/view',async (req,res)=>{
    const results = await getAllProducts()
    res.render('view',{'results':results})
})

app.post('/new',async (req,res)=>{
    let name = req.body.txtName
    let price = req.body.txtPrice
    let picture = req.body.txtPic
    let newProduct = {
        name : name,
        price: Number.parseInt(price) ,
        pictureURL: picture
    }
    if (name.length == 0) {
        var result = await getAllProducts
        res.render('newProduct', { products: result, nameError: 'Phai nhap Name!' })
    }
    else if (price.length == 0) {
        var result = await getAllProducts
        res.render('newProduct', { products: result, priceError: 'Phai nhap price!' })
    }
    else if (picture.length == 0) {
        var result = await getAllProducts
        res.render('newProduct', { products: result, nameError:null, pictureError: "Vui Long Nhap Lai!" })
    }
    
    else {
    let newId = await insertProduct(newProduct)
    console.log(newId.insertedId)
    res.render('home')
    }
})

app.get('/new',(req,res)=>{
    res.render('newProduct')
})

app.get('/',(req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log("Server is running on: ", PORT)
})