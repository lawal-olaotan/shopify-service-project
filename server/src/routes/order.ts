
import express from 'express'; 
import { getOrderItem, createOrder, lookUp} from '../controllers/order';

/**
 * 
 */
const router = express.Router(); 

/**
 * 
 */
router.get('/',getOrderItem)
router.post('/lookup',lookUp)

router.post('/',createOrder)


export default router