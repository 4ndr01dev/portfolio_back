import express from 'express';
const cors = require('cors');
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors())
const PORT = 8000;

app.get('/test', async (req, res) => {
    const filePath = path.join(__dirname, './assets/cv_alvaro_andrade_2023_fs.pdf');
    console.log('Descargando archivo', filePath);

    try {
        await fs.promises.access(filePath, fs.constants.F_OK);  // Verifica si el archivo existe
        res.setHeader('Content-Type', 'application/pdf');
        res.download(filePath);  // Esto inicia la descarga del PDF
    } catch (error) {
        console.error('Archivo no encontrado:', error);
        res.status(404).send('Archivo no encontrado');
    }
});
app.get('/',(req,res)=>{
    console.log('Descargando archivo');
    res.send('Descargando archivo desde la ruta raíz');
})

app.listen(PORT, () => {
    console.log(`Server corriendo en https://localhost:${PORT}`);
});