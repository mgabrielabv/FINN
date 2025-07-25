import { abrirDB } from './indexedDB.js';


export async function cargarCategoriasTransaccion() {
  const db = await abrirDB();
  const tx = db.transaction("categorias", "readonly");
  const store = tx.objectStore("categorias");
  const req = store.getAll();
  req.onsuccess = function() {
    const select = document.getElementById('categoria-transaccion');
    if (!select) return;
    select.innerHTML = '';
    req.result.forEach(cat => {
      select.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
    });
  };
 }

const CATEGORIAS_PREDEFINIDAS = [
  'Alimentación',
  'Transporte',
  'Ocio',
  'Servicios',
  'Salud',
  'Educación',
  'Otros'
];
const ICONOS_CATEGORIAS = {
  'Alimentación': 'fa-utensils',
  'Transporte': 'fa-bus',
  'Ocio': 'fa-film',
  'Servicios': 'fa-lightbulb',
  'Salud': 'fa-heartbeat',
  'Educación': 'fa-book',
  'Otros': 'fa-ellipsis-h'
};

export async function cargarCategorias() {
  const db = await abrirDB();
  const tx = db.transaction("categorias", "readonly");
  const store = tx.objectStore("categorias");
  const req = store.getAll();
  req.onsuccess = async function() {
    let categorias = req.result;

    // NUEVO: Insertar predefinidas si faltan (sin duplicar)
    const nombresExistentes = categorias.map(c => c.nombre);
    let faltan = CATEGORIAS_PREDEFINIDAS.filter(nombre => !nombresExistentes.includes(nombre));
    if (faltan.length > 0) {
      const txAdd = db.transaction("categorias", "readwrite");
      const storeAdd = txAdd.objectStore("categorias");
      faltan.forEach(nombre => {
        storeAdd.add({ id: Date.now().toString() + Math.random().toString(36).substr(2, 5), nombre });
      });
      txAdd.oncomplete = cargarCategorias;
      return;
    }

    categorias.sort((a, b) => {
      const aNum = parseInt(a.id);
      const bNum = parseInt(b.id);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return bNum - aNum;
      }
      return 0;
    });
    if (categorias.length === 0) {
      const txAdd = db.transaction("categorias", "readwrite");
      const storeAdd = txAdd.objectStore("categorias");
      CATEGORIAS_PREDEFINIDAS.forEach(nombre => {
        storeAdd.add({ id: Date.now().toString() + Math.random().toString(36).substr(2, 5), nombre });
      });
      txAdd.oncomplete = cargarCategorias;
      return;
    }

    // Limpiar el main y renderizar el contenedor de categorías y el formulario
    const main = document.getElementById('vista-principal');
    main.innerHTML = `
      <h2>Categorías</h2>
      <div id="lista-categorias"></div>
    `;
    const lista = document.getElementById('lista-categorias');
    if (!lista) {
      console.error('No se encontró el elemento con id lista-categorias');
            await window.alertaMensaje('Error: No se encontró el contenedor de categorías (id=lista-categorias)');
      return;
    }
    // ...layout original, sin contenedor extra ni título adicional...


    document.querySelectorAll('form#form-categoria-global').forEach(f => f.remove());
    // Crear el formulario de categorías con los botones juntos
    let form = document.createElement('form');
    form.id = 'form-categoria-global';
    form.className = 'form-categoria-global';
    form.innerHTML = `
      <div class="categoria-form-row">
        <input type="text" id="nombre-categoria-input" placeholder="Nueva categoría" required class="input-categoria" style="display:none;">
        <select id="select-cat-accion" class="select-categoria" style="display:none;"></select>
        <input type="text" id="nuevo-nombre-cat" placeholder="Nuevo nombre" class="input-categoria" style="display:none;">
        <button type="button" id="btn-confirmar-eliminar" class="btn-confirmar-eliminar" style="display:none;">Confirmar eliminación</button>
      </div>
      <div class="categoria-form-row categoria-form-row-botones">
        <button type="button" id="btn-agregar-cat" class="btn-categoria">Agregar</button>
        <button type="button" id="btn-editar-cat" class="btn-categoria">Editar</button>
        <button type="button" id="btn-eliminar-cat" class="btn-categoria">Eliminar</button>
      </div>
    `;

    main.insertBefore(form, lista.nextSibling);

    Array.from(form.querySelectorAll('.btn-categoria')).forEach(btn => {
      btn.onmouseover = () => {
        btn.style.background = '#D4B483';
        btn.style.color = '#1C1C1C';
        btn.style.borderColor = '#D4B483';
      };
      btn.onmouseout = () => {
        btn.style.background = '#1E3D59';
        btn.style.color = '#F9F9F9';
        btn.style.borderColor = '#1E3D59';
      };
    });
    const inputNueva = form.querySelector('#nombre-categoria-input');
    const btnAgregar = form.querySelector('#btn-agregar-cat');
    const btnEditar = form.querySelector('#btn-editar-cat');
    const btnEliminar = form.querySelector('#btn-eliminar-cat');
    const selectAccion = form.querySelector('#select-cat-accion');
    const inputNuevoNombre = form.querySelector('#nuevo-nombre-cat');
    const btnConfirmarEliminar = form.querySelector('#btn-confirmar-eliminar');

    function ocultarTodosInputs() {
      inputNueva.style.display = 'none';
      selectAccion.style.display = 'none';
      inputNuevoNombre.style.display = 'none';
      btnConfirmarEliminar.style.display = 'none';
      form.onsubmit = null;
    }

    btnAgregar.onclick = async function() {
      ocultarTodosInputs();
      inputNueva.style.display = '';
      inputNueva.focus();
      // Al presionar Enter o hacer click en Agregar, agrega la categoría
      inputNueva.onkeydown = async function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const nombre = inputNueva.value.trim();
          if (!nombre) return;
          const db2 = await abrirDB();
          const tx2 = db2.transaction("categorias", "readwrite");
          tx2.objectStore("categorias").add({ id: Date.now().toString() + Math.random().toString(36).substr(2, 5), nombre });
          tx2.oncomplete = cargarCategorias;
          inputNueva.value = '';
          inputNueva.style.display = 'none';
        }
      };
      // Si el usuario hace click de nuevo en Agregar con el input visible, agrega
      btnAgregar.onclick = async function() {
        const nombre = inputNueva.value.trim();
        if (!nombre) return;
        const db2 = await abrirDB();
        const tx2 = db2.transaction("categorias", "readwrite");
        tx2.objectStore("categorias").add({ id: Date.now().toString() + Math.random().toString(36).substr(2, 5), nombre });
        tx2.oncomplete = cargarCategorias;
        inputNueva.value = '';
        inputNueva.style.display = 'none';
      };
    };

    btnEliminar.onclick = function() {
      ocultarTodosInputs();
      actualizarSelectCategorias();
      selectAccion.style.display = '';
      btnConfirmarEliminar.style.display = '';
      btnConfirmarEliminar.onclick = async function() {
        const id = selectAccion.value;
        if (!id) return;
            if (!(await window.alertaConfirmacion('¿Eliminar la categoría seleccionada?'))) return;
        const db2 = await abrirDB();
        const tx2 = db2.transaction("categorias", "readwrite");
        tx2.objectStore("categorias").delete(id);
        tx2.oncomplete = cargarCategorias;
      };
    };

    btnEditar.onclick = function() {
      ocultarTodosInputs();
      actualizarSelectCategorias();
      selectAccion.style.display = '';
      inputNuevoNombre.style.display = '';
      btnConfirmarEliminar.style.display = 'none';
      selectAccion.onchange = null;
      selectAccion.onchange = function() {
        inputNuevoNombre.value = '';
      };
      // Al presionar Enter en el input de nuevo nombre
      inputNuevoNombre.onkeydown = async function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          const id = selectAccion.value;
          const nuevoNombre = this.value.trim();
          if (!id || !nuevoNombre) return;
          const db2 = await abrirDB();
          const tx2 = db2.transaction("categorias", "readwrite");
          const req = tx2.objectStore("categorias").get(id);
          req.onsuccess = function() {
            const cat = req.result;
            if (cat) {
              cat.nombre = nuevoNombre;
              tx2.objectStore("categorias").put(cat);
            }
          };
          tx2.oncomplete = cargarCategorias;
        }
      };
      btnEditar.onclick = async function() {
        const id = selectAccion.value;
        const nuevoNombre = inputNuevoNombre.value.trim();
        if (!id || !nuevoNombre) return;
        const db2 = await abrirDB();
        const tx2 = db2.transaction("categorias", "readwrite");
        const req = tx2.objectStore("categorias").get(id);
        req.onsuccess = function() {
          const cat = req.result;
          if (cat) {
            cat.nombre = nuevoNombre;
            tx2.objectStore("categorias").put(cat);
          }
        };
        tx2.oncomplete = cargarCategorias;
      };
    };

    function actualizarSelectCategorias() {
      const select = document.getElementById('select-cat-accion');
      select.innerHTML = '';
      categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nombre;
        select.appendChild(option);
      });
    }


    // Renderizar la lista de categorías
    lista.innerHTML = '';
    lista.style.display = 'flex';
    lista.style.flexDirection = 'row';
    lista.style.overflowX = 'auto';
    lista.style.gap = '32px';
    lista.style.padding = '32px 0 32px 24px';
    lista.style.margin = '0 auto';
    lista.style.scrollSnapType = 'x mandatory';
    lista.style.webkitOverflowScrolling = 'touch';
    lista.style.maxWidth = '700px';
    lista.style.boxSizing = 'border-box';
    lista.style.background = '#2c2f33';
    lista.style.borderRadius = '12px';
    lista.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';

    // Ordenar: "Otros" siempre al final
    categorias.sort((a, b) => {
      if (a.nombre === "Otros") return 1;
      if (b.nombre === "Otros") return -1;
      return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
    });

    categorias.forEach(cat => {
      const div = document.createElement('div');
      div.className = 'categoria-card';
      div.style.background = 'transparent';
      div.style.border = 'none';
      div.style.boxShadow = 'none';
      div.style.textAlign = 'center';
      div.style.color = '#fff';
      div.style.fontWeight = '600';
      div.style.fontSize = '1.08em';
      div.style.cursor = 'pointer';
      div.style.transition = 'transform 0.2s cubic-bezier(.4,1.4,.6,1)';
      div.style.minWidth = '170px';
      div.style.maxWidth = '220px';
      div.style.marginRight = '16px';
      div.style.padding = '38px 20px 28px 20px';
      div.style.display = 'flex';
      div.style.flexDirection = 'column';
      div.style.alignItems = 'center';
      div.style.scrollSnapAlign = 'start';
      div.style.height = '140px';

      div.onmouseover = () => div.style.transform = 'scale(1.08)';
      div.onmouseout = () => div.style.transform = 'scale(1)';

      let iconClass;
      if (CATEGORIAS_PREDEFINIDAS.includes(cat.nombre)) {
        iconClass = ICONOS_CATEGORIAS[cat.nombre];
      } else {
        iconClass = 'fa-user-tag';
      }

      div.innerHTML = `
        <span class="icono-categoria" style="display:inline-flex; align-items:center; justify-content:center; border:4px solid #1E3D59; border-radius:50%; width:86px; height:86px; background:rgba(30,61,89,0.12); transition:border-color 0.2s, box-shadow 0.2s;">
          <i class="fas ${iconClass}" style="font-size:3.2em; color:#fff; transition:color 0.2s;"></i>
        </span>
        <div style="font-size:1.13em; color:#F9F9F9; margin-top:12px;">${cat.nombre}</div>
      `;

    lista.style.scrollbarWidth = 'thin';
    lista.style.scrollbarColor = '#D4B483 #1C1C1C';
    lista.style.setProperty('overflow', 'auto');
    lista.style.setProperty('scrollbar-width', 'thin');
    if (!document.getElementById('scrollbar-categorias-style')) {
      const style = document.createElement('style');
      style.id = 'scrollbar-categorias-style';
      style.innerHTML = `
        #lista-categorias::-webkit-scrollbar {
          height: 12px;
          background: #1C1C1C;
          border-radius: 8px;
        }
        #lista-categorias::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #D4B483 60%, #1E3D59 100%);
          border-radius: 8px;
          border: 2px solid #1C1C1C;
        }
        #lista-categorias::-webkit-scrollbar-thumb:hover {
          background: #D4B483;
        }
      `;
      document.head.appendChild(style);
    }
      // Efecto hover para el icono
      const iconWrapper = div.querySelector('.icono-categoria');
      div.onmouseover = () => {
        div.style.transform = 'scale(1.08)';
        iconWrapper.style.borderColor = '#D4B483';
        iconWrapper.style.boxShadow = '0 0 0 4px rgba(212,180,131,0.18)';
        iconWrapper.querySelector('i').style.color = '#D4B483';
      };
      div.onmouseout = () => {
        div.style.transform = 'scale(1)';
        iconWrapper.style.borderColor = '#1E3D59';
        iconWrapper.style.boxShadow = 'none';
        iconWrapper.querySelector('i').style.color = '#fff';
      };
      lista.appendChild(div);
    });

    const contenedorBotones = document.getElementById('botones-categorias');
    if (contenedorBotones) contenedorBotones.innerHTML = '';
  };
}
