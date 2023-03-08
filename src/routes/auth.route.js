const express = require("express");
const router = express.Router();
const {verifyJWT, verifyRole} = require('../middleware/auth.middleware');
const {uploadMiddleware} = require('../middleware/upload.middleware');
const {register, login, uploadFile, reviewDoc} = require('../controller/auth.controller');
const {role} = require("../../config");

router.post('/register',
    register
);


router.post('/login', 
    login
);

router.post('/upload', 
    verifyJWT,
    verifyRole(role.guest),
    uploadFile
)

router.get('/admin',
    verifyJWT,
    verifyRole(role.admin),
    uploadFile
)




module.exports = router;