import React, { useState, useEffect } from "react";

export default function CanchaModal({ mostrar, tipo, cancha, onClose, onConfirm }) {
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    estado: "",
  });

  useEffect(() => {
    if (cancha && tipo === "editar") {
      setFormData({
        nombre: cancha.nombre || "",
        ubicacion: cancha.ubicacion || "",
        estado: cancha.estado || "",
      });
    }
  }, [cancha, tipo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (tipo === "editar") {
      onConfirm({ ...cancha, ...formData }); // envía cancha editada
    } else {
      onConfirm(cancha); // para eliminar
    }
  };

  if (!mostrar) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {tipo === "editar" ? "Editar Cancha" : "Eliminar Cancha"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {tipo === "editar" ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ubicación</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                    >
                      <option value="disponible">Disponible</option>
                      <option value="ocupada">Ocupado</option>
                      <option value="mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                </>
              ) : (
                <p>
                  ¿Estás seguro de que deseas eliminar la cancha{" "}
                  <strong>{cancha?.nombre}</strong>?
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                className={`btn ${tipo === "editar" ? "btn-primary" : "btn-danger"}`}
                onClick={handleSubmit}
              >
                {tipo === "editar" ? "Guardar" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>
    </>
  );
}
