import { useState, useEffect } from 'react'
import './App.css'
import Home from './home.jsx'

// 1. Quick Steps data (original)
const guideSteps = [
  {
    title: 'Stay calm',
    text: 'Pause, breathe, and focus on the next safe step before acting.',
  },
  {
    title: 'Call for help',
    text: 'Use the emergency button or call your local emergency number right away.',
  },
  {
    title: 'Share essentials',
    text: 'Tell the responder your location, injuries, and any urgent needs.',
  },
]

// 2. Dummy Data for Step-by-Step Manual with Sidebar
const firstAidProcedures = {
  cpr: {
    title: 'Cardiopulmonary Resuscitation (CPR)',
    description: 'Use when a person is unresponsive and not breathing normally.',
    steps: [
      'Ensure the area is safe for both you and the victim.',
      'Check responsiveness: tap their shoulder and shout, "Are you okay?".',
      'Call 112 immediately and place the phone on speaker next to you.',
      'Place your hands in the center of the chest and perform rapid, deep compressions (100–120 per minute to the beat of "Stayin\' Alive").',
      'If trained, alternate 30 compressions with 2 rescue breaths.',
    ],
  },
  fainting: {
    title: 'Fainting (Syncope)',
    description: 'Use when a person temporarily loses consciousness.',
    steps: [
      'Lay the person flat on their back.',
      'Elevate their legs about 30 cm (12 inches) to restore blood flow to the brain.',
      'Loosen any tight clothing (collars, belts).',
      'Ensure they get plenty of fresh air (open windows, disperse crowds).',
      'If they do not wake up within a minute, call emergency services immediately.',
    ],
  },
  stab: {
    title: 'Stabbing & Severe Bleeding',
    description: 'Critical steps to control hemorrhage and maintain stabilization.',
    steps: [
      'Put on gloves if available, and identify the source of bleeding.',
      'DO NOT remove the knife or object if it is still embedded (it acts as a plug).',
      'Apply direct, firm pressure on the wound with a clean cloth (or around the object if it is still inside).',
      'Keep the person lying down and wrap them in a blanket to prevent shock.',
      'Monitor breathing continuously until paramedics arrive.',
    ],
  },
}

