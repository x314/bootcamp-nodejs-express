const express = require("express")

const ProductsServices = require("../services/products")
const validatorHandler = require("../middlewares/validator.handler")
const { createProductSchema, readProductSchema, updateProductSchema } = require("../schemas/products")

const router = express.Router()
const service = new ProductsServices()

router.get("/", (req, res) => {
  const products = service.find()

  res.json(products)
})

router.get("/filter", (req, res) => {
  res.send("Soy filter")
})

router.get("/:id",
  validatorHandler(readProductSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const product = await service.findOne(id)

      res.json(product)
    } catch (error) {
      next(error)
    }
  })

router.post("/",
  validatorHandler(createProductSchema, "body"),
  async (req, res) => {
    const body = req.body
    const newProduct = await service.create(body)

    res.json(newProduct)
  })

router.patch("/:id",
  validatorHandler(readProductSchema, "params"),
  validatorHandler(updateProductSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params
      const body = req.body
      const product = await service.update(id, body)

      res.json(product)
    } catch (error) {
      next(error)
    }

  })

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  const product = await service.delete(id)

  res.json(product)
})

module.exports = router
