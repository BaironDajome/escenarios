import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { actualizarCancha, eliminarCancha, obtenerCanchaPorEscenario } from "../services/canchaService";
import { useAuth } from "../components/AuthContext";
import CanchaModal from "../components/CanchaModal";

export default function CanchaListado() {
  const { usuario, actualizarUsuario  } = useAuth();
  const [canchas, setCanchas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina, setElementosPorPagina] = useState(10);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modalTipo, setModalTipo] = useState(""); // 'editar' o 'eliminar'
  const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);
  const printRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!usuario) return;
    cargarCanchas();
  }, [usuario?.id]);

  const cargarCanchas = async () => {
    if (!usuario) return;
    try {
      const data = await obtenerCanchaPorEscenario();

      setCanchas(data);
    } catch (error) {
      console.error("Error al cargar canchas:", error);
    }
  };

  const manejarActualizarCancha = async (datosActualizados) => {
    try {
      const datosAEnviar = {
        nombre: datosActualizados.nombre,
        ubicacion: datosActualizados.ubicacion,
        estado: datosActualizados.estado,
      };


      const canchaActualizada = await actualizarCancha(canchaSeleccionada.id, datosAEnviar);
      const nuevasCanchas = canchas.map((c) =>
        c.id === canchaActualizada.id ? canchaActualizada : c
      );
      setCanchas(nuevasCanchas);
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al editar cancha:", error);
    }
  };

  const manejarEliminarCancha = async () => {
    try {
      await eliminarCancha(canchaSeleccionada.id);
      setCanchas(canchas.filter((c) => c.id !== canchaSeleccionada.id));
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al eliminar cancha:", error);
    }
  };


  const onConfirmModal = async (datosActualizados) => {
    switch (modalTipo) {
      case "editar":
        await manejarActualizarCancha(datosActualizados);
        break;
      case "eliminar":
        await manejarEliminarCancha();
        break;
      default:
        break;
    }
  };


  const handlePrint = () => {
    const columnas = `
    <thead class="table-light">
      <tr>
        <th>Nombre</th>
        <th>Ubicación</th>
        <th>Fecha de creación</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      ${canchas.map((cancha) => `
        <tr>
          <td>${cancha.nombre}</td>
          <td>${cancha.ubicacion}</td>
          <td>${new Date(cancha.fechaCreacion).toLocaleDateString('es-CO')}</td>
          <td>${cancha.estado}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

    const win = window.open('', '', 'height=700,width=1000');
    win.document.write(`
    <html>
      <head>
        <title>Listado de Canchas</title>
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
          <h2 class="text-center mb-4">⚽ Listado de Canchas</h2>
          <table class="table table-bordered table-striped">
            ${columnas}
          </table>
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

  const abrirModal = (cancha, tipo) => {
    setCanchaSeleccionada(cancha);
    setModalTipo(tipo);
    setMostrarModal(true);
  };

  const canchasFiltradas = canchas.filter((c) =>
    (c.nombre || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (c.ubicacion || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (c.tipo || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (c.estado || "").toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(canchasFiltradas.length / elementosPorPagina);
  const canchasPaginadas = canchasFiltradas.slice(
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
        <h3>Listado de Canchas</h3>
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

      {/* Filtro y paginación */}
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <label htmlFor="filtro" className="me-2 mb-0 fw-bold">Consultar:</label>
          <input
            id="filtro"
            type="text"
            className="form-control"
            placeholder="Buscar por nombre, ubicación..."
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

      {/* Tabla */}
      <div className="table-responsive" ref={printRef}>
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Fecha de creación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {canchasPaginadas.length > 0 ? (
              canchasPaginadas.map((cancha) => (
                <tr key={cancha.id}>
                  <td>{cancha.nombre}</td>
                  <td>{cancha.ubicacion}</td>
                  <td>{cancha.fecha_creacion}</td>
                  <td>{cancha.estado}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => abrirModal(cancha, 'editar')}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => abrirModal(cancha, 'eliminar')}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay canchas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
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
              <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>
                Siguiente &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal */}
      <CanchaModal
        mostrar={mostrarModal}
        tipo={modalTipo}
        cancha={canchaSeleccionada}
        onClose={() => setMostrarModal(false)}
        onConfirm={onConfirmModal}
      />

    </div>
  );
}
