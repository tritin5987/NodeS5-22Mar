const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roles');
const { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const constants = require('../utils/constants');

// 🟢 GET - không yêu cầu quyền
router.get('/', async function (req, res, next) {
  let roles = await roleController.GetAllUser();
  CreateSuccessRes(res, roles, 200);
});

// 🔒 POST - chỉ admin
router.post(
  '/',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let newRole = await roleController.CreateARole(req.body.name);
      CreateSuccessRes(res, newRole, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🔒 PUT - chỉ admin
router.put(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let updated = await roleController.UpdateARole(req.params.id, req.body.name);
      CreateSuccessRes(res, updated, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🔒 DELETE - chỉ admin
router.delete(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let deleted = await roleController.DeleteARole(req.params.id);
      CreateSuccessRes(res, deleted, 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
