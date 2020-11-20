import React, { useState, useEffect } from 'react';
import { Button, Icon } from '@blueprintjs/core';

interface Props {
  icon: string;
  content: React.ReactNode;
  localStorageRef: string;
}

export function InfoBox(props: Props) {
  const [show, setShow] = useState<any>(true);

  useEffect(() => {
    setShow(
      window.localStorage.getItem(props.localStorageRef) === 'false'
        ? false
        : true,
    );
  }, [show, props.localStorageRef]);

  function closeInfoBox() {
    setShow(false);
    window.localStorage.setItem(props.localStorageRef, 'false');
  }

  return (
    <div className={`my-3 d-none ${show && 'd-block'}`}>
      <div className="p-3 sovryn-border">
        <Button
          icon="cross"
          onClick={() => closeInfoBox()}
          minimal
          className="float-right"
        />
        <p className="pt-3">
          <Icon icon="info-sign" className="mr-2" />
          {props.content}
        </p>
      </div>
    </div>
  );
}
