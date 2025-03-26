const express = require('express');
const router = express.Router();
const categoryModel = require('../schemas/category');
const { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');

// 🟢 GET - không cần đăng nhập
router.get('/', async function (req, res, next) {
  let categories = await categoryModel.find({ isDeleted: false });
  CreateSuccessRes(res, categories, 200);
});

router.get('/:id', async function (req, res, next) {
  try {
    let category = await categoryModel.findOne({
      _id: req.params.id,
      isDeleted: false
    });
    CreateSuccessRes(res, category, 200);
  } catch (error) {
    next(error);
  }
});

// 🟡 POST - mod
router.post(
  '/',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body;
      let newCategory = new categoryModel({
        name: body.name,
      });
      await newCategory.save();
      CreateSuccessRes(res, newCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🟡 PUT - mod
router.put(
  '/:id',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let updatedInfo = {};
      if (req.body.name) updatedInfo.name = req.body.name;

      let updateCategory = await categoryModel.findByIdAndUpdate(
        req.params.id,
        updatedInfo,
        { new: true }
      );
      CreateSuccessRes(res, updateCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🔴 DELETE - admin
router.delete(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let deletedCategory = await categoryModel.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );
      CreateSuccessRes(res, deletedCategory, 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
