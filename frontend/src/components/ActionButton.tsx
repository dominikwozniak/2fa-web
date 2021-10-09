import React from 'react';

interface Props {
  icon?: string;
  text: string;
}

const ActionButton: React.FC<Props> = ({ icon, text }) => {
  return (
    <button className="is-flex is-flex-direction-column is-align-items-flex-end is-justify-content-space-between button is-primary action-button">
      <div className="is-flex action-button__icon">ICON</div>
      <p>{text}</p>
    </button>
  );
};

export default ActionButton;
