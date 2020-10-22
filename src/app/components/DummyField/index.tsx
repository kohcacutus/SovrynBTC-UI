/**
 *
 * DummyField
 *
 */
import React from 'react';
import styled from 'styled-components/macro';

interface Props {
  children: React.ReactNode;
}

export function DummyField(props: Props) {
  return (
    <Div className="d-flex flex-row align-items-center">{props.children}</Div>
  );
}

const Div = styled.div`
  border-radius: 5px;
  background-color: var(--secondary);
  color: var(--white);
  padding: 10px 14px;
  font-size: 16px;
  letter-spacing: 0;
  height: 48px;
`;
