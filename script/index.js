"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const submitBtn = document.getElementById("submit");
const inputVal = document.getElementById("inputVal");
const evArea = document.querySelector(".ev-wrapper");
const submit = () => __awaiter(void 0, void 0, void 0, function* () {
    const pokemonId = inputVal.value;
    const result = yield getPokemonDatas(pokemonId);
    result != "error" ? setPokemonData(result) : setResutStatus("no-data");
    console.log(result);
});
const searchSpecies = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const speciesResp = yield fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const result = yield speciesResp.json();
    const data = {
        name: result.name,
        id: result.id,
        ev_chain_url: result.evolution_chain.url
    };
    return data;
});
const searchEvolutionDetails = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const evResp = yield fetch(url);
    const { chain } = yield evResp.json();
    const newStr = (str) => str.replace("https://pokeapi.co/api/v2/pokemon-species/", "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/").replace(/.$/, ".png");
    const arr = [];
    if (chain.evolves_to.length > 0) { // 2
        arr.push({ name: chain.species.name, img: newStr(chain.species.url) }); // 1
        arr.push({ name: chain.evolves_to[0].species.name, img: newStr(chain.evolves_to[0].species.url) });
        if (chain.evolves_to[0].evolves_to.length > 0) { // 3
            arr.push({ name: chain.evolves_to[0].evolves_to[0].species.name, img: newStr(chain.evolves_to[0].evolves_to[0].species.url) });
        }
    }
    return { ev_chain: arr };
});
const searchImage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const imgResp = yield fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const result = yield imgResp.json();
    const data = {
        height: result.height,
        weight: result.weight,
        abilities: result.abilities,
        img: result.sprites.other["official-artwork"].front_default
    };
    return data;
});
const getPokemonDatas = (id) => __awaiter(void 0, void 0, void 0, function* () {
    setResutStatus("pending");
    try {
        const species = yield searchSpecies(id);
        const ev = yield searchEvolutionDetails(species.ev_chain_url);
        const img = yield searchImage(id);
        const data = yield Object.assign(Object.assign(Object.assign({}, species), ev), img);
        return data;
    }
    catch (e) {
        console.log("error: ", e);
        setResutStatus("no-data");
        return "error";
    }
});
const setPokemonData = (data) => {
    var _a;
    const pokemonId = document.querySelector(".pokemon-id");
    const pokemonImg = document.querySelector(".pokemon-img img");
    const pokemonName = document.querySelector(".pokemon-name");
    let elem = "";
    if (((_a = data.ev_chain) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        data.ev_chain.forEach((item) => elem += `<li class="ev-list"><div class="img-area"><img src="${item.img}" alt=""></div><span class="ev-name">${item.name}</span></li>`);
    }
    else {
        elem = "This pokemon has no evolution data";
    }
    pokemonImg.src = data.img;
    pokemonImg.onload = () => {
        pokemonId.innerText = `#${data.id}`;
        pokemonName.innerText = data.name;
        evArea.innerHTML = elem;
    };
    setResutStatus("success");
};
let successBox = document.querySelector(".result-box.success");
let loadingBox = document.querySelector(".result-box.pending");
let noDataBox = document.querySelector(".result-box.no-data");
const setResutStatus = (status) => {
    let boxes = document.querySelectorAll(".result-box");
    boxes.forEach((box) => box.classList.remove("active"));
    switch (status) {
        case "success":
            successBox.classList.add("active");
            break;
        case "pending":
            loadingBox.classList.add("active");
            break;
        case "no-data":
            noDataBox.classList.add("active");
            break;
    }
};
submitBtn.addEventListener("click", submit);
inputVal.addEventListener("keypress", (e) => e.keyCode === 13 && submit());
