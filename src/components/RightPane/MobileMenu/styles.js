import styled from 'styled-components'

export const MobileMenuContainer = styled.div`
  position: relative;

  width: fit-content;
  height: fit-content;

  color: #eee;
  -webkit-clip-path: circle(68px at 68px 12px);
  clip-path: circle(68px at 68px 12px);
  -webkit-transition: -webkit-clip-path 0.5625s, clip-path 0.375s;
  transition: -webkit-clip-path 0.5625s, clip-path 0.375s;

  font-family: 'Open Sans';
  font-size: 14px;

  &:hover {
    -webkit-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
    -webkit-transition-duration: 0.75s;
    transition-duration: 0.75s;
    -webkit-clip-path: circle(390px at 225px 24px);
    clip-path: circle(420px at 150px 24px);
  }

  .menu-item {
    display: block;
    padding: 10px;
    color: inherit;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    &:hover { background: #00000040; }
    &:active { background: #00000040; }
  }
  
  .navicon {
    padding: 23px 20px;
    cursor: pointer;
    -webkit-transform-origin: 32px 24px;
    -ms-transform-origin: 32px 24px;
    transform-origin: 32px 24px;
  }
  
  .navicon div {
    position: relative;
  }
  
  .menu-frame {
    position: absolute;
    top: 90px;
    right: 0px;
    width: 200px;

    background: #333344;

    border-radius: 6px;
    border: 1px solid #444455a0;

    filter: drop-shadow(2px 2px 6px black);
  }
`;
