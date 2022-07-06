const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())

const produk = require("./router/produk")

app.use("/store/api/v1/produk", produk)


app.use(express.static(__dirname))

app.listen(7880, () => {
    console.log("Server run on port 7880");
})
