import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import logoSantaPriscila from "../../assets/logo_SantaPriscila.png";
import logoMelacorp from "../../assets/melacorp.png";
import "./Login.css";

export default function Login() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    identifier: "",
    password: "",
    general: "",
  });

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "identifier":
        if (!value.trim()) {
          return "Usuario o email es requerido";
        }
        if (value.length < 3) {
          return "Debe tener al menos 3 caracteres";
        }
        return "";
      case "password":
        if (!value) {
          return "Contraseña es requerida";
        }
        if (value.length < 6) {
          return "Debe tener al menos 6 caracteres";
        }
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    if (name !== "rememberMe") {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
        general: "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrors({
      identifier: "",
      password: "",
      general: "",
    });

    const identifierError = validateField("identifier", formData.identifier);
    const passwordError = validateField("password", formData.password);

    if (identifierError || passwordError) {
      setErrors({
        identifier: identifierError,
        password: passwordError,
        general: "",
      });
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      console.error("Error en login:", error);
      setErrors({
        identifier: "",
        password: "",
        general:
          error instanceof Error ? error.message : "Error al iniciar sesión",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src={logoSantaPriscila}
            alt="Santa Priscila"
            className="logo-main"
          />
          <h1>Portal de Administración del ChatBot de IPSP</h1>
          <p>Ingrese sus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {errors.general && (
            <div className="alert alert-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="identifier">Usuario o Email</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              className={errors.identifier ? "input-error" : ""}
              placeholder="Ingrese su usuario o email"
              autoComplete="username"
              disabled={isLoading}
            />
            {errors.identifier && (
              <span className="error-message">{errors.identifier}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "input-error" : ""}
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                disabled={isLoading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group-checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <span>Recordar sesión</span>
            </label>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-footer">
          <div className="powered-by">
            <span>Powered by</span>
            <img src={logoMelacorp} alt="Melacorp" className="logo-melacorp" />
          </div>
        </div>
      </div>
    </div>
  );
}
