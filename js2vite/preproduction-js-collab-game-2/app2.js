// 1.  tablica (mapa) vs switch -  zbiór danych, a nie zbiór wyjątków

const MAKS_ENERGIA = 10;

const pokoje = [
  { id: 1, nazwa: "Recepcja", oswietlony: true },
  { id: 2, nazwa: "Magazyn", oswietlony: false },
  { id: 3, nazwa: "Serwerownia", oswietlony: false },
  { id: 4, nazwa: "Wyjście", oswietlony: true }
];

function stanPoczatkowy() {
  return {
    pokoj: 1,
    energia: MAKS_ENERGIA,
    karta: false,
    bezpiecznik: false,
    zasilanie: false,
    koniec: false,
    wygrana: false
  };
}

let stan = stanPoczatkowy();
console.log(stan.energia);

console.log(pokoje.length);   // 4
console.log(pokoje[0].nazwa); // Recepcja
console.log(pokoje[1].id);    // 2

// 2. find - szukaj w tablicy z użyciem callbacka 
function maIdDwa(pokoj) {
  return pokoj.id === 2;
}

//const znaleziony = pokoje.find(maIdDwa);
//console.log(znaleziony.nazwa);

// funkcja nie ma nazwy, bo używamy jej tylko tu - lokalnie
//const znaleziony = pokoje.find(function (pokoj) {
//  return pokoj.id === 2;
//});

// można to napisać prościej stosując zapis strzałkowy
//const znaleziony = pokoje.find((pokoj) => {
//  return pokoj.id === 2;
//});

// albo jeszcze prościej
//const znaleziony = pokoje.find(pokoj => pokoj.id === 2);

// 3. filter i map
const jasnePokoje = pokoje.filter(pokoj => pokoj.oswietlony);
console.log(jasnePokoje.length);

const opisy = pokoje.map(pokoj => pokoj.id + ". " + pokoj.nazwa);
console.log(opisy);


// wszystko do stworzenia mapy gry jest już powyżej
function mapa() {
  const opisy = pokoje.map(pokoj => pokoj.id + ". " + pokoj.nazwa);
  for (const opis of opisy) {
    console.log(opis);
  }
}


