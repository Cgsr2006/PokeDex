async function fazRequisicao() {
  // lê ?name= da URL
  const parametros = new URLSearchParams(location.search);
  const pokemon = parametros.get("pokemon");
  const caminho = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`;

  // mostra loader ao iniciar
  loader.classList.remove("hidden"); // Remove a classe hidden do loader, fazendo ele aparecer
  document.getElementById("teste").style.display = "none"; // Muda o display pra none que significa que a tela vai ficar sem nada

  // busca os dados na PokeAPI + garante delay mínimo
  try {
    const dados = await fetch(caminho).then((res) => res.json());
    const delay = new Promise((resolve) => setTimeout(resolve, 1000)); await delay;

    // Coletando os dados das Habilidades dos Pokemons <---------------------------------------------------
    document.getElementById("nomePokemonShiny").innerHTML = dados.name.toUpperCase() + " (SHINY)";
    document.getElementById("nomePokemon").innerHTML = dados.name.toUpperCase();
    document.getElementById("info1").innerHTML = "Id: " + dados.id;

    const tipos = dados.types;
    const listaTipos = tipos.map((item) => {return item.type.name;});
    document.getElementById("info2").innerHTML = "Tipos: " + `${listaTipos.join(" / ")}`;

    document.getElementById("info3").innerHTML = "Peso: " + dados.weight / 10 + " kg";
    document.getElementById("info4").innerHTML = "Altura: " + dados.height * 10 + " cm";

    let contagem = 0;
    const habilidades = dados.abilities;
    const listaHabilidades = habilidades.map((item) => {
      contagem++;
      if (contagem < 4) return item.ability.name;
    });
    document.getElementById("info5").innerHTML = "Habilidades: " + `${listaHabilidades.join(" / ")}`;


    // Coletando os dados dos Status dos Pokemons <---------------------------------------------------
    document.getElementById("status1").innerHTML = "HP: " + dados.stats[0].base_stat;
    document.getElementById("status2").innerHTML = "Attack: " + dados.stats[1].base_stat;
    document.getElementById("status3").innerHTML = "Defense: " + dados.stats[2].base_stat;
    document.getElementById("status4").innerHTML = "Special-defense: " + dados.stats[3].base_stat;
    document.getElementById("status5").innerHTML = "Speed: " + dados.stats[4].base_stat;
  
  
    // Implementando a interação das imagens com o mouse <---------------------------------------------------
    const img = document.getElementById("imagemPokemons"); // Só pra ficar mais fácil de manipular
    img.src = dados.sprites.front_default;

    img.addEventListener("mouseover", () => {img.src = dados.sprites.back_default;});
    img.addEventListener("mouseout", () => {img.src = dados.sprites.front_default;});
      
    const img2 = document.getElementById("imagemPokemonsShiny"); //Só pra ficar mais fácil de manipular
    img2.src = dados.sprites.front_shiny;

    img2.addEventListener("mouseover", () => {img2.src = dados.sprites.back_shiny;});
    img2.addEventListener("mouseout", () => {img2.src = dados.sprites.front_shiny;});
  
  } catch (error) {
    document.getElementById("teste").style.display = "flex";
    window.location.replace("index3.html");// console.log(error)

  } finally {
    document.getElementById("teste").style.display = "flex";
    loader.classList.add("hidden");
  }
}

function recebeInformacoesUsuario() {
  const info = document.getElementById("form");
  info.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputPokemon = document.getElementById("inputPokemon").value.trim();

    if (!inputPokemon) return;
    window.location.href = `index2.html?pokemon=${encodeURIComponent(
      inputPokemon
    )}`;
  });
}

function mudaCor(idElemento, idElemento2) {
  const controle = document.getElementById(idElemento);
  const controle2 = document.getElementById(idElemento2);

  controle.style.backgroundColor = "#334155";
  controle2.style.backgroundColor = "#0F172A";

  // mostra/esconde se for aparência ou habilidades
  if (idElemento === "botaoAparencia") {
    document.getElementById("quadroHabilidadesPokemon").style.display = "none"; // esconde características
    document.getElementById("quadroStatusPokemon").style.display = "none";
    document.getElementById("divPokemonDefault").style.display = "flex";
    document.getElementById("divPokemonShiny").style.display = "flex";

  } else if (idElemento === "botaoHabilidades") {
    document.getElementById("quadroHabilidadesPokemon").style.display = "inline-block"; // mostra características
    document.getElementById("quadroStatusPokemon").style.display = "inline-block";
    document.getElementById("divPokemonDefault").style.display = "none";
    document.getElementById("divPokemonShiny").style.display = "none";
  }
}
