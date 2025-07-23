// Devuelve el total estimado de egresos para el mes y año actual
export async function getPresupuestoDashboardData() {
  const mes = Number(localStorage.getItem('presupuestoFiltroMes')) || (new Date().getMonth() + 1);
  const anio = Number(localStorage.getItem('presupuestoFiltroAnio')) || new Date().getFullYear();
  const db = await abrirDB();
  const txP = db.transaction("presupuestos", "readonly");
  const storeP = txP.objectStore("presupuestos");
  const reqP = storeP.getAll();
  return new Promise(resolve => {
    reqP.onsuccess = function() {
      const presupuestos = reqP.result.filter(p => p.mes === mes && p.anio === anio);
      let totalEstimado = 0;
      presupuestos.forEach(p => {
        totalEstimado += p.monto;
      });
      resolve({
        presupuesto: totalEstimado
      });
    };
  });
}
import { abrirDB, generarId } from './indexedDB.js';
import { cargarCategoriasTransaccion } from './categorias.js';

function getFiltroPresupuestoMes() {
  return Number(localStorage.getItem('presupuestoFiltroMes')) || (new Date().getMonth() + 1);
}
function getFiltroPresupuestoAnio() {
  return Number(localStorage.getItem('presupuestoFiltroAnio')) || new Date().getFullYear();
}
function setFiltroPresupuestoMes(val) {
  localStorage.setItem('presupuestoFiltroMes', val);
}
function setFiltroPresupuestoAnio(val) {
  localStorage.setItem('presupuestoFiltroAnio', val);
}

export async function renderPresupuesto() {
  const filtroMes = getFiltroPresupuestoMes();
  const filtroAnio = getFiltroPresupuestoAnio();
  const main = document.getElementById('vista-principal');
  main.innerHTML = `
    <div class="presupuesto-contenedor">
      <h2 class="presupuesto-titulo">Presupuesto mensual</h2>
      <form id="form-presupuesto" class="presupuesto-form">
        <select id="presupuesto-mes" required class="presupuesto-select">
          ${[...Array(12)].map((_,i)=>`<option value="${i+1}" ${filtroMes === (i+1) ? 'selected' : ''}>${(i+1).toString().padStart(2,'0')}</option>`).join('')}
        </select>
        <input type="number" id="presupuesto-anio" min="2000" max="2100" value="${filtroAnio}" required class="presupuesto-input presupuesto-anio">
        <select id="presupuesto-categoria" required class="presupuesto-select"></select>
        <input type="number" id="presupuesto-monto" min="1" placeholder="Monto" required class="presupuesto-input presupuesto-monto">
        <button type="submit" class="presupuesto-btn">Guardar</button>
      </form>
      <div class="presupuesto-filtros-row">
        <label>Mes: <select id="filtro-mes" class="presupuesto-select filtro-mes">${[...Array(12)].map((_,i)=>`<option value="${i+1}" ${filtroMes === (i+1) ? 'selected' : ''}>${(i+1).toString().padStart(2,'0')}</option>`).join('')}</select></label>
        <label>Año: <input type="number" id="filtro-anio" min="2000" max="2100" value="${filtroAnio}" class="presupuesto-input filtro-anio"></label>
      </div>
      <div id="tabla-presupuesto"></div>
      <div id="proyeccion-presupuesto"></div>
    </div>
  `;

  await llenarCategoriasPresupuesto();

  document.getElementById('filtro-mes').onchange = function() {
    setFiltroPresupuestoMes(this.value);
    mostrarTablaPresupuesto();
  };
  document.getElementById('filtro-anio').onchange = function() {
    setFiltroPresupuestoAnio(this.value);
    mostrarTablaPresupuesto();
  };

  document.getElementById('form-presupuesto').onsubmit = async function(e) {
    e.preventDefault();
    setFiltroPresupuestoMes(document.getElementById('presupuesto-mes').value);
    setFiltroPresupuestoAnio(document.getElementById('presupuesto-anio').value);
    const mes = Number(document.getElementById('presupuesto-mes').value);
    const anio = Number(document.getElementById('presupuesto-anio').value);
    const categoriaId = document.getElementById('presupuesto-categoria').value;
    const monto = Number(document.getElementById('presupuesto-monto').value);
    const db = await abrirDB();
    const tx = db.transaction("presupuestos", "readwrite");
    const store = tx.objectStore("presupuestos");
    const req = store.getAll();
    req.onsuccess = function() {
      const existe = req.result.find(p => p.anio === anio && p.mes === mes && p.categoriaId === categoriaId);
      if (existe) {
        existe.monto = monto;
        store.put(existe);
      } else {
        store.add({ id: generarId(), anio, mes, categoriaId, monto });
      }
    };
    tx.oncomplete = () => {
      mostrarTablaPresupuesto();
      this.reset();
    };
  };

  mostrarTablaPresupuesto();
}

