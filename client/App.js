// client/src/App.js
import React, { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)

  const handleChange = e => {
    const selected = e.target.files[0]
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
    setResult(null)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    const uploadRes = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData
    })
    const uploadData = await uploadRes.json()

    const matchRes = await fetch(
      `http://localhost:3001/match-pet?imageUrl=${uploadData.filename}`
    )
    const matchData = await matchRes.json()

    setResult({ ...uploadData, match: matchData })
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Upload an Image</h2>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleChange} />
          {preview && <img className="preview" src={preview} alt="Preview" />}
          <button type="submit" disabled={!file}>Upload</button>
        </form>
        {result?.match && (
          <div className="match-result">
            <h3>Match Result</h3>
            <pre>{JSON.stringify(result.match, null, 2)}</pre>
          </div>
        )}
        {result && result.error && (
          <p className="error">{result.error}</p>
        )}
      </div>
    </div>
  )
}

export default App