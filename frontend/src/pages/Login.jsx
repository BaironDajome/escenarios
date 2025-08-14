import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import '../css/login.css'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const usuario = await login(form);
            if (usuario) {
                console.log("Usuario autenticado:", usuario);
                navigate('/gestion-reserva');
            }
            else {
                throw new Error('Usuario no recibido');
            }
        } catch (err) {
            setError('Correo o contraseña incorrectos.');
            console.error(err);
        }
    };

    return (
        <div className="fondo fondo-imagen-login container d-flex align-items-center justify-content-center vh-100">
            <div className="overlay card p-4 shadow login-card" style={{ maxWidth: '400px', width: '100%' }}>
                <span role="img" aria-label="fútbol">⚽</span>

                <h4 className="text-center mb-4">Iniciar Sesión</h4>

                <form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            <i className="bi bi-envelope me-1"></i> Correo Electrónico
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            <i className="bi bi-lock me-1"></i> Contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="d-grid">
                        <button type="submit" className="btn text-white" style={{ backgroundColor: '#343a40' }}>
                            <i className="bi bi-box-arrow-in-right me-1"></i> Ingresar
                        </button>
                    </div>

                    <div className="mt-3 text-center">
                        <span>¿No tienes cuenta? </span>
                        <Link to="/registro">Crear una cuenta</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