async function llenarCategoriasPresupuesto() {
  const db = await abrirDB();
  const tx = db.transaction("categorias", "readonly");
  const store = tx.objectStore("categorias");
  const req = store.getAll();
  req.onsuccess = function() {
    const select = document.getElementById('presupuesto-categoria');
    select.innerHTML = '';
    req.result.forEach(cat => {
      select.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
    });
  };
}

async function mostrarTablaPresupuesto() {
  const mes = Number(document.getElementById('filtro-mes').value);
  const anio = Number(document.getElementById('filtro-anio').value);
  const db = await abrirDB();
  const txP = db.transaction("presupuestos", "readonly");
  const storeP = txP.objectStore("presupuestos");
  const reqP = storeP.getAll();
  reqP.onsuccess = async function() {
    const presupuestos = reqP.result.filter(p => p.mes === mes && p.anio === anio);
    const txC = db.transaction("categorias", "readonly");
    const storeC = txC.objectStore("categorias");
    const reqC = storeC.getAll();
    reqC.onsuccess = async function() {
      const categorias = reqC.result;
      const txT = db.transaction("transacciones", "readonly");
      const storeT = txT.objectStore("transacciones");
      const reqT = storeT.getAll();
      reqT.onsuccess = function() {
        const transacciones = reqT.result.filter(t => {
          const [y, m] = t.fecha.split('-');
          return Number(y) === anio && Number(m) === mes && t.tipo === "Egreso";
        });
        let html = `
          <table style="width:100%; border-collapse:collapse;">
            <tr>
              <th>Categoría</th>
              <th>Estimado</th>
              <th>Real</th>
              <th>Estado</th>
            </tr>
        `;
        let totalEstimado = 0, totalReal = 0;
        categorias.forEach(cat => {
          const pres = presupuestos.find(p => p.categoriaId === cat.id);
          const estimado = pres ? pres.monto : 0;
          const real = transacciones.filter(t => t.categoriaId === cat.id).reduce((sum, t) => sum + Number(t.monto), 0);
          totalEstimado += estimado;
          totalReal += real;
          const diferencia = real - estimado;
          let color = '';
          if (estimado === 0 && real === 0) {
            color = '';
          } else if (diferencia > 0) {
            color = 'color:#e74c3c;font-weight:bold;';
          } else {
            color = 'color:#2ecc40;font-weight:bold;';
          }
          let diffStr = '';
          if (estimado === 0 && real === 0) {
            diffStr = '';
          } else if (diferencia > 0) {
            diffStr = `+${diferencia}`;
          } else {
            diffStr = `${diferencia}`;
          }
          html += `
            <tr>
              <td>${cat.nombre}</td>
              <td style="text-align:right;">${estimado}</td>
              <td style="text-align:right;">${real}</td>
              <td style="text-align:center;${color}">${diffStr}</td>
            </tr>
          `;
        });
        html += `</table>`;
        document.getElementById('tabla-presupuesto').innerHTML = html;
        document.getElementById('proyeccion-presupuesto').innerHTML = `
          <div style="margin-top:12px;">
            <b>Total estimado egresos:</b> ${totalEstimado} &nbsp; 
            <b>Total real:</b> ${totalReal}
          </div>
        `;
      };
    };
  };
}
