import express from 'express';

const router = express.Router();

router.get('/status', (req, res) => {
    try {
       return res.status(200).json({ message: 'Servidor está funcionando' });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do sistema !' });
    }
  
});

export default router;