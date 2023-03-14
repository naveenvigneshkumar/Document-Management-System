const supertest = require('supertest');
const {createServer}= require('../app.js')
const app = createServer();
const {connect, closeDatabase, clearDatabase}= require('../db.js')
// const {MongoMemoryServer} = require('mongodb-memory-server');
// const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const users = require('../model/users')
const uploadmodel = require('../model/upload')
const {baseUrl, adminEmail, reviewerEmail} = require('../../config');
const path = require('path');

const accessToken = [];

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await connect());

/**
 * Clear all test data after every test.
 */
  afterAll(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */
// afterAll(async () => await closeDatabase());


describe("adminregister",()=>{
    
    describe("add admin login",()=>{
        it('it should return 201',async()=>{
            let registerPayload = {
                    "name": "admin",
                    "email": adminEmail,
                    "password": "123456789",
            }
            const res = await supertest(baseUrl).post("v1/register").send(registerPayload);
            
            expect(res.statusCode).toBe(201);
        })
    })


    describe("add guest user",()=>{
        it('it should return 201',async()=>{
            let registerPayload = {
                    "name": "guest2",
                    "email": "guest2@yopmail.com",
                    "password": "123456789",
            }
            
            const res = await supertest(baseUrl).post("v1/register").send(registerPayload);
            
            expect(res.statusCode).toBe(201);
        })
    })

    describe("add reviewer user",()=>{
        it('it should return 201',async()=>{
            let registerPayload = {
                    "name": "reviewer1",
                    "email": reviewerEmail,
                    "password": "123456789",
            }
            
            const res = await supertest(baseUrl).post("v1/register").send(registerPayload);
            
            expect(res.statusCode).toBe(201);
        })
    })
})

 describe("adminlogin",()=>{ 
    describe('give correct admim login and generate token',()=>{
        it('login admin',async()=>{
            let loginPayload = {
                                email: adminEmail,
                                password: "123456789"
                            }
            const res = await supertest(baseUrl).post('v1/login').send(loginPayload);
            expect(res.statusCode).toBe(200);
            accessToken.push({'adminToken': res._body.result.token});
        })
    })
    describe('Update guest user status',()=>{
        it('update status api',async()=>{
            let findUser = await users.findOne({email:"guest2@yopmail.com"}).select('id status');
            const res = await supertest(baseUrl).put(`v1/admin/update/user?id=${findUser.id}`).set('Authorization', 'Bearer ' + accessToken[0].adminToken).send({"status":"active"});
            expect(res.statusCode).toBe(200);
        })
    })
    describe('Update reviewer user status',()=>{
        it('update status api',async()=>{
            let findUser = await users.findOne({email:reviewerEmail}).select('id status');
            const res = await supertest(baseUrl).put(`v1/admin/update/user?id=${findUser.id}`).set('Authorization', 'Bearer ' + accessToken[0].adminToken).send({"status":"active", "role":"reviewer"});
            expect(res.statusCode).toBe(200);
        })
    })
 });


describe("login as guest user",()=>{
    const accessToken = [];
    describe("give correct payload and generate token",()=>{
        it("should return 200",async ()=>{
            let upd = await users.findOneAndUpdate({email:"guest2@yopmail.com"},{$set:{status:"active"}});
            let loginPayload = {
                                email: "guest2@yopmail.com",
                                password: "123456789"
                            }
            const res = await supertest(baseUrl).post('v1/login').send(loginPayload);
             
            expect(res.statusCode).toBe(200);
            accessToken.push({'guestToken': res._body.result.token})
        })
    })
    
    describe("give incorrect payload",()=>{
        it("it should return 404",async()=>{
            let loginPayload = {
                email: "unknown@yopmail.com",
                password: "123456789"
            }
            const res = await supertest(baseUrl).post('v1/login').send(loginPayload);
            
            expect(res.statusCode).toBe(404);
            
        })
    })

    describe("upload file",()=>{
        it("it should return 200",async()=>{
            let sampleFile = path.join(__dirname,"/sampleFile/sample-doc.doc");
           
            const res = await supertest(baseUrl).post('v1/upload').set('Authorization', 'Bearer ' + accessToken[0].guestToken).attach('uploadFile', sampleFile);
           
            expect(res.statusCode).toBe(200);
        })
    })

 });


describe('login as reviewer',()=>{
    describe("login as reviewer and generate token",()=>{
        it('it should return 200',async()=>{
            let loginPayload = {
                email: reviewerEmail,
                password: "123456789"
            }
            const res = await supertest(baseUrl).post('v1/login').send(loginPayload);
            expect(res.statusCode).toBe(200);
            accessToken.push({'reviewerToken': res._body.result.token});            
        })
    })

    describe("change doc status",()=>{
        it('update doc status by reviewer',async()=>{
            let findreviewer = await users.findOne({email:reviewerEmail}).select('_id');
            let findApproveList = await uploadmodel.findOne({reviewerId: findreviewer, status: "unapproved"}).select('id')
            const res = await supertest(baseUrl).put(`v1/review/status?file=${findApproveList.id}`).set('Authorization', 'Bearer ' + accessToken[0].reviewerToken).send({ "action": "approved"})
        })
    })
})


