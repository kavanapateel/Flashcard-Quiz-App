import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StatsContainer = styled.div`
  background: ${props => props.theme.cardBg};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  animation: ${fadeIn} 0.5s ease-out;
  transition: all 0.3s ease;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${props => props.theme.cardBg};
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.secondary};
  animation: ${fadeIn} 0.5s ease-out;
  animation-delay: ${props => props.delay || '0s'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.secondary};
  border-radius: 4px;
  margin-top: 1rem;
  overflow: hidden;
  opacity: 0.3;
`;

const Progress = styled.div`
  width: ${props => props.value * 100}%;
  height: 100%;
  background: ${props => props.theme.primary};
  transition: width 0.3s ease;
`;

export default function Stats({ stats, selectedTopic, theme }) {
  return (
    <StatsContainer theme={theme}>
      <StatsGrid>
        <StatItem theme={theme} delay="0.1s">
          <StatValue theme={theme}>{stats.totalAnswered}</StatValue>
          <StatLabel theme={theme}>Total Answered</StatLabel>
        </StatItem>
        <StatItem theme={theme} delay="0.2s">
          <StatValue theme={theme}>{stats.correctAnswers}</StatValue>
          <StatLabel theme={theme}>Correct Answers</StatLabel>
        </StatItem>
      </StatsGrid>
      {selectedTopic !== "All" && (
        <StatItem theme={theme} style={{ marginTop: '1rem' }} delay="0.5s">
          <StatValue theme={theme}>
            {stats.topicStats[selectedTopic]?.correct || 0}
          </StatValue>
          <StatLabel theme={theme}>{selectedTopic} Topic Correct Answers</StatLabel>
          <ProgressBar theme={theme}>
            <Progress 
              value={stats.topicStats[selectedTopic] ? 
                stats.topicStats[selectedTopic].correct / stats.topicStats[selectedTopic].total : 
                0
              } 
              theme={theme} 
            />
          </ProgressBar>
        </StatItem>
      )}
    </StatsContainer>
  );
} 