import { useEffect, useState } from 'react'
import './App.css'

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedAlert, setExpandedAlert] = useState(null)

  const mockDistances = ['4.5km', '1.2km', '8.0km', '0.5km', '12km'];

  // Expanded instructions to cover all database alert types
const getInstructions = (alertName) => {
  const name = alertName.toLowerCase();
  
    if (name.includes('earthquake')) {
      return "Drop, Cover, and Hold On. Stay away from windows and outside doors. If you are outdoors, move to an open area away from trees and buildings.";
    } else if (name.includes('flood')) {
      return "Avoid walking or driving through floodwaters. Move to higher ground immediately. Turn off utilities at the main switches if instructed.";
    } else if (name.includes('tsunami')) {
      return "Move to higher ground or inland immediately. Do not wait for official warnings if you feel a strong earthquake near the coast.";
    } else if (name.includes('fire') || name.includes('wild fire')) {
      return "Evacuate the area immediately. Stay low to the ground to avoid smoke inhalation. Close doors behind you to slow the spread.";
    } else if (name.includes('landslide')) {
      return "Move away from the path of the landslide immediately. If you cannot escape, curl into a tight ball and protect your head.";
    } else if (name.includes('volcanic') || name.includes('volcano')) {
      return "Follow evacuation orders. Wear long sleeves, pants, goggles, and a dust mask to protect against ash. Avoid river valleys and low-lying areas.";
    } else {
      return "Stay calm and follow instructions from local authorities. Keep your emergency kit nearby and stay tuned to local news updates.";
    }
  };

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

  const toggleAlert = (id) => {
    setExpandedAlert(expandedAlert === id ? null : id);
  }

  return (
    <section className="alerts-page">
      <div className="alerts-header">
        <p className="alerts-eyebrow">Live updates</p>
        <h1>Emergency Alerts</h1>
        <p>Tap an alert to see survival instructions and proximity.</p>
      </div>

      {loading && <p className="alerts-status">Loading alerts...</p>}
      {error && <p className="alerts-status alerts-status--error">{error}</p>}

      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <article 
            key={alert.id} 
            className={`alerts-card ${expandedAlert === alert.id ? 'alerts-card--expanded' : ''}`}
            onClick={() => toggleAlert(alert.id)}
          >
            <div className="alerts-card__top">
              <div className="alerts-card__info">
                <div className="live-indicator">
                  <span className="pulsing-dot"></span> 
                  <span className="live-text">LIVE NOW</span>
                  <span className="distance-text">• {mockDistances[index % mockDistances.length]} away</span>
                </div>
                
                <h2>{alert.name}</h2>
                <p className="alerts-area">
                  {alert.area || 'Area not listed'} 
                </p>
              </div>
              <span className="alerts-severity">{alert.severity || 'Unknown'}</span>
            </div>

            {expandedAlert === alert.id && (
              <div className="alerts-card__content">
                <h4>What to do:</h4>
                <p>{getInstructions(alert.name)}</p>
              </div>
            )}
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