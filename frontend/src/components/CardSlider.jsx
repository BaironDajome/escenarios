import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import MapCard from "./MapCard";
import '../css/CardSlider.css'

export default function CardSlider({ canchas }) {
    const navigate = useNavigate();
    
    const irLogin = () => {
        navigate('/login'); 
    };
    
    return (
        <div className="content-cardsider">
        <div className="container swiper">
            <h1 className="text-center">Reseva tu cancha</h1>
            <div className="slider-wrapper">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    loop
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="card-list">
                    {canchas.map((cancha, index) => (
                        <SwiperSlide key={index}>
                            <div className="card-item">
                                <h2 className="cancha-tipo">{cancha.tipo}</h2>
                                <img src={cancha.img} alt={cancha.nombre} className="cancha-image" />
                                <p className="cancha-nombre">{cancha.nombre}</p>
                                <p className="cancha-ubicacion">Ubicacion</p>

                                {/* Mapa */}
                                <MapCard lat={cancha.location.lat} lng={cancha.location.lng} id={index} label={cancha.escenario} />

                                {/* Botón */}
                                <button className="message-button" onClick={irLogin}>Reservar</button>
                            </div>
                        </SwiperSlide>
                    ))}

                </Swiper>
            </div>
        </div>
        </div>
    );
}