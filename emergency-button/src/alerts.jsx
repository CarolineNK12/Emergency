import { useEffect, useState } from 'react'
import './App.css'

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // An array of distances to cycle through dynamically
  const mockDistances = ['4.5km', '1.2km', '8.0km', '0.5km', '12km'];

  useEffect(() => {
    const controller = new AbortController()

    async function loadAlerts() {
      try {
        const response = await fetch('http://localhost:5000/api/alerts', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load alerts')
        }

        const data = await response.json()
        setAlerts(data.alerts || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Could not load alerts right now.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadAlerts()

    return () => controller.abort()
  }, [])

  return (
    <section className="alerts-page">
      <div className="alerts-header">
        <p className="alerts-eyebrow">Live updates</p>
        <h1>Emergency Alerts</h1>
        <p>Alerts currently stored in the backend database.</p>
      </div>

      {loading && <p className="alerts-status">Loading alerts...</p>}
      {error && <p className="alerts-status alerts-status--error">{error}</p>}

      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <article key={alert.id} className="alerts-card">
            <div className="alerts-card__top">
              <div>
                <h2>{alert.name}</h2>
                {/* Notice how we use the index to assign a different distance to each alert */}
                <p className="alerts-area">
                  {alert.area || 'Area not listed'} • <strong>{mockDistances[index % mockDistances.length]} away</strong>
                </p>
              </div>
              <span className="alerts-severity">{alert.severity || 'Unknown'}</span>
            </div>
          </article>
        ))}

        {!loading && alerts.length === 0 && !error && (
          <p className="alerts-status">No alerts found.</p>
        )}
      </div>
    </section>
  )
}

export default Alerts