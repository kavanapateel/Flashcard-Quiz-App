import styled from "@emotion/styled";

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background: linear-gradient(to bottom, #00796b, #004d40);
  padding: 2rem 1rem;
  position: fixed;
  left: 0;
  top: 0;
  color: white;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.5rem;
`;

const TopicList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TopicButton = styled.button`
  background: ${props => props.active ? '#004d40' : 'transparent'};
  border: 1px solid white;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1rem;

  &:hover {
    background: #004d40;
  }
`;

export default function Sidebar({ topics, selectedTopic, onTopicSelect }) {
  return (
    <SidebarContainer>
      <Title>Topics</Title>
      <TopicList>
        <TopicButton
          active={selectedTopic === "All"}
          onClick={() => onTopicSelect("All")}
        >
          All Topics
        </TopicButton>
        {topics.map((topic) => (
          <TopicButton
            key={topic}
            active={selectedTopic === topic}
            onClick={() => onTopicSelect(topic)}
          >
            {topic}
          </TopicButton>
        ))}
      </TopicList>
    </SidebarContainer>
  );
} 