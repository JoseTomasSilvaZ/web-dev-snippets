import {Router} from 'express'
import { sql } from '../db/neon.js'


export const productsRouter = Router()

/**
 * @swagger
 * /products:
 *  get:
 *      summary: Get all products
 *      tags: [products]
 *      security: 
 *          - cookieAuth: []  # Requiere autenticación por cookie
 *      responses:
 *          200: 
 *              description: Success
 *              content:
 *                 application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          products:
 *                              type: array
 *                              description: List of products
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: integer
 *                                          description: Product ID
 *                                      price:
 *                                          type: number
 *                                          format: float
 *                                          description: Product price
 *                                      stock:
 *                                          type: integer
 *                                          description: Stock quantity
 *          500:
 *              description: Internal server error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message: 
 *                                  type: string
 *                                  description: Internal server error
 */

productsRouter.get('/products', async(req, res) => {
        try {
        const products = await sql`SELECT * FROM products`
        return res.status(200).json({
            products
        })
        } catch(error){
            return res.status(500).json({
                message: 'Internal server error'
            })
        }
})

/**
 * @swagger
 * /products:
 *  post:
 *      summary: Create a product
 *      tags: [products]
 *      security:
 *          - cookieAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              required: true
 *                          description: 
 *                              type: string
 *                              required: true
 *                          price: 
 *                              type: number
 *                              required: true
 *                          category:
 *                              type: string
 *                              required: true
 *                          stock:
 *                              type: number
 *                              required: true   
 *      responses:
 *          201:
 *              description: Product created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              product:
 *                                  type: object
 *                                  properties:
 *                                      id: 
 *                                          type: number
 *                                      name:
 *                                          type: string
 *                                      description:
 *                                          type: string
 *                                      price:
 *                                          type: number
 *                                      category:
 *                                          type: string
 *                                      stock:
 *                                          type: number
 *          500:
 *              description: Internal server error
 */
productsRouter.post('/products', async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const [product] = await sql`
            INSERT INTO products (name, description, price, category, stock)
            VALUES (${name}, ${description}, ${price}, ${category}, ${stock})
            RETURNING *`;

        return res.status(201).json({
            message: 'Product created',
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);  
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message 
        });
    }
});

/**
 * @swagger
 * /products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags: [products]
 *      security:
 *          - cookieAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: integer
 *            required: true
 *            description: The ID of the product to retrieve
 *      responses:
 *          200:
 *              description: Product retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              product:
 *                                  type: object
 *                                  properties:
 *                                      id: 
 *                                          type: integer
 *                                      name:
 *                                          type: string
 *                                      description:
 *                                          type: string
 *                                      price:
 *                                          type: number
 *                                      category:
 *                                          type: string
 *                                      stock:
 *                                          type: integer
 *          404:
 *              description: Product not found
 *          500:
 *              description: Internal server error
 */

productsRouter.get('/products/:id', async(req, res) => {
    try {
        const id = req.params.id
        const [product] = await sql`SELECT * FROM products WHERE id = ${id}`

        return res.json({
            product
        })

        
    } catch(error){
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
})
