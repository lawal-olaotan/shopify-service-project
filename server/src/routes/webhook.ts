
import express from 'express'; 
import { orderController } from '../controllers/orderhook';

/**
 * 
 */
const router = express.Router(); 

/**
 * 
 */
router.post('/order',orderController)


export default router