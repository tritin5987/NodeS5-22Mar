const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { check_authentication, check_authorization } = require('../utils/check_auth');
const { CreateSuccessRes } = require('../utils/responseHandler');
const constants = require('../utils/constants');

// 🔒 GET all users - mod
router.get(
  '/',
  check_authentication,
  check_authorization(constants.MOD_PERMISSION),
  async function (req, res, next) {
    try {
      let users = await userController.GetAllUsers();
      CreateSuccessRes(res, users, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🔒 GET user by id - mod (nếu khác chính mình), hoặc ai cũng được nếu là chính mình
router.get(
  '/:id',
  check_authentication,
  async function (req, res, next) {
    try {
      const requestedId = req.params.id;
      const currentUserId = req.user._id.toString();

      // Nếu là chính mình → cho phép
      if (requestedId === currentUserId) {
        const user = await userController.GetAllUsersByID(requestedId);
        return CreateSuccessRes(res, user, 200);
      }

      // Nếu không phải chính mình → cần mod trở lên
      if (!constants.MOD_PERMISSION.includes(req.user.role.name)) {
        throw new Error("Bạn không có quyền xem thông tin người khác");
      }

      const user = await userController.GetAllUsersByID(requestedId);
      CreateSuccessRes(res, user, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🔒 POST create user - admin
router.post(
  '/',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let body = req.body;
      let user = await userController.CreateAnUser(
        body.username, body.password, body.email, body.role
      );
      CreateSuccessRes(res, user, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🔒 PUT update user - admin
router.put(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let user = await userController.UpdateAnUser(req.params.id, req.body);
      CreateSuccessRes(res, user, 200);
    } catch (error) {
      next(error);
    }
  }
);

// 🔒 DELETE user - admin
router.delete(
  '/:id',
  check_authentication,
  check_authorization(constants.ADMIN_PERMISSION),
  async function (req, res, next) {
    try {
      let user = await userController.DeleteAnUser(req.params.id);
      CreateSuccessRes(res, user, 200);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
