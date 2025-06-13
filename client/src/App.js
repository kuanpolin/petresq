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
      `https://petresq-dzsk.onrender.com/match-pet?imageUrl=${uploadData.filename}`
    )
    const matchData = await matchRes.json()

    setResult({ ...uploadData, match: matchData })
  }

  return (
    <>
      <header className="app-header">
        <h1>PetResQ</h1>
      </header>
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
              <p><strong>Status:</strong> {result.match.status}</p>
              <p>
                <strong>Image URL:</strong>{' '}
                <a href={result.match.imageUrl} target="_blank" rel="noopener noreferrer">
                  {result.match.imageUrl}
                </a>
              </p>
              <div className="owner-info">
                <h4>Owner Information</h4>
                <p><strong>Name:</strong> {result.match.owner.name}</p>
                <p><strong>Phone:</strong> {result.match.owner.phone}</p>
                <p><strong>Email:</strong> {result.match.owner.email}</p>
              </div>
            </div>
          )}

          {result && result.error && (
            <p className="error">{result.error}</p>
          )}
        </div>
      </div>
    </>
  )
}


export default App