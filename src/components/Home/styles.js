import styled from 'styled-components'
import BackgroundImage from '../../assets/images/background.jpg'

export const HomeContainer = styled.div`
  width: 100vw;
  height: fit-content;

  position: relative;
`;

export const BackgroundImageContainer = styled.div`
  position: absolute;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  z-index: -100;
  overflow: hidden;

  .back1 {
    background-image: url(${BackgroundImage});
    background-position: top center;
    background-repeat: no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
    z-index: -100;
    opacity: 0.2;
  }

  .custom {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height 200px;

    background: linear-gradient(#0045E200, #0045E240);
    z-index: 1;
  }
`;

