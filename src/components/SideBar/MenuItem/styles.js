import styled from 'styled-components'

export const MenuItemContainer = styled.div`
  margin: 20px 0;

  display flex;
  flex-direction: row;
  grid-gap: 12px;
  gap: 12px;
  align-items: center;

  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(102%, 102%);
  }

  padding-left: ${props => props.small === undefined? '70px': '0px'};

  cursor: pointer;

  p {
    margin: 0;
    font-family: 'Raleway';
    font-size: 20px;
    text-decoration: none !important;
    letter-spacing: 2px;
    color: ${props => props.colorDef};

    transition: all 0.2s ease-in-out;

    &:hover {
      color: #F08080;
    }
  }

  .mark-frame {
    position: relative;
    transform: translateY(-30%);
  }
`;
