import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from '../utils/event-utils'
import esLocale from '@fullcalendar/core/locales/es';
import { Sidebar } from './Sidebar'
import { actualizarReserva, ObtenerEscenarios, ObtnerReservasPorIdCancha } from '../services/reservaService'
import ModalReserva from './ModalReserva';
import { useAuth } from './AuthContext'
import ContadorReservas from './ContadorReservas'
import { obtenerCanchaInicial } from '../services/canchaService'
import { DateTime } from 'luxon'
import '../css/reservas.css'

const esSemanaActual = (fecha) => {
    const hoy = new Date();
    const diaActual = hoy.getDay(); // 0 (domingo) - 6 (sábado)
    const diferenciaLunes = diaActual === 0 ? -6 : 1 - diaActual; // Si es domingo, retrocede 6 días

    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() + diferenciaLunes);
    inicioSemana.setHours(0, 0, 0, 0);

    // Calcular fin de semana (domingo)
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    // Validar si la fecha dada está en ese rango
    return fecha >= inicioSemana && fecha <= finSemana;
};
function getColorByEstado(estado) {
    switch (estado) {
        case 'pendiente': return '#fbbc04';   // Amarillo
        case 'confirmado': return '#34a853';  // Verde
        case 'cancelado': return '#ea4335';   // Rojo
        default: return '#9e9e9e';            // Gris por defecto
    }
}
function validarSemanaActual(fecha) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar hora

    // Obtener el primer día de la semana (lunes)
    const inicioSemana = new Date(hoy);
    const dia = hoy.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
    const diferencia = dia === 0 ? -6 : 1 - dia; // Si es domingo (0), retroceder 6 días
    inicioSemana.setDate(hoy.getDate() + diferencia);
    inicioSemana.setHours(0, 0, 0, 0);

    // Último día de la semana (domingo)
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    const fechaEvaluada = new Date(fecha);
    fechaEvaluada.setHours(0, 0, 0, 0);

    return (
        fechaEvaluada >= hoy &&           // No permitir días anteriores a hoy
        fechaEvaluada >= inicioSemana &&
        fechaEvaluada <= finSemana        // Dentro de la semana laboral actual (lun a dom)
    );
}

