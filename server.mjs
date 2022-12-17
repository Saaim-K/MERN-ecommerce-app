import express from 'express'
import path from 'path'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express();
const port = process.env.PORT || 4444;
const mongodbURI = process.env.mongodbURI || "mongodb+srv://MERN-Ecommerce:saaimahmedkhan123@cluster0.ztfqhsh.mongodb.net/learn-MongoDB?retryWrites=true&w=majority"

app.use(cors())
app.use(express.json());
mongoose.connect(mongodbURI)

let products = []
// ----------------------------------- MongoDB -----------------------------------
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    ratings: Number,
    description: String,
    createdOn: { type: Date, default: Date.now }
})
const productModel = mongoose.model('Products', productSchema);
// ----------------------------------- MongoDB -----------------------------------



// ----------------------------------- Create/Add Product -----------------------------------
app.post('/product', (req, res) => {
    const body = req.body
    if (!body.name || !body.price || !body.ratings || !body.description) {
        res.status(400).send({
            message: `Required Paramters Missing`
        })
        return;
    }
    productModel.create({
        name: body.name,
        price: body.price,
        ratings: body.ratings,
        description: body.description
    }, (err, saved) => {
        if (!err) {
            console.log("Saved", saved)
            res.send({
                message: `Product Added Succesfully 👍`,
                data: products
            })
        } else {
            res.status(400).send({
                message: `Product Failed`
            })

        }
    });
})
// ----------------------------------- Create/Add Product -----------------------------------


// ----------------------------------- Get Product -----------------------------------
// ------------------------ Get Single Product ------------------------
app.get('/product/:id', (req, res) => {
    const id = req.params.id
    let isFound = false
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            res.send({
                message: `Got the product of the specified id ${products[i].id}`,
                data: products[i]
            })
            isFound = true
            break
        }
    }
    if (!isFound) {
        res.status(400)
        res.send({
            message: `Product Not Found`
        })
    }
})
// ------------------------ Get Single Product ------------------------

// ------------------------ Get All Product ------------------------
app.get('/products', (req, res) => {
    res.send({
        message: `All products`,
        data: products
    })
})
// ------------------------ Get All Product ------------------------
// ----------------------------------- Get Product -----------------------------------


// ----------------------------------- Delete Product -----------------------------------
app.delete('/product/:id', (req, res) => {
    const id = req.params.id
    let isFound = false
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products.splice(i, 1)
            res.send({
                message: `Product deleted Succesfully`
            })
            isFound = true
            break
        }
    } if (!isFound) {
        res.status(404)
        res.send({
            message: `Delete Fail : Product Not Fund`
        })
    }
})
// ----------------------------------- Delete Product -----------------------------------


// ----------------------------------- Update Product -----------------------------------
app.put('/product/:id', (req, res) => {
    const body = req.body
    const id = req.params.id

    if (!body.name || !body.price || !body.ratings || !body.description) {
        res.status(400).send({
            message: `Required Paramters Missing`
        })
        return;
    }

    let isFound = false
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            products[i].name = body.name
            products[i].price = body.price
            products[i].description = body.description
            res.send({
                message: `Product Modified Succesfully`
            })
            isFound = true
            break
        }
    } if (!isFound) {
        res.status(404)
        res.send({
            message: `Update Fail : Product Not Fund`
        })
    }
})
// ----------------------------------- Update Product -----------------------------------

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////


const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './app/build')))
app.use('*', express.static(path.join(__dirname, './app/build')))

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})