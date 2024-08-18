
import express from 'express'; 
import { getOrderItem, createOrder} from '../controllers/order';

/**
 * 
 */
const router = express.Router(); 

/**
 * 
 */
router.get('/',getOrderItem)

router.post('/',createOrder)


export default router