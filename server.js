// server.js
import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

const upload = multer({ dest: 'uploads/' })

app.get('/', (req, res) => {
  res.send('API server is running')
})

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  res.json({ success: true, filename: req.file.filename })
})

app.get('/match-pet', async (req, res, next) => {
  try {
    const { imageUrl } = req.query
    if (!imageUrl) {
      return res.status(400).json({ error: 'No imageUrl provided' })
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${imageUrl}`
    const response = await fetch(
      `https://petresq.onrender.com/api/match-pet?imageUrl=${encodeURIComponent(fileUrl)}`
    )
    const data = await response.json()
    res.json(data)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Server error')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)