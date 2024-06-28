import styled from 'styled-components'

export const SideBarContainer = styled.div`
  width: 300px;
  min-height: 100vh;
  position: fixed;

  z-index: 20;

  transition: all 0.4s ease-in-out;
  left: 0px;

  @media (max-width: 864px) {
    left: ${props => props.show === '1'? '0px': '-300px'};
  }

  background: rgba(0,0,0,0.02);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);

  display: flex;
  flex-direction: column;

  .account-frame {
    text-align: center;
    font-family: 'Open Sans';
    font-weight: 800;
    font-size: 14px;
    color: #ddd;
    margin-bottom: 20px;

    &:hover {
      color: #eee;
    }

    &:active {
      color: #ccc;
    }
  }

  .logo-frame {
    margin: 20px 0px;
    display: flex;
    flex-direction: row;
    justify-content: center;

    img {
      border-radius: 50%;
    }
  }

  .menu-item-frame {
    margin: 20px 0;

    display flex;
    flex-direction: row;
    grid-gap: 12px;
    gap: 12px;
    align-items: center;

    padding-left: 40px;

    cursor: pointer;

    .menu-item-text {
      font-family: 'Pacifico';
      font-weight: 600;
      font-size: 20px;
      letter-spacing: 2px;
      color: #eeeeee;
    }
  }

  .footer-frame {
    display: flex;
    flex-direction: row;
    justify-content: center;
    grid-gap: 10px;
    gap: 10px;

    padding-top: 40px;

    .footer-item {
      width: fit-content;
    }
  }
`;
