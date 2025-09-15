function fazRequisicao(){ 
            
    // lê ?name= da URL
    const parametros = new URLSearchParams(location.search);
    const pokemon = parametros.get('pokemon');

    // mostra loader ao iniciar
    loader.classList.remove("hidden");
    document.getElementById('teste').style.display = 'none';

    // busca os dados na PokeAPI + garante delay mínimo
    Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`),
      new Promise(resolve => setTimeout(resolve, 1200))])
    
    .then(([res]) => res.json())
    .then(dados => {

        document.getElementById('nomePokemonShiny').innerHTML = dados.name.toUpperCase() + " (SHINY)";
        document.getElementById('nomePokemon').innerHTML = dados.name.toUpperCase();
        document.getElementById('info1').innerHTML = "Id: " + dados.id;

        const tipos = dados.types;
        const listaTipos = tipos.map(item => {
            return item.type.name;
        });
        document.getElementById("info2").innerHTML = "Tipos: " + `${listaTipos.join(" / ")}`;
        document.getElementById('info3').innerHTML = "Peso: " + (dados.weight/10) + " kg";
        document.getElementById('info4').innerHTML = "Altura: " + (dados.height*10) + " cm";

        let contagem = 0;
        const habilidades = dados.abilities;
        const listaHabilidades = habilidades.map(item => {
            contagem++;
            if (contagem < 3) return item.ability.name;
        });

        const controle = document.getElementById('quadroCaracteristicasPokemon');
        if(listaHabilidades.length === 1) controle.style.left = '260px';
            
            else controle.style.left = '210px';
            
        document.getElementById("info5").innerHTML = "Habilidades: " + `${listaHabilidades.join(" / ")}`; 
        
        const img = document.getElementById("imagemPokemons");
        img.src = dados.sprites.front_default;
        const img2 = document.getElementById("imagemPokemonsShiny");
        img2.src = dados.sprites.front_shiny;

        img.addEventListener("mouseover", () => {
            img.src = dados.sprites.back_default;

        });img.addEventListener("mouseout", () => {
            img.src = dados.sprites.front_default;
        });

        img2.addEventListener("mouseover", () => {
            img2.src = dados.sprites.back_shiny;

        });img2.addEventListener("mouseout", () => {
            img2.src = dados.sprites.front_shiny;
        });

        loader.classList.add("hidden");
        document.getElementById('teste').style.display = 'flex';

    }).catch(error => {
        loader.classList.add("hidden");
        document.getElementById('teste').style.display = 'flex';
        window.location.replace("index3.html")});// console.log(error)
}

function recebeInformacoesUsuario(){

    const info = document.getElementById('form');
    info.addEventListener('submit', (e) => { 
      e.preventDefault();
        
      const inputPokemon = document.getElementById('inputPokemon').value.trim();

      if (!inputPokemon) return;
      window.location.href = `index2.html?pokemon=${encodeURIComponent(inputPokemon)}`;
    });
}
