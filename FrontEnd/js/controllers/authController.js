// js/controllers/authController.js

import {
  fazerLogin,
  fazerCadastro,
  fazerLogout,
  observarUsuario,
} from "../services/authService.js";

class AuthController {
  constructor() {
    this._logado = false;
    this._usuario = null;
    this._ouvintes = [];

    observarUsuario((usuario) => {
      this._usuario = usuario;
      this._logado = !!usuario;
      this._notificar();
    });
  }

  get logado() {
    return this._logado;
  }

  get usuario() {
    return this._usuario;
  }

  async login(email, senha) {
    const usuario = await fazerLogin(email, senha);
    this._usuario = usuario;
    this._logado = true;
    this._notificar();
    return usuario;
  }

  async cadastrar(email, senha, dadosExtras = {}) {
    const usuario = await fazerCadastro(email, senha, dadosExtras);
    this._usuario = usuario;
    this._logado = true;
    this._notificar();
    return usuario;
  }

  async logout() {
    await fazerLogout();
    this._usuario = null;
    this._logado = false;
    this._notificar();
  }

  onChange(callback) {
    this._ouvintes.push(callback);
    return () => {
      this._ouvintes = this._ouvintes.filter((cb) => cb !== callback);
    };
  }

  _notificar() {
    this._ouvintes.forEach((cb) => cb(this._logado, this._usuario));
  }
}

export const authController = new AuthController();