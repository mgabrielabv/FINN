window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 1200);

  // Mostrar solo login al inicio, sin clase extra
  document.querySelector('.topbar').style.display = 'none';
  document.getElementById('vista-principal').style.display = 'none';
  document.querySelector('.logo').style.display = '';
  document.querySelector('.btn-iniciar').style.display = 'block';
  document.getElementById('loginForm').style.display = 'none';

  document.querySelector('.btn-iniciar').addEventListener('click', () => {
    document.querySelector('.logo').style.display = 'none';
    document.querySelector('.btn-iniciar').style.display = 'none';
    document.getElementById('loginForm').style.display = 'flex';
  });

  const loginForm = document.getElementById('loginForm');
  const formTitle = document.getElementById('form-title');
  const formBtn = document.getElementById('form-btn');
  const showRegister = document.getElementById('showRegister');
  let modoRegistro = false;

  showRegister.addEventListener('click', function(e) {
    e.preventDefault();
    modoRegistro = true;
    formTitle.textContent = 'Crear cuenta';
    formBtn.textContent = 'Registrarse';
    showRegister.parentElement.innerHTML = '¿Ya tienes cuenta? <a href="#" id="showLogin">Iniciar sesión</a>';
    document.getElementById('showLogin').addEventListener('click', function(e) {
      e.preventDefault();
      modoRegistro = false;
      formTitle.textContent = 'Iniciar sesión';
      formBtn.textContent = 'Entrar';
      showRegister.parentElement.innerHTML = '¿No estás registrado? <a href="#" id="showRegister">Crear cuenta</a>';
      document.getElementById('showRegister').addEventListener('click', showRegister.click);
    });
  });

  // Si ya está autenticado, muestra la app directamente
  const guardadoUsuario = (localStorage.getItem('usuario') || '').trim();
  const guardadoContrasena = (localStorage.getItem('contrasena') || '').trim();
  if (guardadoUsuario && guardadoContrasena) {
    document.querySelector('.topbar').style.display = '';
    document.getElementById('vista-principal').style.display = '';
    document.getElementById('loginForm').style.display = 'none';
    document.querySelector('.logo').style.display = 'none';
    document.querySelector('.btn-iniciar').style.display = 'none';
    if (!window._appLoaded) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'ComponentesJS/app.js';
      script.onload = () => {
        if (window.asignarNavDelegation) window.asignarNavDelegation();
      };
      document.body.appendChild(script);
      window._appLoaded = true;
    } else {
      if (window.asignarNavDelegation) window.asignarNavDelegation();
    }
    return;
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const usuario = this.querySelector('input[type="text"]').value.trim();
    const contrasena = this.querySelector('input[type="password"]').value.trim();

    if (modoRegistro) {
      localStorage.setItem('usuario', usuario);
      localStorage.setItem('contrasena', contrasena);
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      modoRegistro = false;
      formTitle.textContent = 'Iniciar sesión';
      formBtn.textContent = 'Entrar';
      document.querySelector('.registro-link').innerHTML = '¿No estás registrado? <a href="#" id="showRegister">Crear cuenta</a>';
      document.getElementById('showRegister').addEventListener('click', showRegister.click);
      this.reset();
    } else {
      const guardadoUsuario = (localStorage.getItem('usuario') || '').trim();
      const guardadoContrasena = (localStorage.getItem('contrasena') || '').trim();
      if (usuario && contrasena && usuario === guardadoUsuario && contrasena === guardadoContrasena) {
        document.querySelector('.topbar').style.display = '';
        document.getElementById('vista-principal').style.display = '';
        loginForm.style.display = 'none';
        document.querySelector('.logo').style.display = 'none';
        document.querySelector('.btn-iniciar').style.display = 'none';
        if (!window._appLoaded) {
          const script = document.createElement('script');
          script.type = 'module';
          script.src = 'ComponentesJS/app.js';
          script.onload = () => {
            if (window.asignarNavDelegation) window.asignarNavDelegation();
          };
          document.body.appendChild(script);
          window._appLoaded = true;
        } else {
          if (window.asignarNavDelegation) window.asignarNavDelegation();
        }
      } else {
        alert('Usuario o contraseña incorrectos.');
      }
    }
  });
});
