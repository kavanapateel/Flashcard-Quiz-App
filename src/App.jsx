import { useState, useMemo, useEffect } from "react";
import Flashcard from "./components/Flashcard";
import Sidebar from "./components/Sidebar";
import Stats from "./components/Stats";
import { flashcards } from "./data/flashcards";

const themes = {
  light: {
    primary: "#00796b",
    secondary: "#80deea",
    background: "linear-gradient(to bottom, #e0f7fa, #80deea)",
    text: "#333",
    cardBg: "white",
    success: "#2e7d32",
    error: "#c62828",
    accent: "#ff9800"
  },
  dark: {
    primary: "#00acc1",
    secondary: "#006064",
    background: "linear-gradient(to bottom, #006064, #00838f)",
    text: "#fff",
    cardBg: "#004d40",
    success: "#4caf50",
    error: "#f44336",
    accent: "#ffb74d"
  }
};

function App() {
  const [index, setIndex] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [theme, setTheme] = useState("light");
  const [stats, setStats] = useState({
    totalAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    topicStats: {},
    timeSpent: 0
  });

  // Get unique topics from flashcards
  const topics = useMemo(() => {
    const uniqueTopics = new Set(flashcards.map(card => card.topic));
    return Array.from(uniqueTopics);
  }, []);

  // Filter flashcards based on selected topic and unanswered questions
  const filteredFlashcards = useMemo(() => {
    let filtered = selectedTopic === "All" 
      ? flashcards 
      : flashcards.filter(card => card.topic === selectedTopic);
    
    return filtered.filter(card => !answeredQuestions.has(card.id));
  }, [selectedTopic, answeredQuestions]);

  // Auto-save stats to localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('quizStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quizStats', JSON.stringify(stats));
  }, [stats]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (!showSummary && filteredFlashcards.length > 0) {
      timer = setInterval(() => {
        setStats(prev => ({
          ...prev,
          timeSpent: prev.timeSpent + 1
        }));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showSummary, filteredFlashcards.length]);

  const handleNext = () => {
    // Mark current question as answered
    if (filteredFlashcards[index]) {
      setAnsweredQuestions(prev => new Set([...prev, filteredFlashcards[index].id]));
    }
    
    // If this was the last question, show summary
    if (index === filteredFlashcards.length - 1) {
      setShowSummary(true);
    } else {
      // Move to next question
      setIndex(prev => prev + 1);
    }
  };

  // Reset index when topic changes
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setIndex(0);
    setShowSummary(false);
    // Reset answered questions for the new topic
    setAnsweredQuestions(new Set());
  };

  const handleAnswer = (isCorrect) => {
    setStats(prev => {
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newTopicStats = {
        ...prev.topicStats,
        [selectedTopic]: {
          total: (prev.topicStats[selectedTopic]?.total || 0) + 1,
          correct: (prev.topicStats[selectedTopic]?.correct || 0) + (isCorrect ? 1 : 0),
          timeSpent: (prev.topicStats[selectedTopic]?.timeSpent || 0) + 1
        }
      };

      return {
        totalAnswered: prev.totalAnswered + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        topicStats: newTopicStats
      };
    });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderSummary = () => {
    const topicStats = stats.topicStats[selectedTopic] || { total: 0, correct: 0, timeSpent: 0 };
    const accuracy = topicStats.total > 0 
      ? Math.round((topicStats.correct / topicStats.total) * 100) 
      : 0;
    const avgTimePerQuestion = topicStats.total > 0
      ? Math.round(topicStats.timeSpent / topicStats.total)
      : 0;

    return (
      <div style={{...styles.summary, background: themes[theme].cardBg}}>
        <h2 style={{...styles.summaryTitle, color: themes[theme].primary}}>
          Quiz Complete! 🎉
        </h2>
        <div style={styles.summaryStats}>
          <div style={{...styles.summaryStat, background: themes[theme].secondary}}>
            <div style={{...styles.summaryValue, color: themes[theme].primary}}>
              {topicStats.total}
            </div>
            <div style={{...styles.summaryLabel, color: themes[theme].text}}>
              Total Questions
            </div>
          </div>
          <div style={{...styles.summaryStat, background: themes[theme].secondary}}>
            <div style={{...styles.summaryValue, color: themes[theme].primary}}>
              {topicStats.correct}
            </div>
            <div style={{...styles.summaryLabel, color: themes[theme].text}}>
              Correct Answers
            </div>
          </div>
          <div style={{...styles.summaryStat, background: themes[theme].secondary}}>
            <div style={{...styles.summaryValue, color: themes[theme].primary}}>
              {accuracy}%
            </div>
            <div style={{...styles.summaryLabel, color: themes[theme].text}}>
              Accuracy
            </div>
          </div>
          <div style={{...styles.summaryStat, background: themes[theme].secondary}}>
            <div style={{...styles.summaryValue, color: themes[theme].primary}}>
              {stats.bestStreak}
            </div>
            <div style={{...styles.summaryLabel, color: themes[theme].text}}>
              Best Streak
            </div>
          </div>
          <div style={{...styles.summaryStat, background: themes[theme].secondary}}>
            <div style={{...styles.summaryValue, color: themes[theme].primary}}>
              {formatTime(topicStats.timeSpent)}
            </div>
            <div style={{...styles.summaryLabel, color: themes[theme].text}}>
              Total Time
            </div>
          </div>
          <div style={{...styles.summaryStat, background: themes[theme].secondary}}>
            <div style={{...styles.summaryValue, color: themes[theme].primary}}>
              {formatTime(avgTimePerQuestion)}
            </div>
            <div style={{...styles.summaryLabel, color: themes[theme].text}}>
              Avg Time/Question
            </div>
          </div>
        </div>
        <div style={styles.summaryActions}>
          <button 
            style={{...styles.restartButton, background: themes[theme].primary}}
            onClick={() => {
              setShowSummary(false);
              setAnsweredQuestions(new Set());
              setIndex(0);
            }}
          >
            Restart Quiz
          </button>
          <button 
            style={{...styles.themeButton, background: themes[theme].secondary}}
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{...styles.container, background: themes[theme].background}}>
      <Sidebar
        topics={topics}
        selectedTopic={selectedTopic}
        onTopicSelect={handleTopicSelect}
        theme={theme}
      />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={{...styles.heading, color: themes[theme].primary}}>
            📚 Flashcard Quiz
          </h1>
          <button 
            style={{...styles.themeButton, background: themes[theme].secondary}}
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
        <Stats stats={stats} selectedTopic={selectedTopic} theme={theme} />
        {showSummary ? (
          renderSummary()
        ) : filteredFlashcards.length > 0 && filteredFlashcards[index] ? (
          <Flashcard
            question={filteredFlashcards[index].question}
            answer={filteredFlashcards[index].answer}
            onNext={handleNext}
            onAnswer={handleAnswer}
            progress={(index + 1) / filteredFlashcards.length}
            theme={theme}
          />
        ) : (
          <div style={{...styles.noCards, color: themes[theme].primary}}>
            {answeredQuestions.size > 0 ? (
              <>
                <h2 style={{ marginBottom: '1rem' }}>🎉 All Questions Completed!</h2>
                <p style={{ marginBottom: '2rem' }}>You've answered all questions in this topic.</p>
                <button 
                  style={{...styles.restartButton, background: themes[theme].primary}}
                  onClick={() => {
                    setAnsweredQuestions(new Set());
                    setIndex(0);
                  }}
                >
                  Restart Topic
                </button>
              </>
            ) : (
              <>
                <h2 style={{ marginBottom: '1rem' }}>📝 No Questions Available</h2>
                <p>There are no flashcards available for this topic yet.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    transition: "all 0.3s ease",
  },
  content: {
    flex: 1,
    marginLeft: "250px",
    padding: "4rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    marginBottom: "2rem",
  },
  heading: {
    margin: 0,
    fontSize: "2.5rem",
    transition: "all 0.3s ease",
  },
  noCards: {
    fontSize: "1.2rem",
    textAlign: "center",
    padding: "2rem",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  summary: {
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
    transition: "all 0.3s ease",
  },
  summaryTitle: {
    marginBottom: "2rem",
    fontSize: "2rem",
    transition: "all 0.3s ease",
  },
  summaryStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1.5rem",
    marginBottom: "2rem",
  },
  summaryStat: {
    padding: "1.5rem",
    borderRadius: "12px",
    transition: "all 0.3s ease",
  },
  summaryValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    transition: "all 0.3s ease",
  },
  summaryLabel: {
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  summaryActions: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  restartButton: {
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",

    "&:hover": {
      transform: "translateY(-2px)",
      filter: "brightness(1.1)",
    },
  },
  themeButton: {
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.3s ease",

    "&:hover": {
      transform: "translateY(-2px)",
      filter: "brightness(1.1)",
    },
  },
};

export default App;
