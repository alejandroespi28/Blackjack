// tipos C = clubs, H hearth , J jack, S de spades

const miModulo =(() => {
  let puntosJugadores = [],
    deck = [];

  // Referencias del html
  const puntosHtml = document.querySelectorAll("small"),
    divCartas = document.querySelectorAll(".divCartas");
    btnNuevo = document.querySelector("#btnNuevo"),
    btnPedir = document.querySelector("#btnPedir"),
    btnDetener = document.querySelector("#btnDetener"),
    // divCartasJugador = document.querySelector("#jugador-cartas"),
    // divCartasNpc = document.querySelector("#npc-cartas"),
    tipos = ["C", "D", "H", "S"],
    especiales = ["A", "J", "Q", "K"];

  const crearDeck = () => {
    deck = [];

    for (i = 2; i <= 10; i++) {
      for (let tipo of tipos) {
        deck.push(i + tipo);
      }
    }

    for (let tipo of tipos) {
      for (let especial of especiales) {
        deck.push(especial + tipo);
      }
    }

    return _.shuffle(deck);
  };

  const pedirCarta = () => {
    if (deck.length === 0) {
      throw "No hay cartas en el deck";
    }

    return deck.pop();
  };

  const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(valor) ? (valor === "A" ? 11 : 10) : valor * 1;
  };

  const iniciarJuego = (numJugadores = 2) => {
    deck = crearDeck();
    puntosJugadores= [];

    for (let i = 0; i < numJugadores; i++) {
      puntosJugadores.push(0);
    }


    puntosHtml.forEach(elem => elem.innerText =0);

    divCartas.forEach(elem => elem.innerHTML= "");

    btnPedir.disabled = false;
    btnDetener.disabled = false;  

  };
  // Turno 0 el primer jugador el ultimo el npc
  const acumularPuntos = (carta, turno) => {
    puntosJugadores[turno] += valorCarta(carta);
    puntosHtml[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno];
  };


// 
  const crearCarta = (carta, turno) =>{

    const imgCarta = document.createElement("img");
    imgCarta.classList.add("carta");
    imgCarta.src = `./cartas/${carta}.png`;
    divCartas[turno].append(imgCarta);
  } 

  const determinarGanador = () =>{
    const [puntosMinimos, puntosNpc] = puntosJugadores;
    setTimeout(() => {
      if (puntosNpc === puntosMinimos) {
        alert("Nadie gana");
      } else if (puntosMinimos > 21) {
        alert("Computadora gana ");
      } else if (puntosNpc > 21) {
        alert("Jugador gana");
      } else {
        alert("Computadora gana");
      }
    }, 100);
    
  }

  // Turno de la computadora
  const turnoComputadora = (puntosMinimos) => {
    let puntosNpc = 0 ;
    do {
      const carta = pedirCarta();
    puntosNpc =  acumularPuntos(carta, puntosJugadores.length - 1);
      crearCarta(carta, puntosJugadores.length-1);

    } while ((puntosNpc < puntosMinimos) && (puntosMinimos <= 21));
 
    determinarGanador(); 
  };

  // Eventos
  btnNuevo.addEventListener("click", () => {
    iniciarJuego();
   
  });

  btnPedir.addEventListener("click", () => {
    
    const carta = pedirCarta();
    const puntosJugador = acumularPuntos(carta, 0);

    crearCarta(carta, 0);
  
    if (puntosJugador > 21) {
      console.warn("Lo siento, perdiste");
      btnPedir.disabled = true;
      btnDetener.disabled = true;
      turnoComputadora(puntosJugador);

    } else if (puntosJugador === 21) {
      console.log("21, genial!");
      btnPedir.disabled = true;
      turnoComputadora(puntosJugador);
    }

  });

  btnDetener.addEventListener("click", () => {
    btnDetener.disabled = true;
    btnPedir.disabled = true;
    turnoComputadora(puntosJugadores[0])
  });

  return {
   iniciarJuego: iniciarJuego 
  };

})();
