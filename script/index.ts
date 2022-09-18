const submitBtn = document.getElementById("submit") as HTMLElement;
const inputVal = document.getElementById("inputVal") as HTMLInputElement;


const submit = async () => {
    const pokemonId: string = inputVal.value;
    const resultA: object = await searchPokemon(pokemonId);
    const resultB: object = await searchEvolutionChain(pokemonId);
    let result: object = {};

    if(resultA) result = { ...resultA }
    if(resultA && resultB) result = { ...resultA, ...resultB }

    setPokemonData(result);

    console.log("resultA: ", resultA, typeof resultA);
    console.log("resultB: ", resultB, typeof resultB);
}

const searchPokemon = (id: string): object => {
    setResutStatus("pending");
    return new Promise((resolve, reject) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((error) => setResutStatus("no-data"));
    });
}

const searchEvolutionChain = (id: string): object => {
    setResutStatus("pending");
    return new Promise((resolve, reject) => {
        fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`)
        .then((response) => response.json())
        .then((data) => resolve(data))
        .catch((error) => setResutStatus("no-data"));
    });
}

const setPokemonData = (data: any): void => {
    const pokemonId = document.querySelector(".pokemon-id") as HTMLElement;
    const pokemonImg = document.querySelector(".pokemon-img img") as HTMLImageElement;
    const pokemonName = document.querySelector(".pokemon-name") as HTMLElement;

    pokemonId.innerText = `#${data.id}`;
    pokemonImg.src = data.sprites.other["official-artwork"].front_default;
    pokemonName.innerText = data.name;

    setResutStatus("success");
}

const successBox = document.querySelector(".result-box.success") as HTMLElement;
const loadingBox = document.querySelector(".result-box.pending") as HTMLElement;
const noDataBox = document.querySelector(".result-box.no-data") as HTMLElement;


const setResutStatus = (status: string): void => {
    let boxes = document.querySelectorAll(".result-box");
    boxes.forEach((box) => box.classList.remove("active"));

    switch(status){
        case "success" :
            successBox.classList.add("active");
        break;
        case "pending" :
            loadingBox.classList.add("active");
        break;
        case "no-data" :
            noDataBox.classList.add("active");
        break;
    }
}

submitBtn.addEventListener("click", submit);
inputVal.addEventListener("keypress", (e: KeyboardEvent) => e.keyCode === 13 && submit() );