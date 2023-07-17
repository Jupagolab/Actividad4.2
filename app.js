if (typeof (Storage) !== undefined) {
  const idProducto = document.getElementById('id');
  const nombreProducto = document.getElementById('nombre');
  const cantidadProducto = document.getElementById('cantidad');
  const precioProducto = document.getElementById('precio');
  const boton = document.getElementById('agregar');
  const formulario = document.getElementById('formulario');
  const lista = document.getElementById('lista-compra');
  
  formulario.addEventListener('submit', e => {
    e.preventDefault();
    let compras = [];

    if (idProducto.value.length === 0 || nombreProducto.value.length === 0 || cantidadProducto.value.length === 0 || precioProducto.value.length === 0) {
      return alert('Debe completar todos los campos');
    }

    //comprobamos si hay una elemento en localStorage llamado compras
    if (localStorage.getItem("compras") !== null) {
      compras = JSON.parse(localStorage.getItem("compras"))

      //comprobamos si el id del producto de la compra que queremos agregar, exista ya en el arreglo de localStorage
      const comprobarCompra = compras.filter(compra => compra.id == idProducto.value);

      if (comprobarCompra.length > 0) {
        if (idProducto.value === (comprobarCompra.find(compra => compra.id == idProducto.value)).id) {
          switch (boton.value){
            case "Agregar":
              //si existe, que devuelva una alerta
              return alert(`Ya existe un producto con el id: ${idProducto.value} en la lista de compra.`);
            case "Editar":
              const i = compras.findIndex(compra => compra.id == idProducto.value);
              compras[i].nombre = nombreProducto.value;
              compras[i].cantidad = cantidadProducto.value;
              compras[i].precio = precioProducto.value;
              
              localStorage.setItem("compras", JSON.stringify(compras));
              listaCompras();
              formulario.reset();
              idProducto.disabled = false;
              boton.value = "Agregar";
              return alert("Compra modificada exitosamente");              
          }
        }
      }
    }
    
    compras.push({
      'id': idProducto.value,
      'nombre': nombreProducto.value,
      'cantidad': cantidadProducto.value,
      'precio': precioProducto.value
    });
    localStorage.setItem("compras", JSON.stringify(compras));

    listaCompras();

    formulario.reset();
    if (compras.length > 0) {
      return alert("Datos guardados en localStorage");
    }
  });

  //al momento de iniciar la pagina verificar si existen registros de compras en localStorage mendiante la funcion listaCompras()
  document.addEventListener("DOMContentLoaded", listaCompras());

  function limpiarLista() {
    while (lista.firstChild) {
      lista.removeChild(lista.firstChild);
    }
  }

  function cargarLista(compra) {
    const { id, nombre, cantidad, precio } = compra;
    idProducto.value = id;
    nombreProducto.value = nombre;
    cantidadProducto.value = Number(cantidad);
    precioProducto.value = Number(precio);
    boton.value = "Editar";
    idProducto.disabled = true;
  }
  
  function listaCompras() {
    const compras = JSON.parse(localStorage.getItem("compras")) || [];
     //crear la lista de las compras que se agregan al localStorage
    limpiarLista();

    if (compras.length > 0) {
      let total = 0;
      let monto;

      const titulo = document.createElement('h2');
      titulo.textContent = "Lista de compras";

      lista.appendChild(titulo);

      //Creamos la cabecera primero
      const tabla = document.createElement('table');
      const cabeceraTabla = document.createElement('tr');

      let idCabecera = document.createElement('th');
      idCabecera.textContent = 'Id';
      cabeceraTabla.append(idCabecera);

      let nombreCabecera = document.createElement('th');
      nombreCabecera.textContent = 'Nombre';
      cabeceraTabla.append(nombreCabecera)

      let cantidadCabecera = document.createElement('th');
      cantidadCabecera.textContent = 'Cantidad';
      cabeceraTabla.append(cantidadCabecera)

      let precioCabecera = document.createElement('th');
      precioCabecera.textContent = 'Precio';
      cabeceraTabla.append(precioCabecera);

      tabla.appendChild(cabeceraTabla);

      //luego agregamos los elementos encontrados;
      compras.forEach(compra => {
        monto = 0;

        const { id, nombre, cantidad, precio } = compra;

        const filaRegistro = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = id;
        filaRegistro.append(tdId);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = nombre;
        filaRegistro.append(tdNombre);

        const tdCantidad = document.createElement('td');
        tdCantidad.textContent = cantidad;
        filaRegistro.append(tdCantidad);

        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = precio;
        filaRegistro.append(tdPrecio);

        monto = Number(precio)*Number(cantidad);

        const editarBoton = document.createElement('button');
        editarBoton.textContent = 'Editar';
        editarBoton.type = 'button';
        editarBoton.classList.add('boton', 'boton-lista');
        //cargamos al darle click al boton llamamos a la funcion como un metodo con bind
        editarBoton.onclick = cargarLista.bind(null, compra);

        const tdEditar = document.createElement('td');
        tdEditar.append(editarBoton);
        filaRegistro.append(tdEditar);

        const eliminarBoton = document.createElement('button');
        eliminarBoton.textContent = 'Eliminar';
        eliminarBoton.classList.add('boton', 'boton-lista');
        eliminarBoton.onclick = () => eliminarCompra(id);

        const tdEliminar = document.createElement('td');
        tdEliminar.append(eliminarBoton);
        filaRegistro.append(tdEliminar);

        tabla.appendChild(filaRegistro);
        total = Number(total) + Number(monto);
      });
      lista.appendChild(tabla);

      montoTotal = document.createElement('p');
      montoTotal.textContent = `El monto a pagar de la compra es: ${total}$`

      lista.appendChild(montoTotal);

    }
    
    function eliminarCompra (id){
      if (confirm('¿Estás seguro de que deseas eliminar el elemento?')){
        const eliminarCompras = compras.filter(compra => compra.id !== id);
        localStorage.setItem("compras", JSON.stringify(eliminarCompras));
        listaCompras();
        formulario.reset();
        idProducto.disabled = false;
        boton.value = "Agregar";
        return alert("Compra eliminada exitosamente");
      }
    }
  };
} else {
  alert("Storage no es compatible con este navegador.");
}