export default function Reservas() {
    const editableRef = useRef(null);
    const calendarRef = useRef();
    const lastClickTime = useRef(0);
    const { usuario, actualizarUsuario, isAuthenticated } = useAuth();

    const [editableCalendario, setEditableCalendario] = useState(true);

    const [weekendsVisible, setWeekendsVisible] = useState(true)
    const [currentEvents, setCurrentEvents] = useState([])
    const [eventos, setEventos] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [nuevaReservaInfo, setNuevaReservaInfo] = useState(null);
    const [eventosPorCancha, setEventosPorCancha] = useState({});
    const [escenarios, setEscenarios] = useState([]);

    const [canchaSeleccionado, setCanchaSeleccionado] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!usuario) return;
        cargarEscenarios();
    }, [usuario?.id, refreshKey]);


    useEffect(() => {
        const obtenerReservasPorCanchaId = async () => {
            if (!canchaSeleccionado) return;

            const eventosList = await ObtnerReservasPorIdCancha(canchaSeleccionado.id);

            const data = eventosList.map(res => ({
                id: res.id,
                title: res.motivo,
                start: `${res.fecha}T${res.hora_inicio.slice(0, 5)}`,
                end: `${res.fecha}T${res.hora_fin.slice(0, 5)}`,
                extendedProps: {
                    estado: res.estado,
                    fecha: res.fecha,
                    canchaId: res.canchaId,
                    usuarioId: res.usuarioId,
                },
            }));

            setEventos(data);
        };

        // actualizarUsuario();
        obtenerReservasPorCanchaId();
    }, [canchaSeleccionado, refreshKey]);

    const cargarEscenarios = async () => {
        if (!usuario) return;

        try {
            if (usuario.tipo === "admin") {
                const escenariosAdmin = usuario.escenario;

                if (Array.isArray(escenariosAdmin) && escenariosAdmin.length > 0) {
                    const cancha = await obtenerCanchaInicial(escenariosAdmin[0].id);
                    setEscenarios(escenariosAdmin);
                    setCanchaSeleccionado(cancha);
                } else {
                    console.warn("El usuario administrador no tiene escenarios disponibles.");
                }

            } else if (usuario.tipo === "cliente") {
                const escenariosCliente = await ObtenerEscenarios();

                if (Array.isArray(escenariosCliente) && escenariosCliente.length > 0) {
                    const cancha = await obtenerCanchaInicial('');
                    setCanchaSeleccionado(cancha);
                    setEscenarios(escenariosCliente);
                } else {
                    console.error("Los escenarios recibidos no son válidos o están vacíos:", escenariosCliente);
                }
            }
        } catch (error) {
            console.error("Error al cargar escenarios:", error);
        }
    };

    const renderEventContent = (eventInfo) => {
        const estado = eventInfo.event.extendedProps.estado;
        const color = getColorByEstado(estado);

        return (
            <div style={{
                borderLeft: `5px solid ${color}`,
                backgroundColor: '#f9f9f9',
                padding: '6px 8px',
                borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                fontSize: '0.85rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>{eventInfo.timeText}</span>
                    <span style={{
                        backgroundColor: color,
                        color: '#fff',
                        padding: '2px 6px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        textTransform: 'capitalize'
                    }}>
                        {estado}
                    </span>
                </div>
                <div style={{ color: '#555' }}>
                    {eventInfo.event.title}
                </div>
            </div>
        );
    };

    const handleDateSelect = (selectInfo) => {
        let title = prompt('Please enter a new title for your event')
        let calendarApi = selectInfo.view.calendar

        calendarApi.unselect() // clear date selection

        if (title) {
            calendarApi.addEvent({
                id: createEventId(),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay
            })
        }
    }

    const handleEventClick = (clickInfo) => {
        clickInfo.jsEvent.preventDefault();

        if (!clickInfo || !clickInfo.event) return;

        const evento = clickInfo.event;

        setSelectedEvent({
            id: evento.id,
            title: evento.title,
            start: evento.start,
            end: evento.end,
            fecha: evento.start?.toISOString().split('T')[0],
            escenarioId: evento.extendedProps.escenarioId,
            usuarioId: evento.extendedProps.usuarioId,
            extendedProps: {
                estado: evento.extendedProps?.estado || 'pendiente',
            },
        });

        // Mostrar modal solo si es admin o cliente (según tu lógica)
        if (usuario.tipo === 'admin') {
            setShowModal(true);
        }
    };

    const handleActualizarReserva = (updatedEvent) => {
        if (usuario.tipo === 'admin') {
            const canchaId = canchaSeleccionado?.id;
            if (!canchaId) return;

            setEventosPorCancha((prev) => {
                const eventosActualizados = [
                    ...(prev[canchaId] || []).filter((e) => e.id !== updatedEvent.id),
                    {
                        id: updatedEvent.id,
                        title: updatedEvent.title,
                        start: updatedEvent.startStr,
                        end: updatedEvent.endStr,
                        estado: updatedEvent.estado,
                        fecha: updatedEvent.fecha,
                    },
                ];

                return {
                    ...prev,
                    [canchaId]: eventosActualizados,
                };
            });

            setRefreshKey((prev) => prev + 1);
            setShowModal(false);
            setNuevaReservaInfo(null);
        }
    };

    const handleRightClick = (info) => {
        if (validarSemanaActual(info.date)) {
            info.jsEvent.preventDefault(); // evita el menú del navegador

            const confirmDelete = window.confirm(`¿Deseas eliminar la reserva "${info.event.title}"?`);

            if (confirmDelete) {
                info.event.remove();
                // Si también quieres eliminarlo del backend, hazlo aquí con fetch o axios
            }
        }
    };

    const handleEventMount = (info) => {
        if (validarSemanaActual(info.date)) {
            info.el.addEventListener('contextmenu', (e) => {
                handleRightClick({ event: info.event, jsEvent: e });
            });
        }
    };

    const nuevaReserva = (evento) => {
        setEventos(prev => [...prev, evento]);
    };

    const ValidarHorarReserva = ({ fecha, horaInicio, horaFin, canchaId, eventos }) => {
        const inicioNueva = DateTime.fromFormat(`${fecha} ${horaInicio}`, 'yyyy-MM-dd HH:mm');
        const finNueva = DateTime.fromFormat(`${fecha} ${horaFin}`, 'yyyy-MM-dd HH:mm');

        return eventos.some(evento => {
            if (evento.extendedProps.canchaId !== canchaId || evento.extendedProps.fecha !== fecha) return false;

            const horaInicioExistente = DateTime.fromISO(evento.start instanceof Date ? evento.start.toISOString() : evento.start);
            const horaFinExistente = DateTime.fromISO(evento.end instanceof Date ? evento.end.toISOString() : evento.end);

            return (
                inicioNueva < horaFinExistente &&
                finNueva > horaInicioExistente
            );
        });
    };

    const handleClicknuevoEvento = (info) => {
        if (usuario.tipo === "admin") return;

        if (!canchaSeleccionado?.id) {
            alert("Debe seleccionar una cancha antes de crear una reserva.");
            return;
        }

        if (!validarSemanaActual(info.date)) {
            return;
        }
        // Convertir a zona Bogotá
        const startUtc = DateTime.fromISO(info.date.toISOString(), { zone: 'utc' });
        const start = startUtc.setZone('America/Bogota');
        const end = start.plus({ hours: 1 });

        const horaInicio = start.hour;
        const horaFin = end.hour;
        const minutosFin = end.minute;

        // Bloquear si termina después de las 23:00
        if (horaFin > 23 || (horaFin === 23 && minutosFin > 0)) {
            alert("La reserva debe terminar como máximo a las 11:00 p.m.");
            return;
        }

        if (horaInicio < 5) {
            alert("Solo se permite reservar desde las 05:00 a.m.");
            return;
        }

        const startDate = start.toJSDate();
        const endDate = end.toJSDate();

        const fecha = start.toFormat('yyyy-MM-dd');
        const horaInicioStr = start.toFormat('HH:mm');
        const horaFinStr = end.toFormat('HH:mm');
        const canchaId = canchaSeleccionado.id;

        const conflicto = ValidarHorarReserva({
            fecha,
            horaInicio: horaInicioStr,
            horaFin: horaFinStr,
            canchaId,
            eventos
        });

        if (conflicto) {
            alert('Ya existe una reserva en ese horario.');
            return;
        }

        setSelectedEvent({
            id: null,
            title: `${usuario.nombre} ${usuario.apellido}`,
            start: startDate,
            end: endDate,
            fecha,
            canchaId,
            usuarioId: usuario.id,
            extendedProps: {
                estado: 'pendiente',
            },
        });

        setShowModal(true);
    };

    const handleEvents = (events) => {
        setCurrentEvents(events)
    }

    const puedeMoverEventos = () => {
        return (usuario?.tipo === 'admin') && editableCalendario; // Solo los administradores pueden mover
    };

    const handleEventDrop = async (info) => {
        if (usuario.tipo === "admin") {
            const evento = info.event;

            const nuevaFecha = evento.start.toISOString().substring(0, 10);
            const nuevaHoraInicio = evento.start.toTimeString().substring(0, 5);
            const nuevaHoraFin = evento.end ? evento.end.toTimeString().substring(0, 5) : nuevaHoraInicio;

            const updatedReserva = {
                cancha_id: evento.extendedProps.canchaId,
                usuario_id: evento.extendedProps.usuarioId,
                datos: [
                    {
                        hora_inicio: nuevaHoraInicio,
                        hora_fin: nuevaHoraFin,
                        fecha: nuevaFecha,
                    }
                ]
            };

            try {
                await actualizarReserva(evento.id, updatedReserva);
            } catch (error) {
                console.error("Error al actualizar reserva:", error);
                alert('Error al actualizar la reserva');
                info.revert(); // Revierte el cambio si falla
            }
        }
        else {
            info.revert();
        }
    };

    return (
        <div className='app-container'>
            <Sidebar
                escenarios={escenarios}
                canchaSeleccionado={canchaSeleccionado}
                onSeleccionarCancha={setCanchaSeleccionado}
            />
            {isAuthenticated && usuario?.tipo === 'admin' && (
                <ContadorReservas refreshKey={refreshKey} />
            )}

            <div className='content-calentario'>
                <FullCalendar
                    allDaySlot={false}
                    ref={calendarRef}
                    locale={esLocale}
                    height={window.innerHeight - 100}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    slotMinTime="05:00:00"     // Hora mínima visible (inicio del día)
                    slotMaxTime="23:00:00"     // Hora máxima visible (fin del día)
                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true // Esto activa el formato AM/PM
                    }}
                    headerToolbar={{
                        left: (usuario?.tipo === 'admin' ? 'prev,today,next' : 'today'),
                        center: 'customTitle',
                        right: 'timeGridWeek,timeGridDay'
                    }}
                    customButtons={{
                        customTitle: {
                            text: `Ubicacion: ${canchaSeleccionado?.ubicacion} - Reserva ⚽- ${canchaSeleccionado?.nombre}`,
                            click: () => { }, // obligatorio aunque no haga nada
                        }
                    }}
                    dayHeaderFormat={{
                        weekday: 'long', // 'short' para "lun", 'narrow' para "L", 'long' para "lunes"
                        day: '2-digit',
                        month: '2-digit'
                    }}
                    validRange={() => {
                        const today = new Date();
                        const endOfWeek = new Date(today);
                        const day = today.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
                        const daysUntilSunday = 7 - day;
                        endOfWeek.setDate(today.getDate() + daysUntilSunday);
                        endOfWeek.setHours(23, 59, 59, 999);

                        return { end: endOfWeek };
                    }}
                    datesSet={(arg) => {
                        const inicioVista = new Date(arg.start);
                        const editable = esSemanaActual(inicioVista);

                        if (editableRef.current !== editable) {
                            editableRef.current = editable;
                            setEditableCalendario(editable); // solo se ejecuta si cambia
                        }
                    }}

                    selectable={false}
                    editable={puedeMoverEventos}
                    eventStartEditable={puedeMoverEventos}
                    eventDurationEditable={puedeMoverEventos}
                    eventDrop={puedeMoverEventos ? handleEventDrop : null}
                    selectMirror={puedeMoverEventos}
                    dateClick={editableCalendario ? handleClicknuevoEvento : null}
                    weekends={weekendsVisible}

                    key={canchaSeleccionado?.id}
                    events={eventos}
                    droppable={true}
                    eventDidMount={editableCalendario ? handleEventMount : null}
                    select={editableCalendario ? handleDateSelect : null}
                    eventClick={editableCalendario ? handleEventClick : null}

                    eventsSet={editableCalendario ? handleEvents : null}
                    eventContent={editableCalendario ? renderEventContent : null}
                />
            </div>
            <ModalReserva
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
                event={selectedEvent}
                nuevaReserva={nuevaReserva}
                onConfirmar={handleActualizarReserva}
                setRefreshKey={setRefreshKey}
            />

        </div>
    )
}