function GuidePage({ onNavigate }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('quick')
  const [selectedProcedure, setSelectedProcedure] = useState('cpr')

  // Live Database States for Quiz
  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

  // ==========================================
  // 10-LEVEL SIMULATOR PROGRESSION CONFIG
  // ==========================================
  const levelsConfig = [
    { id: 1, name: 'Basics & SOS Universal Call', count: 1, icon: '⭐' },
    { id: 2, name: 'Cardiopulmonary CPR Steps', count: 2, icon: '❤️' },
    { id: 3, name: 'Airway Choking Hazards', count: 1, icon: '🤢' },
    { id: 4, name: 'Hemorrhage & Severe Bleeding', count: 2, icon: '🩹' },
    { id: 5, name: 'Preventing Trauma Shock', count: 1, icon: '🥶' },
    { id: 6, name: 'Fainting & Syncope Care', count: 2, icon: '💧' },
    { id: 7, name: 'Thermal Burn Grades', count: 1, icon: '🔥' },
    { id: 8, name: 'Fracture Splinting Skills', count: 1, icon: '🦴' },
    { id: 9, name: 'Poisoning Poison Hazards', count: 2, icon: '🧪' },
    { id: 10, name: 'Elite First Aid Master', count: 3, icon: '🏅' }
  ];

  // Interactive Quiz States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizView, setQuizView] = useState('map')

  // Gamification Tracking States
  const [currentLevel, setCurrentLevel] = useState(1)
  const [unlockedLevels, setUnlockedLevels] = useState([1]) // Level 1 open by default

  // Helper calculation to pull the exact slice of questions for the current level
  const getLevelQuestions = () => {
    let startIndex = 0;
    for (let i = 0; i < currentLevel - 1; i++) {
      startIndex += levelsConfig[i].count;
    }
    const currentCount = levelsConfig[currentLevel - 1]?.count || 1;
    return questions.slice(startIndex, startIndex + currentCount);
  };

  const activeQuestions = getLevelQuestions();

  useEffect(() => {
    if (activeTab === 'quiz') {
      setIsLoading(true)
      setApiError(null)
      
      fetch('http://localhost:5000/api/questions')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to connect to backend server')
          return res.json()
        })
        .then((data) => {
          if (data.questions && data.questions.length > 0) {
            // Transform the flat database fields into structural arrays for the frontend UI
            const formattedQuestions = data.questions.map((q) => {
              // Filter out any null database answers safely
              const options = [q.answer1, q.answer2, q.answer3, q.answer4].filter(Boolean)
              
              // Robustly find the correct index by comparing lowercase strings
              const correctIndex = options.findIndex(
                opt => String(opt).toLowerCase().trim() === String(q.realanswer).toLowerCase().trim()
              )
              
              return {
                id: q.id,
                question: q.question,
                type: options.length > 0 ? 'multiple_choice' : 'text_input',
                options: options,
                answerIndex: correctIndex !== -1 ? correctIndex : 0,
                realAnswer: q.realanswer, 
                successMessage: q.successmessage || 'Great job!'
              }
            })
            setQuestions(formattedQuestions)
          } else {
            setQuestions([])
          }
          setIsLoading(false)
        })
        .catch((err) => {
          setApiError(err.message)
          setIsLoading(false)
        })
    }
  }, [activeTab])

  // Reset helper when restarting the quiz game
  const restartQuiz = () => {
    setCurrentQuestionIdx(0)
    setSelectedOption(null)
    setIsSubmitted(false)
    setScore(0)
    setQuizFinished(false)
  }

  const handleOptionSelect = (optionIdx) => {
    if (isSubmitted) return
    setSelectedOption(optionIdx)
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null || selectedOption === '') return
    setIsSubmitted(true)
    
    const currentQ = activeQuestions[currentQuestionIdx]
    let isCorrect = false
    
    // UPDATED VALIDATION CHECKER: Safely checks string content directly
    if (currentQ.type === 'multiple_choice') {
      isCorrect = String(currentQ.options[selectedOption]).toLowerCase().trim() === String(currentQ.realAnswer).toLowerCase().trim()
    } else {
      isCorrect = String(selectedOption).toLowerCase().trim() === String(currentQ.realAnswer).toLowerCase().trim()
    }
    
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1)
      setSelectedOption(null)
      setIsSubmitted(false)
    } else {
      setQuizFinished(true)
      
      // SUCCESSFUL LEVEL END: Append the next consecutive tier to the unlocked checklist!
      const nextLevelId = currentLevel + 1
      if (nextLevelId <= 10 && !unlockedLevels.includes(nextLevelId)) {
        setUnlockedLevels((prev) => [...prev, nextLevelId])
      }
    }
  }

  return (
    <>
      <section id="center">
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.8rem', fontWeight: 600 }}>
            Interactive safety space
          </p>
          <h1>Learn, Practice, and Respond.</h1>
          <p>
            Toggle between quick response essentials, complete first aid procedures, or practice vital survival simulations.
          </p>
        </div>

        {/* 3 Layout Tab Control Toggles */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
          <button 
            type="button" 
            className="counter" 
            style={{ 
              borderColor: activeTab === 'quick' ? 'var(--accent)' : 'transparent',
              fontWeight: activeTab === 'quick' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('quick')}
          >
            ⚡ Quick Steps
          </button>
          <button 
            type="button" 
            className="counter" 
            style={{ 
              borderColor: activeTab === 'manual' ? 'var(--accent)' : 'transparent',
              fontWeight: activeTab === 'manual' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('manual')}
          >
            📖 First Aid Guide
          </button>
          <button 
            type="button" 
            className="counter" 
            style={{ 
              borderColor: activeTab === 'quiz' ? 'var(--accent)' : 'transparent',
              fontWeight: activeTab === 'quiz' ? 'bold' : 'normal',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('quiz')}
          >
            🏆 Emergency Academy
          </button>
        </div>

        <div className="home-actions">
          <a href="tel:+112" className="sosbutton">
            112
          </a>
          <div style={{ marginTop: '16px' }}>
          </div>
        </div>
      </section>

      <div className="ticks"></div>

      {/* RENDER LAYOUT 1: Quick Steps */}
      {activeTab === 'quick' && (
        <section id="next-steps">
          {guideSteps.map((step) => (
            <div key={step.title}>
              <h2>{step.title}</h2>
              <p>{step.text}</p>
            </div>
          ))}
        </section>
      )}

      {/* RENDER LAYOUT 2: Step-by-Step with Side Navbar */}
      {activeTab === 'manual' && (
        <section id="next-steps" style={{ padding: '0', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Side Navbar */}
          <div style={{ 
            flex: '1 1 250px', 
            borderRight: '1px solid var(--border)', 
            padding: '32px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h2 style={{ fontSize: '1.2rem', textTransform: 'uppercase', color: 'var(--text-h)', letterSpacing: '0.1em' }}>
              Incidents
            </h2>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '4px 0 12px' }} />
            
            {Object.keys(firstAidProcedures).map((key) => (
              <button
                key={key}
                type="button"
                className="counter"
                style={{
                  textAlign: 'left',
                  width: '100%',
                  padding: '10px 15px',
                  margin: '0',
                  background: selectedProcedure === key ? 'var(--accent-bg)' : 'transparent',
                  borderColor: selectedProcedure === key ? 'var(--accent-border)' : 'transparent',
                  cursor: 'pointer',
                  justifyContent: 'flex-start'
                }}
                onClick={() => setSelectedProcedure(key)}
              >
                {key === 'cpr' && '❤️ '}
                {key === 'fainting' && '💧 '}
                {key === 'stab' && '🩹 '}
                {firstAidProcedures[key].title.split(' (')[0]}
              </button>
            ))}
          </div>

          {/* Procedure Step Viewer */}
          <div style={{ flex: '2 1 450px', padding: '32px', textAlign: 'left' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', fontWeight: 'bold' }}>
              Step-by-step treatment
            </span>
            <h2 style={{ marginTop: '8px', fontSize: '2rem' }}>{firstAidProcedures[selectedProcedure].title}</h2>
            <p style={{ fontStyle: 'italic', marginBottom: '24px', color: 'var(--text)' }}>
              "{firstAidProcedures[selectedProcedure].description}"
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {firstAidProcedures[selectedProcedure].steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--accent-bg)',
                    border: '1px solid var(--accent-border)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ marginTop: '3px', fontSize: '1rem', color: 'var(--text-h)' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RENDER LAYOUT 3: Dynamic Flask-Connected Quiz */}
      {activeTab === 'quiz' && (
        <section id="next-steps" style={{ display: 'block', padding: '32px', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            
            {/* Loading State */}
            {isLoading && (
              <p style={{ textAlign: 'center', color: 'var(--text)', fontStyle: 'italic' }}>
                Fetching dynamic scenarios from Flask Server...
              </p>
            )}

            {/* Error State Handler */}
            {apiError && (
              <div style={{ padding: '20px', border: '1px dashed #ef4444', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.05)', textAlign: 'center' }}>
                <p style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '8px' }}>⚠️ Backend Offline</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                  Could not fetch database questions. Make sure your Flask backend server is running via terminal!
                </p>
              </div>
            )}

            {/* Live Interactive Game Interface */}
            {!isLoading && !apiError && questions.length > 0 && (
              <>
                {quizView === 'map' ? (
                  /* Upgraded 10-Level Dynamic Progression Roadmap Map */
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%' }}>
                    <h2 style={{ marginBottom: '25px', textAlign: 'center' }}>Training Path</h2>
                    
                    {levelsConfig.map((lvl, index) => {
                      const isUnlocked = unlockedLevels.includes(lvl.id);
                      
                      return (
                        <div key={lvl.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                          {/* Vector vertical connector road asset line */}
                          {index > 0 && (
                            <div style={{ width: '8px', height: '40px', background: isUnlocked ? 'var(--accent)' : 'var(--border)', borderRadius: '4px', margin: '4px 0' }}></div>
                          )}
                          
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: isUnlocked ? 1 : 0.55 }}>
                            <button 
                              type="button"
                              disabled={!isUnlocked}
                              style={{ 
                                width: '80px', height: '80px', borderRadius: '50%', border: 'none', fontSize: '32px', 
                                background: isUnlocked ? 'var(--accent)' : 'var(--border)', 
                                color: 'white', 
                                boxShadow: isUnlocked ? '0 8px 0 var(--accent-border)' : 'none', 
                                cursor: isUnlocked ? 'pointer' : 'not-allowed', 
                                transition: 'transform 0.1s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                              onClick={() => { 
                                setCurrentLevel(lvl.id);
                                setQuizView('playing'); 
                                restartQuiz(); 
                              }}
                            >
                              {isUnlocked ? lvl.icon : '🔒'}
                            </button>
                            <p style={{ marginTop: '10px', fontWeight: 'bold', color: isUnlocked ? 'var(--text-h)' : 'var(--text)', fontSize: '0.9rem', textAlign: 'center' }}>
                              Level {lvl.id}: {lvl.name} ({lvl.count} {lvl.count === 1 ? 'Incident' : 'Incidents'})
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : !quizFinished ? (
                  /* Dynamic Gameplay Module Frame */
                  <div>
                    {/* Visual Progress Bar calculated against active questions */}
                    <div style={{ width: '100%', height: '8px', background: 'var(--code-bg)', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
                      <div style={{ width: `${activeQuestions.length ? ((currentQuestionIdx + 1) / activeQuestions.length) * 100 : 0}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }}></div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      Level {currentLevel} • Incident {currentQuestionIdx + 1} of {activeQuestions.length || 1}
                    </p>
                    
                    {activeQuestions.length > 0 ? (
                      <>
                        <h2 style={{ fontSize: '1.4rem', lineHeight: '135%', color: 'var(--text-h)', marginBottom: '24px' }}>
                          {activeQuestions[currentQuestionIdx].question}
                        </h2>

                        {/* DYNAMIC VARIANT SWITCH: Multiple Choice vs Text Essay Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                          
                          {activeQuestions[currentQuestionIdx].type === 'multiple_choice' ? (
                            activeQuestions[currentQuestionIdx].options.map((option, idx) => {
                              const isSelected = selectedOption === idx;
                              let optBorder = isSelected ? 'var(--accent)' : 'var(--border)';
                              let optBg = isSelected ? 'var(--accent-bg)' : 'transparent';

                              if (isSubmitted) {
                                const correctIdx = activeQuestions[currentQuestionIdx].answerIndex;
                                if (idx === correctIdx) {
                                  optBorder = '#10b981'; optBg = 'rgba(16, 185, 129, 0.1)';
                                } else if (isSelected && idx !== correctIdx) {
                                  optBorder = '#ef4444'; optBg = 'rgba(239, 68, 68, 0.1)';
                                }
                              }

                              return (
                                <button
                                  key={idx} type="button"
                                  style={{ width: '100%', textAlign: 'left', padding: '16px', borderRadius: '8px', border: `2px solid ${optBorder}`, background: optBg, color: 'var(--text-h)', fontFamily: 'var(--sans)', fontSize: '1rem', cursor: isSubmitted ? 'default' : 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '12px' }}
                                  onClick={() => handleOptionSelect(idx)}
                                >
                                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', background: isSelected ? 'var(--accent)' : 'transparent', color: isSelected ? 'white' : 'var(--text)' }}>
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  {option}
                                </button>
                              );
                            })
                          ) : (
                            /* Text Input/Essay Entry Frame */
                            <textarea 
                              disabled={isSubmitted}
                              placeholder="Type your response essay here..."
                              style={{ width: '100%', padding: '16px', borderRadius: '8px', border: `2px solid ${isSubmitted ? (String(selectedOption).toLowerCase().trim() === String(activeQuestions[currentQuestionIdx].realAnswer).toLowerCase().trim() ? '#10b981' : '#ef4444') : 'var(--accent)'}`, background: 'var(--bg)', color: 'var(--text-h)', fontFamily: 'var(--sans)', fontSize: '1rem', minHeight: '100px', boxSizing: 'border-box' }}
                              onChange={(e) => handleOptionSelect(e.target.value)}
                              value={selectedOption || ''}
                            />
                          )}
                        </div>

                        {/* Dynamic Feedback block */}
                        {isSubmitted && (
                          <div style={{ padding: '16px', borderRadius: '8px', background: 'var(--code-bg)', borderLeft: `4px solid ${
                            (activeQuestions[currentQuestionIdx].type === 'multiple_choice' && selectedOption === activeQuestions[currentQuestionIdx].answerIndex) || 
                            (activeQuestions[currentQuestionIdx].type !== 'multiple_choice' && String(selectedOption).toLowerCase().trim() === String(activeQuestions[currentQuestionIdx].realAnswer).toLowerCase().trim()) 
                            ? '#10b981' : '#ef4444'
                          }`, marginBottom: '24px' }}>
                            <strong style={{ display: 'block', color: 'var(--text-h)', marginBottom: '4px' }}>
                              { (activeQuestions[currentQuestionIdx].type === 'multiple_choice' && selectedOption === activeQuestions[currentQuestionIdx].answerIndex) || (activeQuestions[currentQuestionIdx].type !== 'multiple_choice' && String(selectedOption).toLowerCase().trim() === String(activeQuestions[currentQuestionIdx].realAnswer).toLowerCase().trim()) ? '🎉 Correct!' : `⚠️ Incorrect. The answer was: ${activeQuestions[currentQuestionIdx].type !== 'multiple_choice' ? activeQuestions[currentQuestionIdx].realAnswer : activeQuestions[currentQuestionIdx].options[activeQuestions[currentQuestionIdx].answerIndex]}` }
                            </strong>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                              {activeQuestions[currentQuestionIdx].successMessage}
                            </p>
                          </div>
                        )}

                        {/* Controls Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          {!isSubmitted ? (
                            <button type="button" className="counter" disabled={selectedOption === null || selectedOption === ''} style={{ opacity: selectedOption === null || selectedOption === '' ? 0.5 : 1, cursor: selectedOption === null || selectedOption === '' ? 'not-allowed' : 'pointer', margin: 0 }} onClick={handleSubmitAnswer}>
                              Verify Decision
                            </button>
                          ) : (
                            <button type="button" className="counter" style={{ cursor: 'pointer', margin: 0 }} onClick={handleNext}>
                              {currentQuestionIdx < activeQuestions.length - 1 ? 'Next Scenario ➡️' : 'Finish Simulator 🏅'}
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>No questions configured for Level {currentLevel} yet. Add more questions in your SQL database setup!</p>
                        <button type="button" className="counter" style={{ cursor: 'pointer' }} onClick={() => setQuizView('map')}>🗺️ Back to Map</button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Finish Screen Banner */
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏆</div>
                    <h2>Level {currentLevel} Cleared Successfully!</h2>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-h)', margin: '12px 0 24px' }}>
                      You handled <strong>{score}</strong> out of <strong>{activeQuestions.length}</strong> incidents correctly!
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button type="button" className="counter" style={{ cursor: 'pointer', margin: 0 }} onClick={restartQuiz}>
                        🔄 Retry Level
                      </button>
                      <button type="button" className="counter" style={{ cursor: 'pointer', margin: 0, background: 'transparent', borderColor: 'var(--border)' }} onClick={() => { restartQuiz(); setQuizView('map'); }}>
                        🗺️ Back to Map
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Secondary fallback check */}
            {!isLoading && !apiError && questions.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text)' }}>No questions found inside the database setup.</p>
            )}

          </div>
        </section>
      )}
    </>
  )
}

export default GuidePage