// 0. dużo zmiennych z poprzedniego kodu

let pokoj = 1;
let energia = 10;
let karta = false;
let bezpiecznik = false;
let zasilanie = false;
let koniec = false;
let wygrana = false;

// 1. rozproszone zmienne vs jeden obiekt

let stan = {
  pokoj: 1,
  energia: 10,
  karta: false,
  bezpiecznik: false,
  zasilanie: false,
  koniec: false,
  wygrana: false
};

console.log(stan.pokoj);
console.log(stan.energia);
stan.energia = stan.energia - 1;
console.log(stan.energia);

// 2. alias vs spread

//const przed = { pokoj: 1, energia: 10 };
//const po = { ...przed, energia: 9 };
//console.log(przed.energia);
//console.log(po.energia);
//console.log(przed === po);

// 3. stan początkowy jako funkcja

//const MAKS_ENERGIA = 10;

//function stanPoczatkowy() {
//  return {
//    pokoj: 1,
//    energia: MAKS_ENERGIA,
//    karta: false,
//    bezpiecznik: false,
//    zasilanie: false,
//    koniec: false,
//    wygrana: false
//  };
//}

//let stan = stanPoczatkowy();
//console.log(stan.energia);

//4. Destructuring 

//const { pokoj, energia } = stan;
//console.log(pokoj, energia);
//const pokoj = stan.pokoj;
//const energia = stan.energia;


