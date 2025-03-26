const express = require('express');
const router = express.Router();
const productModel = require('../schemas/products');
const categoryModel = require('../schemas/category');
const { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');

// 🟢 GET - Không cần đăng nhập
router.get('/', async function (req, res, next) {
  let products = await productModel.find({ isDeleted: false }).populate("category");
  CreateSuccessRes(res, products, 200);
});
router.get('/:id', async function (req, res, next) {
  try {
    let product = await productModel.findOne({ _id: req.params.id, isDeleted: false });
    CreateSuccessRes(res, product, 200);
  } catch (error) {
    next(error);
  }
});

// 🟡 POST - MOD
router.post(
  '/',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body;
      let category = await categoryModel.findOne({ name: body.category });
      if (category) {
        let newProduct = new productModel({
          name: body.name,
          price: body.price,
          quantity: body.quantity,
          category: category._id
        });
        await newProduct.save();
        CreateSuccessRes(res, newProduct, 200);
      } else {
        throw new Error("cate khong ton tai");
      }
    } catch (error) {
      next(error);
    }
  }
);

// 🟡 PUT - MOD
router.put(
  '/:id',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body;
      let updatedInfo = {};
      if (body.name) updatedInfo.name = body.name;
      if (body.price) updatedInfo.price = body.price;
      if (body.quantity) updatedInfo.quantity = body.quantity;
      if (body.category) updatedInfo.category = body.category;

      let updateProduct = await productModel.findByIdAndUpdate(
        req.params.id,
        updatedInfo,
        { new: true }
      );
      CreateSuccessRes(res, updateProduct, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🔴 DELETE - ADMIN
router.delete(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let updateProduct = await productModel.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );
      CreateSuccessRes(res, updateProduct, 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
