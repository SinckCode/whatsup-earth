import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  // id de categoría EONET v3 (ej.: 'wildfires', 'severeStorms', etc.)
  { id: 'wildfires',   title: 'Incendios' },
  { id: 'severeStorms', title: 'Tormentas Severas' },
  { id: 'volcanoes',   title: 'Volcanes' },
  { id: 'earthquakes', title: 'Sismos' },
  { id: 'floods',      title: 'Inundaciones' }
];

export default function DisasterSwiper() {
  return (
    <div className="fullscreen">
      <Swiper slidesPerView={1} spaceBetween={0} style={{ height: '100%' }}>
        {CATEGORIES.map(c => (
          <SwiperSlide key={c.id}>
            <div className="center" style={{ height: '100%', flexDirection: 'column', gap: 12 }}>
              <h2 style={{ margin: 0 }}>{c.title}</h2>
              <Link to={`/disaster/${c.id}`} style={{
                padding: '12px 24px', borderRadius: 12, background: 'var(--accent)', color: '#00131b', fontWeight: 700, textDecoration: 'none'
              }}>
                Ver eventos actuales
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
