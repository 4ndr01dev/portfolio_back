import express from 'express';
import fs from 'fs';
import path from 'path';
import { Technology } from './types/Technologies';

const cors = require('cors');
const pool = require('./db/connection')

const app = express();

app.use(cors())

const PORT = 8000;

app.get('/test', async (req, res) => {
  const filePath = path.join(__dirname, './assets/cv_alvaro_andrade_2023_fs.pdf');
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    res.setHeader('Content-Type', 'application/pdf');
    res.download(filePath);
  } catch (error) {
    console.error('Archivo no encontrado:', error);
    res.status(404).send('Archivo no encontrado');
  }
});

app.get('/', (req, res) => {
  console.log('Descargando archivo');
  res.send('Descargando archivo desde la ruta raíz');
})

app.post('/post_technology_test', async (req, res) => {
  const technologyData: Technology = {
    name: "Angular",
    hasCertify: false,
    hasCourse: true,
    courses: [
      {
        name: "Angular - The Complete Guide",
        school: "Udemy",
        year: 2021
      }
    ],
    description: "Angular es un marco de trabajo para aplicaciones web desarrollado por Google, que utiliza TypeScript como principal lenguaje de programación.",
    index: 11,
    imageUrl: "https://angular.io/assets/images/logos/angular/angular.svg"
  };
  try {

    const newTechnology = await pool.query(
      "INSERT INTO technologies(technology_name,has_certify, has_course, description, image_url) \
      VALUES ($1, $2, $3, $4, $5 ) RETURNING * ",
      [technologyData.name, technologyData.hasCertify, technologyData.hasCourse,
      technologyData.description, technologyData.imageUrl,]
    )
    const technologyID = newTechnology.rows[0].id
    if (technologyData.hasCourse && technologyData.courses && technologyData.courses.length) {
      technologyData.courses.map(async (course) => {
        const isDone = course.isDone === undefined ? false : course.isDone;
        await pool.query(' INSERT INTO courses (course_name, school, course_year, technology_id, is_done) \
      VALUES ($1, $2,$3, $4, $5)\
      ',
          [course.name, course.school, course.year, technologyID, isDone ])
      })
    }

    console.log(' ID de tecnología ', technologyID)
    res.status(201).json(newTechnology.rows[0])
  } catch (error) {
    console.error('Error to try to add a new technology')
    res.status(500).json({ error: 'Error to try to add a new technology' })
  }
})

app.listen(PORT, () => {
  console.log(`Server corriendo en https://localhost:${PORT}`);
});