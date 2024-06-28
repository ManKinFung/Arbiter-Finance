import styled from 'styled-components'

export const PresaleContainer = styled.div`
  width: 100%;
  height: 100%;

  overflow: hidden;
  overflow-y: auto;

  display: flex;
  flex-direction: row;
  justify-content: center;

  .initiator {
    color: #a0ff80;
  }

  .info-frame {
    border-radius: 10px;
    border: 1px solid rgb(98, 116, 94, 0.4);
    background: rgba(0,0,0,0.2);

    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
  }

  .copy-address {
    cursor: pointer;

    opacity: 0.9;

    &:hover {
      opacity: 1.0;
    }

    &:active {
      opacity: 0.8;
    }
  }

  .top-frame {
    margin: 0px 20px;

    display: flex;
    flex-direction: column;
    flex-gap: 20px;
    gap: 20px;

    width: 100%;
    max-width: 833px;

    .multi-sign-frame {
      width: 100%;

      display: flex;
      flex-direction: column;

      .title-bar {
        text-align: center;
        padding: 10px 0px;

        font-family: Comfortaa;
        text-decoration: underline;
      }
      
      .new-request-frame {
        display: flex;
        flex-direction: row;
        align-items: end;

        flex-gap: 10px;
        gap: 10px;

        @media (max-width: 512px) {
          flex-direction: column;
          align-items: center;

          flex-gap: 4px;
          gap: 4px;
        }

        .width-address {
          flex: 7 0 0;

          @media (max-width: 512px) {
            width: 100%;
          }
        }

        .width-amount {
          flex: 3 0 0;

          @media (max-width: 512px) {
            width: 100%;
          }
        }

        .address-input-frame, .amount-input-frame {
          padding: 26px 0px 10px 10px;
          position: relative;

          @media (max-width: 512px) {
            margin-right: 10px;
          }

          input {
            width: 100%;

            padding: 4px 8px;
            border-radius: 6px;

            border: none;
            outline: none;

            font-family: 'Roboto';
            font-size: 14px;

            ::placeholder {
              color: #ddd;
            }
          }

          .margin-top-xx {
            margin-top: 4px;
          }

          .withdraw-address, .withdraw-amount {
            position: absolute;
            right: 0;
            top: 0;
            width: fit-content;
            height: fit-content;

            display: flex;
            flex-direction: row;
            align-items: center;

            font-size: 12px;

            .address-unit, .metis-unit {
              margin-left: 10px;
            }
          }
        }

        .button-frame {
          flex: 0 0 160px;
          width: max-content;
          padding: 7px 0px;
        }
      }

      .sign-withdraw-frame {
        padding: 10px;

        font-familiy: 'Roboto';
        font-size: 14px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        @media (max-width: 512px) {
          flex-direction: column;
        }

        .signer-list-frame {
          flex: 1 1 auto;

          display: flex;
          flex-direction: column;
          flex-gap: 10px;
          gap: 10px;

          .signer-item {
            display: flex;
            flex-direction: row;
            align-items: center;

            flex-gap: 10px;
            gap: 10px;
          }
        }
      }
    }

    .contribute-frame {
      padding: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-gap: 10px;
      gap: 10px;

      .deposit-input-amount {
        flex: 1 1 auto;
        position: relative;

        .my-eth-balance {
          position: absolute;
          top: 0;
          right: 0;

          font-size: 12px;
          transform: translateY(-100%);
        }

        .deposit-amount-limit {
          position: absolute;
          bottom: -2px;
          right: 0;

          font-size: 12px;
          transform: translateY(100%);
        }

        input {
          width: 100%;

          padding: 4px 8px;
          border-radius: 6px;

          border: none;
          outline: none;

          font-family: 'Roboto';
          font-size: 14px;
        }
      }
    }

    .history-frame {
      display: flex;
      flex-direction: column;
      flex-gap: 10px;
      gap: 10px;

      .title-bar {
        text-align: center;
        padding: 10px 0px;

        font-family: Comfortaa;
        text-decoration: underline;
      }

      .search-frame {
        padding: 10px;
        input {
          width: 100%;

          padding: 4px 8px;
          border-radius: 6px;

          border: none;
          outline: none;

          font-family: 'Roboto';
          font-size: 14px;

          ::placeholder {
            color: #ddd;
          }
        }
      }

      .history-info-frame {
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .history-item {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: end;

          .label {
            width: 50%;
            font-size: 16px;
            padding: 0px 10px;
          }

          .value {
            width: 50%;
            display: flex;
            flex-direction: row;

            flex-gap: 8px;
            gap: 8px;
          }
        }
      }

      .history-items {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-gap: 10px;
        gap: 10px;

        overflow-y: auto;
        max-height: 1000px;

        padding: 0px 10px;
      }
    }
  }
`;
