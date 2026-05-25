import React from "react";

export default function DisasterSlide({ bg, title, onNext, onOpenStats }) {
  return (
    <section
      className="slide"
      style={{ backgroundImage: `url(${bg})` }}
      aria-label={title}
    >
      <div className="slide__overlay">
        <h2 className="slide__title">{title}</h2>

        <div className="slide__actions">
          <button className="btn-ghost" onClick={onOpenStats}>Ver estadísticas</button>
        </div>
      </div>
    </section>
  );
}
