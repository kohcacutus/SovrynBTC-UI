import React from 'react';
import styled from 'styled-components';
import SalesButton from 'app/components/SalesButton';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { SHOW_MODAL } from 'utils/classifiers';
import { actions } from 'app/containers/TutorialDialogModal/slice';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useSelector, useDispatch } from 'react-redux';

const StyledContent = styled.div`
  height: 600px;
  background: rgba(0, 0, 0, 0.27);
  max-width: 1200px;
  margin: 40px auto;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .content-header {
    font-size: 28px;
    text-align: center;
  }
  a {
    margin-top: 110px;
    color: var(--gold);
    font-weight: normal;
  }
`;

export default function Screen1() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleEngage = () => {
    dispatch(actions.showModal(SHOW_MODAL));
    reactLocalStorage.set('closedRskTutorial', 'false');
  };

  return (
    <StyledContent>
      <p className="content-header">
        Engage your wallet to participate in the
        <br />
        SOV Genesis Sale
      </p>
      <SalesButton
        text={t(translations.wallet.connect_btn)}
        onClick={handleEngage}
      />
    </StyledContent>
  );
}
