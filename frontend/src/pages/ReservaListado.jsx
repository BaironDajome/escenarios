import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ObtnerReservasPorEscenario } from "../services/reservaService";

export default function ReservaListado() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10);
  const printRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await ObtnerReservasPorEscenario();
        
        setReservas(data);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      }
    };
    cargar();
  }, []);

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=700,width=1000');

    win.document.write(`
      <html>
        <head>
          <title>Listado de Reservas</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            @media print {
              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              table {
                page-break-inside: auto;
              }
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
              thead {
                display: table-header-group;
              }
              tfoot {
                display: table-footer-group;
              }
            }
          </style>
        </head>
        <body>
          <div class="container mt-4">
            <h2 class="text-center mb-4">📋 Listado de Reservas</h2>
            ${printContents}
          </div>
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.onload = () => {
      win.print();
      win.close();
    };
  };

const reservasFiltradas = reservas?.length > 0
  ? reservas.filter((r) =>
      (r.motivo?.toLowerCase() ?? '').includes(filtro.toLowerCase()) ||
      (r.estado?.toLowerCase() ?? '').includes(filtro.toLowerCase())
    )
  : [];


  const totalPaginas = Math.ceil(reservasFiltradas.length / elementosPorPagina);
  const reservasPaginadas = reservasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Listado de Reservas</h3>
        <div>
          <button
            onClick={() => navigate('/gestion-reserva')}
            className="btn text-white me-2"
            style={{ backgroundColor: '#343a40' }}
          >
            <i className="bi bi-arrow-left me-1"></i> Atrás
          </button>
          <button
            onClick={handlePrint}
            className="btn text-white"
            style={{ backgroundColor: '#343a40' }}
          >
            <i className="bi bi-printer me-1"></i> Imprimir
          </button>
        </div>
      </div>

      {/* Filtro y cantidad por página */}
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <label htmlFor="filtro" className="me-2 mb-0 fw-bold">Consultar:</label>
          <input
            id="filtro"
            type="text"
            className="form-control"
            placeholder="Buscar por motivo o estado..."
            value={filtro}
            onChange={(e) => {
              setFiltro(e.target.value);
              setPaginaActual(1);
            }}
            style={{ maxWidth: "300px" }}
          />
        </div>
        <div className="d-flex align-items-center">
          <label htmlFor="paginacion" className="me-2 mb-0 fw-bold">Mostrar:</label>
          <select
            id="paginacion"
            className="form-select"
            value={elementosPorPagina}
            onChange={(e) => {
              setElementosPorPagina(Number(e.target.value));
              setPaginaActual(1);
            }}
            style={{ width: "100px" }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Tabla de reservas */}
      <div className="table-responsive" ref={printRef}>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Motivo</th>
              <th>Fecha</th>
              <th>Hora Inicio</th>
              <th>Hora Fin</th>
              <th>Usuario</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservasPaginadas.length > 0 ? (
              reservasPaginadas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.motivo}</td>
                  <td>{reserva.fecha}</td>
                  <td>{reserva.hora_inicio}</td>
                  <td>{reserva.hora_fin}</td>
                  <td>{reserva.nombres} {reserva.apellidos} </td>
                  <td>
                    <span
                      className={`badge ${reserva.estado === "pendiente"
                        ? "bg-warning text-dark"
                        : reserva.estado === "confirmado"
                          ? "bg-success"
                          : "bg-danger"
                        }`}
                    >
                      {reserva.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay reservas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación completa */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button className="page-link text-dark" onClick={() => cambiarPagina(paginaActual - 1)}>
                &laquo; Anterior
              </button>
            </li>

            {Array.from({ length: totalPaginas }, (_, i) => (
              <li
                key={i}
                className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => cambiarPagina(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
              <button className="page-link text-dark" onClick={() => cambiarPagina(paginaActual + 1)}>
                Siguiente &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
