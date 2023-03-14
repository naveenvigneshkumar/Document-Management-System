const express = require("express");
const router = express.Router();
const {verifyJWT, verifyRole} = require('../middleware/auth.middleware');
const {getDoc, getusers, updateUser, download, reviewstatus} = require('../controller/admin.controller');
const {role} = require("../../config");

router.get('/get/users/list',
    verifyJWT,
    verifyRole(role.admin),
    getusers
)

router.put('/update/user',
    verifyJWT,
    verifyRole(role.admin),
    updateUser
)

router.get('/get/doc/list',
    verifyJWT,
    verifyRole(role.admin),
    getDoc
)

router.put('update/status',
    verifyJWT,
    verifyRole(role.admin),
    reviewstatus
)

router.get('/get/download',
    verifyJWT,
    verifyRole(role.admin),
    download
)



module.exports = router;