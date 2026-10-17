import { Router } from 'express';
import { shipmentController } from '../controllers/shipment.controller';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Protect all shipment routes with JWT authentication middleware
router.use(authenticateToken);

router.post('/', shipmentController.createShipment);
router.get('/', shipmentController.getAllShipments);
router.get('/:id', shipmentController.getShipment);
router.get('/:id/history', shipmentController.getShipmentHistory);
router.put('/:id/accept', shipmentController.acceptShipment);
router.post('/:id/telemetry', shipmentController.recordTelemetry);
router.put('/:id/receive', shipmentController.receiveShipment);

export default router;
