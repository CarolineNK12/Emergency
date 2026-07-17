import { useState, useEffect } from 'react'
import './App.css'

// 1. Quick Steps data
const guideSteps = [
  {
    title: 'Stay calm',
    icon: '🧘',
    text: 'Pause, breathe, and focus on the next safe step before acting.',
  },
  {
    title: 'Call for help',
    icon: '📞',
    text: 'Use the emergency button or call your local emergency number right away.',
  },
  {
    title: 'Share essentials',
    icon: '🗣️',
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
      'Place your hands in the center of the chest and perform rapid, deep compressions (100–120 per minute).',
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
    title: 'Severe Bleeding',
    description: 'Critical steps to control hemorrhage and maintain stabilization.',
    steps: [
      'Put on gloves if available, and identify the source of bleeding.',
      'DO NOT remove the object if it is still embedded (it acts as a plug).',
      'Apply direct, firm pressure on the wound with a clean cloth.',
      'Keep the person lying down and wrap them in a blanket to prevent shock.',
      'Monitor breathing continuously until paramedics arrive.',
    ],
  },
}

// Clean, calming color palette
const theme = {
  primary: '#dc2626', // Changed to red
  primaryLight: '#fef2f2', // Changed to light red for backgrounds
  border: '#e2e8f0', // Soft gray border
  textDark: '#1e293b',
  textMuted: '#64748b',
  white: '#ffffff',
  success: '#10b981', // Clean green
  error: '#ef4444',
  softShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
}

