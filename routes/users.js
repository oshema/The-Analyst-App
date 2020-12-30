const express = require('express')
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controller/users')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router();

router.use(protect)

router.route('/')
    .get(protect, getUsers)
    .post(createUser, authorize('admin'))

router.route('/:id')
    .get(getUser, authorize('admin'))
    .put(updateUser, authorize('admin'))
    .delete(deleteUser, authorize('admin'))


module.exports = router