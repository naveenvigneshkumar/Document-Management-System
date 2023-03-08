const express = require("express");
const router = express.Router();
const {verifyJWT, verifyRole} = require('../middleware/auth.middleware');
const {reviewDoc, download} = require('../controller/review.controller');
const {role} = require("../../config");


router.get('/get/reviewer/list',
    verifyJWT,
    verifyRole(role.reviewer),
    reviewDoc
)
router.get('/get/download',
    verifyJWT,
    verifyRole(role.reviewer),
    download
)



module.exports = router;