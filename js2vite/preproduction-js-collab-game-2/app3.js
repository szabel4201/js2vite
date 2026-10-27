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

function znajdzPokoj(id) {
  return pokoje.find(pokoj => pokoj.id === id);
}

function mapa() {
  const opisy = pokoje.map(pokoj => pokoj.id + ". " + pokoj.nazwa);
  for (const opis of opisy) {
    console.log(opis);
  }
}

// 1.  sterujemy ruchem - czyli wszystko co do tej pory w jednym kawałku
function przejscie(stanPrzed, komenda) {
  if (stanPrzed.koniec) {
    return { stan: stanPrzed, komunikat: "Gra jest zakończona." };
  }

  if (komenda !== "lewo" && komenda !== "prawo") {
    return { stan: stanPrzed, komunikat: "Użyj lewo albo prawo." };
  }

  const krok = komenda === "prawo" ? 1 : -1;
  const numerDocelowy = stanPrzed.pokoj + krok;
  const pokojDocelowy = znajdzPokoj(numerDocelowy);

  if (pokojDocelowy === undefined) {
    return { stan: stanPrzed, komunikat: "Ściana. Stan bez zmian." };
  }

  const nowaEnergia = stanPrzed.energia - 1;
  const stanPo = {
    ...stanPrzed,
    pokoj: numerDocelowy,
    energia: nowaEnergia,
    koniec: nowaEnergia === 0
  };

  const komunikat = stanPo.koniec
    ? "Brak energii. Koniec gry."
    : "Jesteś w: " + pokojDocelowy.nazwa;

  return { stan: stanPo, komunikat: komunikat };
}

// 2. rozdzielenie odpowiedzialności 
function idz(kierunek) {
  const wynik = przejscie(stan, kierunek);
  stan = wynik.stan;
  console.log(wynik.komunikat);
}

function status() {
  console.table({ ...stan });
}

function start() {
  stan = stanPoczatkowy();
  status();
}


