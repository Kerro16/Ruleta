

var ultimoGanador ="";



var miRuleta = new Winwheel({
    numSegments: 0,
    outerRadius: 170,
    segments: [],
    animation: {
      type: "spinToStop",
      duration: 5,
      callbackFinished: "mensaje()",
      callbackAfter: "dibujarIndicador()"
    }
  });



  dibujarIndicador();


  function RuletaEjemplo(){
    var testRuleta = new Winwheel({
      numSegments: 6,
      outerRadius: 170,
      segments: [],
      animation: {
        type: "spinToStop",
        duration: 5,
        callbackFinished: "mensaje()",
        callbackAfter: "dibujarIndicador()"
      }
    })

    testRuleta.draw();
    dibujarIndicador();
  }


  function mensaje() {
    var SegmentoSeleccionado = miRuleta.getIndicatedSegment();
    var ganadorDiv = document.querySelector(".ganador p");

    if (SegmentoSeleccionado) {
        ganadorDiv.textContent = SegmentoSeleccionado.text;

    } else {
        ganadorDiv.textContent = "";
    }

    ultimoGanador = SegmentoSeleccionado;
    miRuleta.stopAnimation(false);
    miRuleta.rotationAngle = 0;
    
const jsConfetti = new JSConfetti()
jsConfetti.addConfetti()
   
}




function eliminarUltimoGanador() {

  if (ultimoGanador === null) {
    return; // Salir de la función si no hay último ganador
  }
 
  var opcionesDiv = document.getElementById("opciones");
  var elementos = opcionesDiv.children;
  console.log(opcionesDiv );
  for (var i = 0; i < elementos.length; i++) {
    if (elementos[i].textContent.trim() === ultimoGanador.text.trim()) {
      opcionesDiv.removeChild(elementos[i]);
      break;
    }
  }

  // Verificar si el segmento todavía está presente en la ruleta antes de eliminarlo
  if (miRuleta.segments.indexOf(ultimoGanador) !== -1) {
    miRuleta.deleteSegment(miRuleta.segments.indexOf(ultimoGanador));
  }

  ultimoGanador = null; // Limpiar el último ganador

  if (miRuleta.numSegments === 0) {
    RuletaEjemplo();
  } else {
    miRuleta.draw();
    dibujarIndicador();
  }
}





  function dibujarIndicador() {
    var ctx = miRuleta.ctx;
    ctx.strokeStyle = "navy";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(170, 10);
    ctx.lineTo(230, 10);
    ctx.lineTo(200, 70);
    ctx.lineTo(170, 10);
    ctx.stroke();
    ctx.fill();
  }
  
  function eliminarOpcion(index) {

  if (miRuleta.numSegments === 1){
    miRuleta.numSegments = 0;
  }

    // Eliminar el segmento de la ruleta
    miRuleta.deleteSegment(index);
    miRuleta.draw();
    console.log(miRuleta.numSegments);

    // Eliminar el elemento de la lista en el HTML
    var opcionesDiv = document.getElementById("opciones");
    var elementoAEliminar = opcionesDiv.children[index];
    if (elementoAEliminar) {
        opcionesDiv.removeChild(elementoAEliminar);

        // Actualizar los índices de los elementos restantes en la lista
        for (var i = index; i < opcionesDiv.children.length; i++) {
            var button = opcionesDiv.children[i].querySelector("button");
            button.setAttribute("onclick", "eliminarOpcion(" + i + ")");
        }


    
   
      }
      
      if(miRuleta.numSegments === 0){
        RuletaEjemplo();
      }
      else{
        dibujarIndicador();

      }


      
    
}

// Función para agregar una nueva opción a la ruleta
function agregarOpcion() {
  var nuevaOpcion = document.getElementById("nuevaOpcion").value;
  if (nuevaOpcion.trim() !== "") {
      var index = miRuleta.numSegments;
      miRuleta.addSegment({
          fillStyle: getRandomColor(),
          text: nuevaOpcion
      });
      miRuleta.draw();
      document.getElementById("nuevaOpcion").value = "";

      // Agregar la opción a la lista de opciones en el HTML
      var opcionesDiv = document.getElementById("opciones");
      var nuevaOpcionDiv = document.createElement("div");
      nuevaOpcionDiv.innerHTML = nuevaOpcion + ' <button class= "delbtn" onclick="eliminarOpcion(' + index + ')"><img src="image/delete.png" alt="Eliminar"></button>';
      opcionesDiv.appendChild(nuevaOpcionDiv);

      // Actualizar los eventos onclick de los botones de "Eliminar"
      for (var i = 0; i < opcionesDiv.children.length; i++) {
          var button = opcionesDiv.children[i].querySelector("button");
          button.setAttribute("onclick", "eliminarOpcion(" + i + ")");
      }
  }
  dibujarIndicador();
}

function getRandomColor() {
  var letters = "89ABCDEF"; // Se usan letras más altas en el rango hexadecimal
  var color = "#";
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 8)]; // Se selecciona un valor más alto en el rango
  }
  return color;
}


function Iniciar(){
  if (miRuleta.numSegments < 2){
    alert("Por favor agregar al menos 2 opciones");
  }
  else{
    miRuleta.startAnimation();
  }
}

function cargarOpcionesDesdeArchivo(event) {
  const file = event.target.files[0];
  if (!file) {
      return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
      try {
          const opciones = JSON.parse(e.target.result);
          opciones.forEach(opcion => {
              miRuleta.addSegment({
                  fillStyle: opcion.fillStyle,
                  text: opcion.text
              });

              // Agregar la opción a la lista de opciones en el HTML
              var opcionesDiv = document.getElementById("opciones");
              var nuevaOpcionDiv = document.createElement("div");
              nuevaOpcionDiv.innerHTML = opcion.text + ' <button class= "delbtn" onclick="eliminarOpcion(' + miRuleta.numSegments + ')"><img src="image/delete.png" alt="Eliminar"></button>';
              opcionesDiv.appendChild(nuevaOpcionDiv);

              // Actualizar los eventos onclick de los botones de "Eliminar"
              for (var i = 0; i < opcionesDiv.children.length; i++) {
                var button = opcionesDiv.children[i].querySelector("button");
                button.setAttribute("onclick", "eliminarOpcion(" + i + ")");
            }
          });
          miRuleta.draw();
      } catch (error) {
          console.error('Error al parsear el archivo JSON:', error);
      }
  };
  reader.readAsText(file);
}

document.getElementById("nuevaOpcion").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
      event.preventDefault();
      agregarOpcion();
  }
});




window.onload = RuletaEjemplo();