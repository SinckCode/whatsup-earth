import React from "react";

export default function Modal({ title, children, onClose }){
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <header className="modal__head">
          <h3>{title}</h3>
          <button className="icon" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
