import styled from 'styled-components'

export const HistoryItemContainer = styled.div`
  width: 100%;

  padding: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.03);

  font-family: Roboto;
  font-size: 14px;

  display: flex;
  flex-direction: column;
  flex-gap: 8px;
  gap: 8px;

  .item-frame-1 {
    display: flex;
    flex-direction: row;
    align-items: center;

    flex-gap: 14px;
    gap: 14px;

    @media (max-width: 512px) {
      flex-direction: column;
      flex-gap: 6px;
      gap: 6px;
    }

    .block-number {
      padding: 4px 8px;
      background: rgba(255,255,255,0.08);
      border-radius: 20px;

      a {
        color: #ddd;
        text-decoration: none;

        &:hover {
          color: #eee;
        }

        &:active {
          color: #ccc;
        }

        &:visited {
          color: #f0ffc0;
        }

        &:visited:hover {
          color: #a0ff80;
        }
      }
    }

    .depositor {
      display: flex;
      flex-direction: row;
      align-items: center;
      overflow-wrap: anywhere;
      flex-gap: 8px;
      gap: 8px;

      color: #ffa080;

      padding: 4px 8px;
      border-radius: 20px;
      background: rgba(255,255,255,0.08);
    }

    .deposit-amount {
      padding: 4px 8px;
      border-radius: 20px;
      background: rgba(255,255,255,0.08);

      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  .token-address {
    overflow-wrap: anywhere;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    color: #aaa;

    flex-gap: 8px;
    gap: 8px;
  }

  .copy-address {
    cursor: pointer;
  }
`;
