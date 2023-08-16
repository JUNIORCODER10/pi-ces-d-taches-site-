import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis } from "./avis.js"
//Récupération des pièces eventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem("pieces")
if(pieces === null){ 

 // Récupération des pièces depuis l'API
const reponse = await fetch("http://localhost:8081/pieces")
 pieces = await  reponse.json()

  // Transformation des pièces en JSON chaine de caractere
const valeurPieces = JSON.stringify(pieces)
 // Stockage des informations dans le localStorage
window.localStorage.setItem("pieces", valeurPieces)
}else{
    pieces= JSON.parse(pieces)
}

ajoutListenerEnvoyerAvis()

function genererPieces(pieces) {
    for(let i = 0 ; i < pieces.length; i++){
        
        const article = pieces[i];
        // Récupération de l'élément du DOM qui accueillera les fiches
        const ficheProduit = document.querySelector('.fiches')
        // Création d’une balise dédiée à une pièce automobile
        const piecesElement = document.createElement("article")
        
        const imageElement = document.createElement("img")
        imageElement.src = pieces[i].image
        ficheProduit.appendChild(piecesElement)
        piecesElement.appendChild(imageElement)
        
        
        const  nomElement = document.createElement("h2")
        nomElement.innerText = pieces[i].nom
        ficheProduit.appendChild(piecesElement)
        piecesElement.appendChild(nomElement)
        
        
        const prixElement = document.createElement("p")
        prixElement.innerHTML = `prix : ${pieces[i].prix}  CFA`
        ficheProduit.appendChild(piecesElement)
        piecesElement.appendChild(prixElement)
        
        const categorieElement = document.createElement("p")
        categorieElement.innerText = pieces[i].categorie ?? "aucune categorie."
        ficheProduit.appendChild(piecesElement)
        piecesElement.appendChild(categorieElement)
        
        const descriptionElement = document.createElement("p")
        descriptionElement.innerText = pieces[i].description ?? "Pas de description pour le moment. "
        ficheProduit.appendChild(piecesElement)
        piecesElement.appendChild(descriptionElement)
        
        const disponibliteElement = document.createElement("p")
        disponibliteElement.innerText = pieces[i].disponiblite ? "En stock" : "En Rupture de stock"
        ficheProduit.appendChild(piecesElement)
        piecesElement.appendChild(disponibliteElement)

        // ajout bouton avis sur chaque fiche produit
        const avisBouton = document.createElement("button")
        avisBouton.dataset.id = article.id
        avisBouton.textContent = 'Afficher les avis sur ce produit'   
        
        //ajout du bouton à l'article

       piecesElement.appendChild(avisBouton)
        
        }
        // Ajout de la fonction ajoutListenersAvis d'avis.js
        ajoutListenersAvis()
}
genererPieces(pieces)

for(let i = 0; i <pieces.length; i++){
    const id = pieces[i].id
    const avisJSON=window.localStorage.getItem(`avis-piece-${id}`)
    const avis = JSON.parse(avisJSON)

    if(avis!== null){
        const pieceElement = document.querySelector('article[data-id= "${id}"]')
        afficherAvis(pieceElement, avis)
    }
}

function mettreAJour(){
    document.querySelector('.fiches').innerHTML = ""
}


let buttonTrierCroissant = document.querySelector('.btn-trier')
buttonTrierCroissant.addEventListener("click", () =>{
    let piecesOrdonnees = Array.from(pieces)
      piecesOrdonnees.sort((a,b) => {
        return a.prix - b.prix
      })
      mettreAJour()
      genererPieces(piecesOrdonnees)
})
let buttonFiltrerPrix = document.querySelector('.btn-filtrer')
buttonFiltrerPrix.addEventListener("click", () => {
    const piecesFilter =pieces.filter((piece) => {
        return piece.prix < 35

    })
    mettreAJour()
    genererPieces(piecesFilter)
})
let buttonFiltrerDescription = document.querySelector('.btn-filtrerDescription')
buttonFiltrerDescription.addEventListener("click", () => {
    const filtrerDescription = pieces.filter((des) => {
        return des.description
    })
    mettreAJour()
    genererPieces(filtrerDescription)
})
let buttonTrierDecroissant = document.querySelector('.btn-trierDecroissant')
buttonTrierDecroissant.addEventListener("click", () => {
    const trierDecroissant = Array.from(pieces)
    trierDecroissant.sort((a,b) => {
        return b.prix - a.prix
    })
    mettreAJour()
    genererPieces(trierDecroissant)
})

let noms = pieces.map(piece => piece.nom)
for (let i = pieces.length -1 ; i >= 0 ; i--){
    if(pieces[i].prix  >1000){
        noms.splice(i,1)
    }
  
}

const listePiecesAbordable = document.createElement("ul")
for(let i = 0; i< noms.length ; i++){
    const nomsElement = document.createElement("li")
    nomsElement.innerHTML = noms[i]
    listePiecesAbordable.appendChild(nomsElement)
}
 document.querySelector('.abordables')
  .appendChild(listePiecesAbordable)


let nomsDisponible = pieces.map(piece => piece.nom)
let prixDisponible = pieces.map(piece => piece.prix)
  
for(let index = pieces.length -1; index >=0; index--){
    if(!pieces[index].disponibilite){
        nomsDisponible.splice(index,1)
        prixDisponible.splice(index,1)
    }
}
 


const listePiecesDisponible = document.createElement("ul")
for (let i = 0; i< nomsDisponible.length; i++){
    const elementDisponible = document.createElement("li")
    elementDisponible.innerHTML = `${nomsDisponible[i]} – ${prixDisponible[i]} CFA`
    listePiecesDisponible.appendChild(elementDisponible)
}
 document.querySelector('.disponible')
.appendChild(listePiecesDisponible)

let prixMax = document.getElementById("prix-max")
prixMax.addEventListener("input", () => {
    const piecesFiltrees = pieces.filter((piece) => {
        return piece.prix <= prixMax.value
    })
    mettreAJour()
    genererPieces(piecesFiltrees)
})

const buttonMettreAJour = document.querySelector(".btn-maj")
buttonMettreAJour.addEventListener("click", () => {
    window.localStorage.removeItem("pieces")
})
await afficherGraphiqueAvis()

