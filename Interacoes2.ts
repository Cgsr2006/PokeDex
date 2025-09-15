// 1) Tipos (interfaces) para a parte da resposta da PokeAPI que usamos
interface PokemonResponse {
  name: string;
  id: number;
  weight: number;
  height: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
  };
}

// 2) Helpers de DOM com tipo forte
function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} não encontrado.`);
  return el;
}

function $img(id: string): HTMLImageElement {
  const el = $(id);
  if (!(el instanceof HTMLImageElement)) {
    throw new Error(`Elemento #${id} não é <img>.`);
  }
  return el;
}

// 3) Função principal (agora async/await e com tipos)
export async function fazRequisicao(): Promise<void> {
  // lê ?pokemon= da URL
  const parametros = new URLSearchParams(window.location.search);
  const pokemon = parametros.get("pokemon");

  const loader = $("loader"); // <div id="loader">...</div> (no seu HTML)
  const container = $("teste"); // o contêiner que você mostra/esconde

  // mostra loader ao iniciar
  loader.classList.remove("hidden");
  (container as HTMLElement).style.display = "none";

  // valida parâmetro
  if (!pokemon || !pokemon.trim()) {
    // sem Pokémon → volta
    loader.classList.add("hidden");
    (container as HTMLElement).style.display = "flex";
    window.location.replace("index3.html");
    return;
  }

  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const dados: PokemonResponse = await res.json();

    $("nomePokemonShiny").textContent = `${dados.name.toUpperCase()} (SHINY)`;
    $("nomePokemon").textContent = dados.name.toUpperCase();
    $("info1").textContent = `Id: ${dados.id}`;

    const listaTipos = dados.types.map((t) => t.type.name);
    $("info2").textContent = `Tipos: ${listaTipos.join(" / ")}`;

    $("info3").textContent = `Peso: ${dados.weight / 10} kg`;
    $("info4").textContent = `Altura: ${dados.height * 10} cm`;

    // Pega só as 2 primeiras habilidades, se existirem
    const listaHabilidades = dados.abilities.slice(0, 2).map((a) => a.ability.name);
    $("info5").textContent = `Habilidades: ${listaHabilidades.join(" / ")}`;

    // Ajuste de posição conforme qtd de habilidades
    const controle = $("quadroCaracteristicasPokemon") as HTMLDivElement;
    controle.style.left = listaHabilidades.length === 1 ? "260px" : "210px";

    // Imagens normais
    const img = $img("imagemPokemons");
    const frontDefault = dados.sprites.front_default;
    const backDefault = dados.sprites.back_default;

    // Define imagem inicial se existir, senão limpa o src
    img.src = frontDefault ?? "";
    img.onmouseover = () => {
      if (backDefault) img.src = backDefault;
    };
    img.onmouseout = () => {
      if (frontDefault) img.src = frontDefault;
    };

    // Imagens shiny
    const img2 = $img("imagemPokemonsShiny");
    const frontShiny = dados.sprites.front_shiny;
    const backShiny = dados.sprites.back_shiny;

    img2.src = frontShiny ?? "";
    img2.onmouseover = () => {
      if (backShiny) img2.src = backShiny;
    };
    img2.onmouseout = () => {
      if (frontShiny) img2.src = frontShiny;
    };

    // finaliza loader
    loader.classList.add("hidden");
    (container as HTMLElement).style.display = "flex";
  } catch (error) {
    // trata erro → volta pra index3
    loader.classList.add("hidden");
    (container as HTMLElement).style.display = "flex";
    window.location.replace("index3.html");
    // Opcional: console.error(error);
  }
}

export function recebeInformacoesUsuario(): void {
  const form = $("form") as HTMLFormElement; // certifique-se que o id é 'form'
  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();

    const input = $("inputPokemon") as HTMLInputElement;
    const valor = input.value.trim();
    if (!valor) return;

    window.location.href = `index2.html?pokemon=${encodeURIComponent(valor)}`;
  });
}