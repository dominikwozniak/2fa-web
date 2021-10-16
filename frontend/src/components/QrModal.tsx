import React from 'react';

interface Props {
  url: string;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const QrModal: React.FC<Props> = ({ url, active, setActive }) => {
  const handleChangeActive = () => {
    setActive((current) => !current);
  };

  return (
    <div className={`modal ${active ? 'is-active' : ''} qr-modal`}>
      <div className="modal-background" />
      <div className="modal-content">
        <div className="is-flex is-align-items-center is-justify-content-center">
          <img src={url} alt="qr-code" />
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={handleChangeActive}
      />
    </div>
  );
};

export default QrModal;
