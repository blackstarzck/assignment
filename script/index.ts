const submitBtn = document.getElementById("submit") as HTMLElement;
const inputVal = document.getElementById("inputVal") as HTMLInputElement;
const evArea = document.querySelector(".ev-wrapper") as HTMLElement;

interface Spicies {
    name: string,
    id: number,
    ev_chain_url: string
}

interface Evolution {
    ev_chain: Array<object>,
}

interface Pokemon {
    height: number,
    weight: number,
    abilities: Array<object>
    img: string
}

const submit = async () => {    
    const pokemonId: string = inputVal.value;
    const result = await getPokemonDatas(pokemonId);
    result != "error" ? setPokemonData(result) : setResutStatus("no-data");

    console.log(result)
}

const searchSpecies = async (id: string): Promise<Spicies> => {
    const speciesResp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const result = await speciesResp.json();
    const data = {
        name: result.name,
        id: result.id,
        ev_chain_url: result.evolution_chain.url
    };
    return data; 
}

const searchEvolutionDetails = async (url: string): Promise<Evolution> => {
    const evResp = await fetch(url);
    const { chain } = await evResp.json();
    const newStr = (str: string) => str.replace("https://pokeapi.co/api/v2/pokemon-species/", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/").replace(/.$/, ".png");
    const arr = [];

    if(chain.evolves_to.length > 0){ // 2
        arr.push({ name: chain.species.name, img: newStr(chain.species.url) }); // 1
        arr.push({ name: chain.evolves_to[0].species.name, img: newStr(chain.evolves_to[0].species.url) });
        if(chain.evolves_to[0].evolves_to.length > 0){ // 3
            arr.push({ name: chain.evolves_to[0].evolves_to[0].species.name, img: newStr(chain.evolves_to[0].evolves_to[0].species.url) });
        }
    }
    return { ev_chain: arr };
}

const searchImage = async (id: string): Promise<Pokemon> => {
    const imgResp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const result = await imgResp.json();
    const data = {
        height: result.height,
        weight: result.weight,
        abilities: result.abilities,
        img: result.sprites.other["official-artwork"].front_default
    }
    return data;
}

const getPokemonDatas = async (id: string) => {
    setResutStatus("pending");
    try{
        const species = await searchSpecies(id);
        const ev = await searchEvolutionDetails(species.ev_chain_url);
        const img = await searchImage(id);
        const data = await { ...species, ...ev, ...img };
        return data;
    }catch(e){
        console.log("error: ", e);
        setResutStatus("no-data");
        return "error";
    }
}

const setPokemonData = (data: any): void => {
    const pokemonId = document.querySelector(".pokemon-id") as HTMLElement;
    const pokemonImg = document.querySelector(".pokemon-img img") as HTMLImageElement;
    const pokemonName = document.querySelector(".pokemon-name") as HTMLElement;
    let elem = "";

    if(data.ev_chain?.length > 0){
        data.ev_chain.forEach((item: { img: string, name: string }) => elem += `<li class="ev-list"><div class="img-area"><img src="${item.img}" alt=""></div><span class="ev-name">${item.name}</span></li>`);
    }else{
        elem = "This pokemon has no evolution data";
    }
    pokemonImg.src = data.img;
    pokemonImg.onload = () => {
        pokemonId.innerText = `#${data.id}`;
        pokemonName.innerText = data.name;
        evArea.innerHTML = elem;
    }
    
    setResutStatus("success");
}

let successBox = document.querySelector(".result-box.success") as HTMLElement;
let loadingBox = document.querySelector(".result-box.pending") as HTMLElement;
let noDataBox = document.querySelector(".result-box.no-data") as HTMLElement;


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