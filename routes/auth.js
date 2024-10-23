import {Router}  from 'express'
import bcrypt from 'bcryptjs'
import { sql } from '../db/neon.js'
import jwt from 'jsonwebtoken'

export const authRouter = Router()



/**
 * @swagger
 * /register:
 *  post:
 *      summary: Register a new customer
 *      tags: [auth]
 *      requestBody:
 *         required: true
 *         description: Body of request
 *         content:
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                          format: email
 *                          description: User email
 *                      password:
 *                          type: string
 *                          description: User password
 *                          required: true
 *                  required:
 *                      - email
 *                      - password
 *      responses:
 *          200: 
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message: 
 *                                  type: string
 *                                  description: Message of success
 *                              token:
 *                                  type: string
 *                                  description: JWT token
 *          400:
 *              description: Bad request
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message: 
 *                                  type: string
 *                                  description: Message of bad request
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message: 
 *                                  type: string
 *                                  description: Message of internal server error

 */
authRouter.post('/register', async (req, res) => {
    try{

        const{email, password, passwordConfirmation} = req.body

        if(password !== passwordConfirmation){
            return res.status(400).json({message: 'Passwords do not match'})
        }

        const hashedPassword = bcrypt.hashSync(password, 10)

        await sql`INSERT into usuarios (email, password) values (${email}, ${hashedPassword})`

        return res.status(200).json({message: 'User registered'})
        
    } catch(error){
        return res.status(500).json({message: 'Internal server error'})
    }
})

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login a user
 *      tags: [auth]
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email: 
 *                              type: string
 *                              format: email
 *                              required: true
 *                          password:
 *                              type: string
 *                              required: true
 *      responses:
 *          200:
 *              description: Success
 *              headers:
 *                  Set-Cookie:
 *                      schema:
 *                          type: string
 *                          example: TOKEN=JWTTOKENHERE; Path=/; HttpOnly
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Success
 *                              token:
 *                                  type: string
 *                                  description: JWT token for authentication
 *          400:
 *              description: Invalid credentials
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Invalid credentials
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Internal server error
 */



authRouter.post('/login', async(req, res) => {
    try {
        const {email, password} = req.body

        const [user] = await sql`SELECT * FROM usuarios WHERE email = ${email}`

        if(!user){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        if(!bcrypt.compareSync(password, user.password)){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const token = jwt.sign({id: user.id, role: user.role, email: user.email}, 'secret', {
            expiresIn: '1h'
        })
        
        res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'none', expires: new Date(Date.now() + 1000 * 60 * 60 * 24.)})

        return res.status(200).json({
            message: 'Success',
            token
        })

    } catch(error){
        return res.status(500).json({message: 'Internal server error'})
    }
})