function GuidePage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('quick')
  const [selectedProcedure, setSelectedProcedure] = useState('cpr')

  const [questions, setQuestions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState(null)

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

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizView, setQuizView] = useState('map')

  const [currentLevel, setCurrentLevel] = useState(1)
  const [unlockedLevels, setUnlockedLevels] = useState([1])

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
          if (!res.ok) throw new Error('Failed to connect to backend')
          return res.json()
        })
        .then((data) => {
          if (data.questions && data.questions.length > 0) {
            const formattedQuestions = data.questions.map((q) => {
              const options = [q.answer1, q.answer2, q.answer3, q.answer4].filter(Boolean)
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
    
    if (currentQ.type === 'multiple_choice') {
      isCorrect = String(currentQ.options[selectedOption]).toLowerCase().trim() === String(currentQ.realAnswer).toLowerCase().trim()
    } else {
      isCorrect = String(selectedOption).toLowerCase().trim() === String(currentQ.realAnswer).toLowerCase().trim()
    }
    
    if (isCorrect) setScore((prev) => prev + 1)
  }

  const handleNext = () => {
    if (currentQuestionIdx < activeQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1)
      setSelectedOption(null)
      setIsSubmitted(false)
    } else {
      setQuizFinished(true)
      const nextLevelId = currentLevel + 1
      if (nextLevelId <= 10 && !unlockedLevels.includes(nextLevelId)) {
        setUnlockedLevels((prev) => [...prev, nextLevelId])
      }
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: theme.textDark, width: '100%', boxSizing: 'border-box' }}>
      <section style={{ textAlign: 'center', padding: '20px 16px 30px' }}>
        <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.8rem', fontWeight: 600, color: theme.primary }}>
          Interactive safety space
        </p>
        <h1 style={{ margin: '10px 0', fontSize: '2.2rem', color: theme.textDark }}>Learn, Practice, Respond.</h1>
        <p style={{ color: theme.textMuted, maxWidth: '500px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
          Toggle between quick response essentials, complete first aid procedures, or practice vital survival simulations.
        </p>

        {/* Clean, shadowless Tab Controls */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
          {[
            { id: 'quick', icon: '⚡', label: 'Quick' },
            { id: 'manual', icon: '📖', label: 'Guide' },
            { id: 'quiz', icon: '🏆', label: 'Academy' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                padding: '10px 18px',
                borderRadius: '99px',
                border: activeTab === tab.id ? `1px solid ${theme.primary}` : `1px solid ${theme.border}`,
                background: activeTab === tab.id ? theme.primaryLight : theme.white,
                color: activeTab === tab.id ? theme.primary : theme.textMuted,
                fontWeight: activeTab === tab.id ? '600' : '400',
                cursor: 'pointer',
                boxShadow: 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem'
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* RENDER LAYOUT 1: Quick Steps (Mobile Flex Column) */}
      {activeTab === 'quick' && (
        <section style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px', 
          padding: '0 16px'
        }}>
          {guideSteps.map((step) => (
            <div key={step.title} style={{
              background: theme.white,
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '20px',
              boxShadow: theme.softShadow,
              textAlign: 'left'
            }}>
              <h2 style={{ color: theme.primary, fontSize: '1.15rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', background: theme.primaryLight, padding: '8px', borderRadius: '10px' }}>{step.icon}</span>
                {step.title}
              </h2>
              <p style={{ color: theme.textMuted, fontSize: '0.95rem', lineHeight: '1.5' }}>{step.text}</p>
            </div>
          ))}
        </section>
      )}

      {/* RENDER LAYOUT 2: Mobile Stacked View (Swipeable Nav on Top) */}
      {activeTab === 'manual' && (
        <section style={{ 
          display: 'flex',
          flexDirection: 'column',
          background: theme.white,
          border: `1px solid ${theme.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: theme.softShadow,
          margin: '0 16px'
        }}>
          {/* Swipeable Horizontal Mobile Navbar */}
          <div style={{ 
            display: 'flex',
            overflowX: 'auto',
            gap: '10px',
            padding: '16px',
            background: '#f8fafc',
            borderBottom: `1px solid ${theme.border}`,
            WebkitOverflowScrolling: 'touch', // Smooth scrolling for iOS
          }}>
            {Object.keys(firstAidProcedures).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedProcedure(key)}
                style={{
                  flexShrink: 0, // Prevents the buttons from squishing
                  padding: '10px 16px',
                  background: selectedProcedure === key ? theme.primaryLight : theme.white,
                  border: `1px solid ${selectedProcedure === key ? theme.primary : theme.border}`,
                  color: selectedProcedure === key ? theme.primary : theme.textDark,
                  fontWeight: selectedProcedure === key ? '600' : '400',
                  cursor: 'pointer',
                  borderRadius: '99px',
                  transition: 'background 0.2s',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {key === 'cpr' && '❤️ '}
                {key === 'fainting' && '💧 '}
                {key === 'stab' && '🩹 '}
                {firstAidProcedures[key].title.split(' (')[0]}
              </button>
            ))}
          </div>

          {/* Procedure Step Viewer */}
          <div style={{ padding: '24px 20px', textAlign: 'left', background: theme.white }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: theme.primary, fontWeight: 'bold' }}>
              Treatment
            </span>
            <h2 style={{ margin: '8px 0', fontSize: '1.6rem', color: theme.textDark, lineHeight: '1.2' }}>
              {firstAidProcedures[selectedProcedure].title}
            </h2>
            <p style={{ fontStyle: 'italic', marginBottom: '24px', color: theme.textMuted, fontSize: '0.95rem' }}>
              "{firstAidProcedures[selectedProcedure].description}"
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {firstAidProcedures[selectedProcedure].steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{
                    minWidth: '28px', height: '28px', borderRadius: '50%',
                    background: theme.primaryLight,
                    color: theme.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '0.85rem'
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ marginTop: '3px', fontSize: '0.95rem', color: theme.textDark, lineHeight: '1.5' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RENDER LAYOUT 3: Dynamic Quiz */}
      {activeTab === 'quiz' && (
        <section style={{ padding: '0 16px', textAlign: 'center' }}>
            {isLoading && <p style={{ color: theme.textMuted }}>Fetching scenarios from server...</p>}

            {apiError && (
              <div style={{ padding: '20px', borderRadius: '12px', background: '#fef2f2', border: `1px solid ${theme.error}` }}>
                <p style={{ color: theme.error, fontWeight: 'bold', marginBottom: '6px' }}>⚠️ Backend Offline</p>
                <p style={{ fontSize: '0.9rem', color: theme.textMuted }}>Please start your Flask server.</p>
              </div>
            )}

            {!isLoading && !apiError && questions.length > 0 && (
              <div style={{ background: theme.white, borderRadius: '16px', padding: '24px 16px', boxShadow: theme.softShadow, border: `1px solid ${theme.border}` }}>
                {quizView === 'map' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ marginBottom: '16px', color: theme.textDark }}>Training Path</h2>
                    {levelsConfig.map((lvl, index) => {
                      const isUnlocked = unlockedLevels.includes(lvl.id);
                      return (
                        <div key={lvl.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                          {index > 0 && <div style={{ width: '4px', height: '24px', background: isUnlocked ? theme.primary : theme.border, margin: '4px 0' }}></div>}
                          
                          <div style={{ opacity: isUnlocked ? 1 : 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <button 
                              disabled={!isUnlocked}
                              onClick={() => { setCurrentLevel(lvl.id); setQuizView('playing'); restartQuiz(); }}
                              style={{ 
                                width: '64px', height: '64px', borderRadius: '50%', border: 'none', fontSize: '24px', 
                                background: isUnlocked ? theme.primary : theme.border, 
                                color: 'white', cursor: isUnlocked ? 'pointer' : 'not-allowed', 
                              }}
                            >
                              {isUnlocked ? lvl.icon : '🔒'}
                            </button>
                            <p style={{ marginTop: '8px', fontWeight: '600', color: theme.textDark, fontSize: '0.9rem' }}>Level {lvl.id}: {lvl.name}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : !quizFinished ? (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ width: '100%', height: '8px', background: theme.border, borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                      <div style={{ width: `${((currentQuestionIdx + 1) / activeQuestions.length) * 100}%`, height: '100%', background: theme.primary, transition: 'width 0.3s' }}></div>
                    </div>
                    
                    <h2 style={{ fontSize: '1.15rem', color: theme.textDark, marginBottom: '20px', lineHeight: '1.4' }}>
                      {activeQuestions[currentQuestionIdx].question}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      {activeQuestions[currentQuestionIdx].type === 'multiple_choice' ? (
                        activeQuestions[currentQuestionIdx].options.map((option, idx) => {
                          const isSelected = selectedOption === idx;
                          let optBorder = isSelected ? theme.primary : theme.border;
                          let optBg = isSelected ? theme.primaryLight : theme.white;

                          if (isSubmitted) {
                            const correctIdx = activeQuestions[currentQuestionIdx].answerIndex;
                            if (idx === correctIdx) { optBorder = theme.success; optBg = '#ecfdf5'; } 
                            else if (isSelected) { optBorder = theme.error; optBg = '#fef2f2'; }
                          }

                          return (
                            <button key={idx} onClick={() => handleOptionSelect(idx)}
                              style={{ 
                                width: '100%', textAlign: 'left', padding: '14px', borderRadius: '12px', 
                                border: `2px solid ${optBorder}`, background: optBg, color: theme.textDark, 
                                cursor: isSubmitted ? 'default' : 'pointer', transition: 'all 0.2s',
                                fontSize: '0.95rem', lineHeight: '1.4'
                              }}
                            >
                              {option}
                            </button>
                          );
                        })
                      ) : (
                        <textarea 
                          disabled={isSubmitted}
                          placeholder="Type your response here..."
                          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${theme.border}`, minHeight: '100px', boxSizing: 'border-box', fontSize: '0.95rem' }}
                          onChange={(e) => handleOptionSelect(e.target.value)}
                          value={selectedOption || ''}
                        />
                      )}
                    </div>

                    {isSubmitted && (
                      <div style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', borderLeft: `4px solid ${
                        (activeQuestions[currentQuestionIdx].type === 'multiple_choice' && selectedOption === activeQuestions[currentQuestionIdx].answerIndex) 
                        ? theme.success : theme.error
                      }`, marginBottom: '20px' }}>
                        <p style={{ color: theme.textMuted, margin: 0, fontSize: '0.9rem' }}>{activeQuestions[currentQuestionIdx].successMessage}</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {!isSubmitted ? (
                        <button disabled={selectedOption === null} onClick={handleSubmitAnswer} style={{ padding: '12px 20px', background: theme.primary, color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', opacity: selectedOption === null ? 0.5 : 1, fontSize: '0.95rem' }}>Verify Decision</button>
                      ) : (
                        <button onClick={handleNext} style={{ padding: '12px 20px', background: theme.primary, color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>
                          {currentQuestionIdx < activeQuestions.length - 1 ? 'Next Scenario ➡️' : 'Finish 🏅'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🏆</div>
                    <h2 style={{ color: theme.textDark, fontSize: '1.5rem', marginBottom: '8px' }}>Level Cleared!</h2>
                    <p style={{ color: theme.textMuted, marginBottom: '20px', fontSize: '0.95rem' }}>You got {score} out of {activeQuestions.length} correct.</p>
                    <button onClick={() => { restartQuiz(); setQuizView('map'); }} style={{ padding: '12px 20px', background: theme.primary, color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.95rem' }}>🗺️ Back to Map</button>
                  </div>
                )}
              </div>
            )}
        </section>
      )}
    </div>
  )
}

export default GuidePage