import styled from 'styled-components';
import DiseaseSelector from '../components/disease/DiseaseSelector';

const DiseasePage = () => {
  return (
    <Wrapper>
      <DiseaseSelector />
    </Wrapper>
  );
};

// styled-components
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #fff;
`;

export default DiseasePage;