//Constructores
function Cotizador(marca, anio, tipo) {
	this.marca = marca;
	this.anio = anio;
	this.tipo = tipo;
}

Cotizador.prototype.cotizar = function () {
	/*
		1 Americano = 	1.15
		2 Asiatico 	= 	1.05
		3 Europeo	=	1.35
	*/
	let cantidad;
	const base = 2000;

	switch (this.marca) {
		case '1':
			cantidad = base * 1.15;
			break;
		case '2':
			cantidad = base * 1.05;
			break;
		case '3':
			cantidad = base * 1.35;
			break;
		default:
			break;
	}

	//Leer años de diferencia
	const diferencia = new Date().getFullYear() - this.anio;

	//Cada que la diferencia es mayor, el costo va a reducirse en un 3%
	cantidad -= (diferencia * 3 * cantidad) / 100;

	//Si el seguro es basico se multiplica un 30%
	//Si el seguro es completo se multiplica un 50%

	if (this.tipo === 'basico') {
		cantidad *= 1.3;
	} else {
		cantidad *= 1.5;
	}

	return cantidad;
};

function UI() {}

UI.prototype.llenarAnios = () => {
	const max = new Date().getFullYear(),
		min = max - 20;

	const opciones = document.querySelector('#year');

	for (let i = max; i >= min; i--) {
		const option = document.createElement('option');
		option.value = i;
		option.textContent = i;

		opciones.appendChild(option);
	}
};

//Mostrar resultado de la cotización
UI.prototype.mostrarResultado = (total, seguro) => {
	const { marca, anio, tipo } = seguro;
	let nombreMarca;

	switch (marca) {
		case '1':
			nombreMarca = 'Americano';
			break;
		case '2':
			nombreMarca = 'Asiatico';
			break;
		case '3':
			nombreMarca = 'Europeo';
			break;

		default:
			break;
	}

	const div = document.createElement('div');
	div.classList.add('mt-10');

	div.innerHTML = `
		<p class="header">Tu resumen: </p>
		<p class="font-bold">Marca: <span class="font-normal"> ${nombreMarca} </span></p>
		<p class="font-bold">Año: <span class="font-normal"> ${anio} </span></p>
		<p class="font-bold">Cobertura: <span class="font-normal capitalize"> ${tipo} </span></p>
		<p class="font-bold">Total: <span class="font-normal"> $${total} </span></p>
	`;

	const resultado = document.querySelector('#resultado');

	//Mostrar spinner
	const spinner = document.querySelector('#cargando');

	spinner.style.display = 'block';

	setTimeout(() => {
		spinner.style.display = 'none';
		resultado.appendChild(div);
	}, 3000);
};

//Muestra los mensajes de error y de cotizando
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
	const div = document.createElement('div');

	if (tipo === 'error') {
		div.classList.add('error');
	} else {
		div.classList.add('correcto');
	}

	div.classList.add('mt-10');
	div.textContent = mensaje;

	const mensajes = document.querySelector('#resultado div');

	if (mensajes != null) {
		mensajes.remove();
	}

	const formulario = document.querySelector('#cotizar-seguro');
	formulario.insertBefore(div, document.querySelector('#resultado'));

	setTimeout(() => {
		div.remove();
	}, 3000);
};
//Intanciar Interfaz

const interfaz = new UI();

//Cargar años en el select
document.addEventListener('DOMContentLoaded', () => {
	interfaz.llenarAnios();
});

//Eventos
eventListeners();
function eventListeners() {
	const formulario = document.querySelector('#cotizar-seguro');
	formulario.addEventListener('submit', validarFormulario);
}

//Funciones
function validarFormulario(e) {
	e.preventDefault();

	//Seleccionar marca
	const marca = document.querySelector('#marca').value;

	//Seleccionar año
	const anio = document.querySelector('#year').value;

	//Seleccionar tipo
	const tipo = document.querySelector('input[name="tipo"]:checked').value;

	if (marca === '' || anio === '' || tipo === '') {
		interfaz.mostrarMensaje('Todos los campos son obligatorios', 'error');
		return;
	}

	interfaz.mostrarMensaje('Cotizando...', 'correcto');

	//Instanciar el seguro
	const seguro = new Cotizador(marca, anio, tipo);

	//Utilizar el prototype que va a cotizar
	const total = seguro.cotizar();

	interfaz.mostrarResultado(total, seguro);
}
