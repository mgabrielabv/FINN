window.alertaConfirmacion = alertaConfirmacion;
window.alertaEliminar = alertaEliminar;
// Hacer accesibles las funciones desde window para scripts no-modulares
window.alertaMensaje = alertaMensaje;
window.alertaUsuarioExistente = alertaUsuarioExistente;
// Sistema centralizado de alertas personalizadas

/**
 * Muestra una alerta de confirmación tipo modal.
 * @param {string} mensaje - Mensaje a mostrar.
 * @returns {Promise<boolean>} - true si el usuario confirma, false si cancela.
 */

function alertaConfirmacion(mensaje = '¿Estás seguro?') {
  return new Promise(resolve => {
    // Bloquea scroll
    document.body.style.overflow = 'hidden';
    const fondo = document.createElement('div');
    fondo.className = 'alerta-fondo';
    const modal = document.createElement('div');
    modal.className = 'alerta-modal error';
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'alerta-mensaje';
    mensajeDiv.textContent = mensaje;
    modal.appendChild(mensajeDiv);
    const btns = document.createElement('div');
    btns.className = 'alerta-botones';
    const btnSi = document.createElement('button');
    btnSi.textContent = 'Sí';
    btnSi.className = 'alerta-btn';
    const btnNo = document.createElement('button');
    btnNo.textContent = 'No';
    btnNo.className = 'alerta-btn cancelar';
    btnSi.onclick = () => { document.body.removeChild(fondo); document.body.style.overflow = ''; resolve(true); };
    btnNo.onclick = () => { document.body.removeChild(fondo); document.body.style.overflow = ''; resolve(false); };
    btns.appendChild(btnSi);
    btns.appendChild(btnNo);
    modal.appendChild(btns);
    fondo.appendChild(modal);
    document.body.appendChild(fondo);
    // Cerrar con Escape
    const keyHandler = (e) => {
      if (e.key === 'Escape') { document.body.removeChild(fondo); document.body.style.overflow = ''; resolve(false); document.removeEventListener('keydown', keyHandler); }
    };
    document.addEventListener('keydown', keyHandler);
  });
}

/**
 * Muestra una alerta de error/información tipo modal.
 * @param {string} mensaje - Mensaje a mostrar.
 * @param {string} [tipo='error'] - 'error' | 'info' | 'success'
 */

function alertaMensaje(mensaje, tipo = 'error') {
  return new Promise(resolve => {
    // Bloquea scroll
    document.body.style.overflow = 'hidden';
    const fondo = document.createElement('div');
    fondo.className = 'alerta-fondo';
    const modal = document.createElement('div');
    modal.className = `alerta-modal ${tipo}`;
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'alerta-mensaje';
    mensajeDiv.textContent = mensaje;
    modal.appendChild(mensajeDiv);
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.className = 'alerta-btn';
    btn.onclick = () => { document.body.removeChild(fondo); document.body.style.overflow = ''; resolve(); };
    modal.appendChild(btn);
    fondo.appendChild(modal);
    document.body.appendChild(fondo);
    // Cerrar con Enter o Escape
    const keyHandler = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') { document.body.removeChild(fondo); document.body.style.overflow = ''; resolve(); document.removeEventListener('keydown', keyHandler); }
    };
    document.addEventListener('keydown', keyHandler);
  });
}

// Alerta específica: ¿Desea eliminar?
function alertaEliminar() {
  return alertaConfirmacion('¿Desea eliminar esta transacción?');
}

// Alerta específica: Ya hay un usuario guardado
function alertaUsuarioExistente() {
  alertaMensaje('Ya hay un usuario guardado. No se puede guardar otro.', 'error');
}

// Puedes agregar más alertas específicas aquí...