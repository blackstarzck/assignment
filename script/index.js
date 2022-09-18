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
const submit = () => __awaiter(void 0, void 0, void 0, function* () {
    const pokemonId = inputVal.value;
    const resultA = yield searchPokemon(pokemonId);
    const resultB = yield searchEvolutionChain(pokemonId);
    let result = {};
    if (resultA)
        result = Object.assign({}, resultA);
    if (resultA && resultB)
        result = Object.assign(Object.assign({}, resultA), resultB);
    setPokemonData(result);
    console.log("resultA: ", resultA, typeof resultA);
    console.log("resultB: ", resultB, typeof resultB);
});
const searchPokemon = (id) => {
    setResutStatus("pending");
    return new Promise((resolve, reject) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => setResutStatus("no-data"));
    });
};
const searchEvolutionChain = (id) => {
    setResutStatus("pending");
    return new Promise((resolve, reject) => {
        fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`)
            .then((response) => response.json())
            .then((data) => resolve(data))
            .catch((error) => setResutStatus("no-data"));
    });
};
const setPokemonData = (data) => {
    const pokemonId = document.querySelector(".pokemon-id");
    const pokemonImg = document.querySelector(".pokemon-img img");
    const pokemonName = document.querySelector(".pokemon-name");
    pokemonId.innerText = `#${data.id}`;
    pokemonImg.src = data.sprites.other["official-artwork"].front_default;
    pokemonName.innerText = data.name;
    setResutStatus("success");
};
const successBox = document.querySelector(".result-box.success");
const loadingBox = document.querySelector(".result-box.pending");
const noDataBox = document.querySelector(".result-box.no-data");
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
