import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { crearUsuario } from '../services/usuarioService';
// import { RegistrarUsuario } from '../services/usuarioService';

export default function Registro() {
    const navigate = useNavigate();
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmarPassword: '',
        persona: {
            nombres: '',
            apellidos: '',
            documento: '',
            telefono: '',
            direccion: {
                barrio: '',
                comuna: '',
                calle: '',
                numero: ''
            }
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // campos anidados
        if (name.includes('persona.direccion.')) {
            const key = name.replace('persona.direccion.', '');
            setForm({
                ...form,
                persona: {
                    ...form.persona,
                    direccion: {
                        ...form.persona.direccion,
                        [key]: value
                    }
                }
            });
        } else if (name.includes('persona.')) {
            const key = name.replace('persona.', '');
            setForm({
                ...form,
                persona: {
                    ...form.persona,
                    [key]: value
                }
            });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (form.password !== form.confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const { confirmarPassword, ...datosUsuario } = form;
            await crearUsuario(datosUsuario);
            setMensaje('Usuario registrado correctamente.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error(err);
            setError('Ocurrió un error al registrar el usuario.');
        }
    };

    return (
        <div className="fondo fondo-imagen-registro container d-flex align-items-center justify-content-center vh-100">
            <div className="card p-4 shadow" style={{ maxWidth: '600px', width: '100%' }}>
                <h4 className="text-center mb-4">Registro de Usuario</h4>

                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {mensaje && <div className="alert alert-success">{mensaje}</div>}

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Nombres</label>
                            <input name="persona.nombres" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Apellidos</label>
                            <input name="persona.apellidos" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Documento</label>
                            <input name="persona.documento" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Teléfono</label>
                            <input name="persona.telefono" className="form-control" required onChange={handleChange} />
                        </div>
                    </div>

                    <hr />
                    <h6 className="mb-3">Dirección</h6>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Barrio</label>
                            <input name="persona.direccion.barrio" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Comuna</label>
                            <input name="persona.direccion.comuna" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Calle</label>
                            <input name="persona.direccion.calle" className="form-control" required onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Número</label>
                            <input name="persona.direccion.numero" className="form-control" required onChange={handleChange} />
                        </div>
                    </div>

                    <hr />
                    <h6 className="mb-3">Datos de acceso</h6>
                    <div className="mb-3">
                        <label>Correo electrónico</label>
                        <input type="email" name="email" className="form-control" required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label>Contraseña</label>
                        <input type="password" name="password" className="form-control" required minLength={6} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label>Confirmar contraseña</label>
                        <input type="password" name="confirmarPassword" className="form-control" required minLength={6} onChange={handleChange} />
                    </div>

                    <div className="d-grid">
                        <button className="btn btn-dark" type="submit">
                            <i className="bi bi-person-plus me-1"></i> Registrarse
                        </button>
                    </div>
                    <div className="mt-3 text-center">
                        <span>¿Ir a login? </span>
                        <Link to="/login">Iniciar sesion</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
