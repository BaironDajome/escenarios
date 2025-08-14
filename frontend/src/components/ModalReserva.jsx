import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { actualizarReserva, crearReserva } from '../services/reservaService';
import { useAuth } from './AuthContext';
import { DOMINIO_BACKEND, DOMINIO_FRONTEND, PUBLIC_EPAYCO_KEY } from '../utils/constants';
import { DateTime } from 'luxon';
import EpaycoButton from './EpaycoButton';

export default function ModalReserva({ show, onHide, event, onConfirmar, setRefreshKey, nuevaReserva }) {
  const [titulo, setTitulo] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [canchaId, setCanchaId] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [fecha, setFecha] = useState('');
  const [fechaMin, setFechaMin] = useState('');
  const [fechaMax, setFechaMax] = useState('');
  const { usuario, actualizarUsuario, isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (event) {
      const start = DateTime.fromJSDate(new Date(event.start)).setZone('America/Bogota');
      const end = DateTime.fromJSDate(new Date(event.end)).setZone('America/Bogota');

      setCanchaId(event.canchaId || event.extendedProps?.canchaId);
      setFecha(event.fecha || event.extendedProps?.fecha || start.toISODate()); // Formato 'YYYY-MM-DD'
      setTitulo(event.title || '');
      setHoraInicio(start.toFormat('HH:mm'));
      setHoraFin(end.toFormat('HH:mm'));
      setEstado(event.extendedProps?.estado || 'pendiente');
    } else {
      setCanchaId('');
      setTitulo('');
      setHoraInicio('');
      setHoraFin('');
      setEstado('pendiente');
    }
  }, [event])

  useEffect(() => {
    // Calcular lunes y domingo de la semana actual
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0 (Domingo) - 6 (Sábado)
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - ((diaSemana + 6) % 7));
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);

    const toInputDate = (fecha) => fecha.toISOString().split('T')[0];
    setFechaMin(toInputDate(lunes));
    setFechaMax(toInputDate(domingo));
  }, []);

  const handlePagoReserva = () => {
    const handler = window.ePayco.checkout.configure({
      key: PUBLIC_EPAYCO_KEY,
      test: true,
    });

    const data = {
      name: "Reserva deportiva",
      description: "Cancha fútbol 5",
      invoice: `reserva-${Date.now()}`,
      currency: "cop",
      amount: "100000",
      tax_base: "0",
      tax: "0",
      country: "CO",
      lang: "es",
      response: `${DOMINIO_FRONTEND}/gestion-reserva`, // Redirección del usuario
      confirmation: `${DOMINIO_BACKEND}/reservas/pago`,
      method: "POST",
      extra1: canchaId,
      extra2: usuario.id,
      extra3: titulo,
      extra4: horaInicio,
      extra5: horaFin,
      extra6: fecha,
      extra7: "confirmado",
      extra8: token
    };

    handler.open(data);
  };

  const handleNuevoRegistro = async () => {
    try {
      const reservaPayload = {
        cancha_id: canchaId,
        usuario_id: usuario.id,
        datos: [
          {
            motivo: titulo,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            estado: estado,
            fecha: fecha,
          },
        ],
      };

      const response = await crearReserva(reservaPayload);

      console.log('Respuesta de crear reserva-->', response);

      const nuevoEvento = {
        id: response.id,
        title: response.motivo,
        start: `${response.fecha}T${response.hora_inicio}`,
        end: `${response.fecha}T${response.hora_fin}`,
        extendedProps: {
          estado: response.estado,
          fecha: response.fecha,
          canchaId: response.canchaId,
          usuarioId: response.usuarioId,
        },
      };

      nuevaReserva(nuevoEvento);
      setRefreshKey((prev) => prev + 1);
      onHide();

    } catch (error) {
      console.error('Error al crear la reserva:', error);
    }
  };

  const handleActualizarRegistro = () => {
    if (!titulo || !horaInicio || !horaFin || !fecha) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (event.id) {
      // Si es edición, actualiza directamente
      const reservaPayload = {
        cancha_id: canchaId,
        usuario_id: usuario.id,
        datos: [
          {
            motivo: titulo,
            hora_inicio: horaInicio,
            hora_fin: horaFin,
            estado: estado,
            fecha: fecha,
          },
        ],
      };

      actualizarReserva(event.id, reservaPayload)
        .then((data) => {
          const eventoAutializacion = {
            id: data.id,
            title: titulo,
            startStr: `${fecha}T${horaInicio}`,
            endStr: `${fecha}T${horaFin}`,
            estado: estado,
          };

          onConfirmar(eventoAutializacion);
          setRefreshKey((prev) => prev + 1);
          onHide();
        })
        .catch(() => alert("No se pudo actualizar la reserva"));
    }
  };

const calcularHoraFin = (horaInicio) => {
  const [hora, minutos] = horaInicio.split(':').map(Number);
  
  const nuevaHora = new Date();
  nuevaHora.setHours(hora);
  nuevaHora.setMinutes(minutos);
  nuevaHora.setSeconds(0);
  nuevaHora.setMilliseconds(0);

  // Sumar una hora (en milisegundos)
  nuevaHora.setTime(nuevaHora.getTime() + 60 * 60 * 1000);

  // Devolver solo HH:mm
  return nuevaHora.toTimeString().slice(0, 5);
};


  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{event?.id ? 'Editar Reserva' : 'Crear Reserva'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de reserva</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              required={true}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Form.Group>

          {isAuthenticated && usuario?.tipo === 'admin' && (
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                min={fechaMin}
                max={fechaMax}
                onChange={(e) => setFecha(e.target.value)}
              />
            </Form.Group>
          )}

          {isAuthenticated && usuario?.tipo === 'cliente' && (
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={fecha}
                min={fechaMin}
                max={fechaMax}
                onChange={(e) => setFecha(e.target.value)}
                readOnly
              />
            </Form.Group>
          )}


          {isAuthenticated && usuario?.tipo === 'admin' && (
            <Form.Group className="mb-3">
              <Form.Label>Hora inicio</Form.Label>
              <Form.Control
                type="time"
                value={horaInicio}
                onChange={(e) => { setHoraInicio(e.target.value) }}
              />
            </Form.Group>
          )}

          {isAuthenticated && usuario?.tipo === 'cliente' && (
            <Form.Group className="mb-3">
              <Form.Label>Hora inicio</Form.Label>
              <Form.Control
                type="time"
                value={horaInicio}
                onChange={(e) => {
                  const nuevaHoraInicio = e.target.value;
                  setHoraInicio(nuevaHoraInicio);
                  setHoraFin(calcularHoraFin(nuevaHoraInicio));
                }}
                readOnly
              />
            </Form.Group>
          )}

          {isAuthenticated && usuario?.tipo === 'admin' && (
            <Form.Group className="mb-3">
              <Form.Label>Hora fin</Form.Label>
              <Form.Control
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
              />
            </Form.Group>
          )}

          {isAuthenticated && usuario?.tipo === 'cliente' && (
            <Form.Group className="mb-3">
              <Form.Label>Hora fin</Form.Label>
              <Form.Control
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                readOnly
              />
            </Form.Group>
          )}

          {isAuthenticated && usuario?.tipo !== 'cliente' && (
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
          )}

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>

        {isAuthenticated && usuario?.tipo === 'cliente' && (
          // <button onClick={handlePagoReserva} className="btn btn-success">
          //   Pago en linea
          // </button>
          <EpaycoButton/>
        )}

        {isAuthenticated && usuario?.tipo === 'admin' && (
          <Button variant="success" onClick={handleActualizarRegistro}>
            Guardar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
