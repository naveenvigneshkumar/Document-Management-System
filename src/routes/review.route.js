const express = require("express");
const router = express.Router();
const {verifyJWT, verifyRole} = require('../middleware/auth.middleware');
const {reviewDoc, download, reviewstatus, getDoc} = require('../controller/review.controller');
const {role} = require("../../config");


router.get('/get/reviewer/list',
    verifyJWT,
    verifyRole(role.reviewer),
    reviewDoc
)

router.put('/status',
    verifyJWT,
    verifyRole(role.reviewer),
    reviewstatus
)

router.get('/get/download',
    verifyJWT,
    verifyRole(role.reviewer),
    download
)

router.get('/get/doc',
    verifyJWT,
    verifyRole(role.reviewer),
    getDoc
)


module.exports = router;