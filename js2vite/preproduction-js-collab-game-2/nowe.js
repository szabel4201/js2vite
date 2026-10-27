// WSPOLNY KONTRAKT: Refaktoryzacja oparta na obiekcie stanu, tablicy rekordów i czystych funkcjach.

const MAKS_ENERGIA = 10;

// Tablica rekordów zamiast switcha do nazw i opisów pokoi
const pokoje = [
  { id: 1, nazwa: "Recepcja", opis: "Na biurku leży plastikowa karta dostępu." },
  { id: 2, nazwa: "Magazyn", opis: "Na półce leży zapasowy bezpiecznik." },
  { id: 3, nazwa: "Serwerownia", opis: "Pomieszczenie z głównymi szafami serwerowymi." },
  { id: 4, nazwa: "Wyjscie", opis: "Drzwi prowadzące na wolność." }
];

// Stan gry zamknięty w jednym obiekcie
let stan = {
  pokoj: 1,
  energia: MAKS_ENERGIA,
  karta: false,
  bezpiecznik: false,
  zasilanie: false,
  koniec: false,
  wygrana: false
};

// SEKCJA 0 — SILNIK GRY
function start() {
  stan = {
    pokoj: 1,
    energia: MAKS_ENERGIA,
    karta: false,
    bezpiecznik: false,
    zasilanie: false,
    koniec: false,
    wygrana: false
  };
  console.log("UCIECZKA Z SERWEROWNI 2: ZEMSTA KONSOLI. Zasilanie awaryjne wystarczy na 10 tur.");
  pomoc();
  rozejrzyj();
}

function pobierzPokoj(id) {
  return pokoje.find(p => p.id === id);
}

function zakonczTure(aktualnyStan) {
  const nowaEnergia = aktualnyStan.energia - 1;
  let nowyKoniec = aktualnyStan.koniec;
  
  console.log("Pozostala energia: " + nowaEnergia);
  
  if (aktualnyStan.wygrana) {
    console.log("WYGRANA! Drzwi otwarte. Mozesz wrocic do domu.");
  } else if (nowaEnergia === 0) {
    nowyKoniec = true;
    console.log("PRZEGRANA. Zasilanie awaryjne padlo. Wpisz start().");
  }

  // Użycie spread operatora do niemutowalnej aktualizacji stanu tury
  return {
    ...aktualnyStan,
    energia: nowaEnergia,
    koniec: nowyKoniec
  };
}

// SEKCJA A — INFORMACJE I MAPA
function pomoc() {
  console.log("=== POMOC I INSTRUKCJA ===");
  console.log("Dostepne komendy:");
  console.log(' - start() - restartuje gre.');
  console.log(' - pomoc() - wyswietla te instrukcje.');
  console.log(' - status() - pokazuje aktualny stan gry i przedmioty.');
  console.log(' - mapa() - pokazuje plan pomieszczeń.');
  console.log(' - rozejrzyj() - rozglada sie po aktualnym pokoju.');
  console.log(' - idz("lewo") / idz("prawo") - poruszanie sie.');
  console.log(' - akcja("karta") / akcja("bezpiecznik") / akcja("napraw") / akcja("wyjdz")');
  console.log(' - zapiszGre() - generuje kod JSON stanu gry.');
  console.log(' - wczytajGre(tekstJson) - wczytuje zapisany stan gry.');
}

function status() {
  const p = pobierzPokoj(stan.pokoj);
  console.log("--- STATUS GRY ---");
  console.log("Aktualny pokoj: " + stan.pokoj + " (" + p.nazwa + ")");
  console.log("Energia: " + stan.energia + " / " + MAKS_ENERGIA);
  console.log("Karta: " + (stan.karta ? "tak" : "nie"));
  console.log("Bezpiecznik: " + (stan.bezpiecznik ? "tak" : "nie"));
  console.log("Zasilanie: " + (stan.zasilanie ? "aktywne" : "wyłaczone"));
  console.log("Koniec: " + (stan.koniec ? "tak" : "nie") + " | Wygrana: " + (stan.wygrana ? "tak" : "nie"));
}

function mapa() {
  // Przetwarzanie tablicy rekordów zamiast pętli po switchu
  pokoje.forEach(p => {
    if (p.id === stan.pokoj) {
      console.log(p.id + " " + p.nazwa + " <-- jestes tutaj");
    } else {
      console.log(p.id + " " + p.nazwa);
    }
  });
}

function rozejrzyj() {
  const p = pobierzPokoj(stan.pokoj);
  console.log("Jesteś w: " + p.nazwa + ". " + p.opis);
  
  if (stan.pokoj === 1 && stan.karta) {
    console.log("Biurko jest teraz puste.");
  } else if (stan.pokoj === 2 && (stan.bezpiecznik || stan.zasilanie)) {
    console.log("Półka jest teraz pusta.");
  } else if (stan.pokoj === 3) {
    console.log("Stan zasilania: " + (stan.zasilanie ? "Włączone (stabilne)" : "Wyłączone (ciemno i cicho)"));
  }
}

// SEKCJA B — RUCH (Funkcja przejścia zwracająca nowy obiekt stanu)
function wykonajRuch(aktualnyStan, kierunek) {
  if (aktualnyStan.koniec) {
    return { ...aktualnyStan, komunikat: "Gra dobiegła końca." };
  }

  let nastepnyPokoj = aktualnyStan.pokoj;
  if (kierunek === "prawo") {
    nastepnyPokoj = aktualnyStan.pokoj + 1;
  } else if (kierunek === "lewo") {
    nastepnyPokoj = aktualnyStan.pokoj - 1;
  } else {
    return { ...aktualnyStan, komunikat: "Nieznany kierunek. Użyj idz(\"lewo\") lub idz(\"prawo\")." };
  }

  if (nastepnyPokoj < 1 || nastepnyPokoj > 4) {
    return { ...aktualnyStan, komunikat: "Nie możesz iść w tę stronę — napotykasz ścianę." };
  }

  return {
    ...aktualnyStan,
    pokoj: nastepnyPokoj,
    komunikat: "OK"
  };
}

function idz(kierunek) {
  const wynik = wykonajRuch(stan, kierunek);
  console.log(wynik.komunikat);
  
  if (wynik.komunikat === "OK") {
    stan = { ...wynik };
    delete stan.komunikat;
    rozejrzyj();
    stan = zakonczTure(stan);
  }
}

// SEKCJA C — PRZEDMIOTY I AKCJE
function wykonajAkcje(aktualnyStan, co) {
  if (aktualnyStan.koniec) {
    return { ...aktualnyStan, komunikat: "Gra dobiegła końca." };
  }

  let nowyStan = { ...aktualnyStan };
  let udane = false;

  switch (co) {
    case "karta":
      if (aktualnyStan.pokoj !== 1 || aktualnyStan.karta) {
        return { ...aktualnyStan, komunikat: "Tutaj nie ma karty lub już ją masz." };
      }
      nowyStan.karta = true;
      udane = true;
      console.log("Zabierasz kartę dostępu.");
      break;

    case "bezpiecznik":
      if (aktualnyStan.pokoj !== 2 || aktualnyStan.bezpiecznik || aktualnyStan.zasilanie) {
        return { ...aktualnyStan, komunikat: "Nie możesz podnieść bezpiecznika." };
      }
      nowyStan.bezpiecznik = true;
      udane = true;
      console.log("Zabierasz zapasowy bezpiecznik.");
      break;

    case "napraw":
      if (aktualnyStan.pokoj !== 3 || !aktualnyStan.bezpiecznik || aktualnyStan.zasilanie) {
        return { ...aktualnyStan, komunikat: "Nie możesz tutaj naprawić zasilania." };
      }
      nowyStan.bezpiecznik = false;
      nowyStan.zasilanie = true;
      udane = true;
      console.log("Montujesz bezpiecznik i przywracasz zasilanie!");
      break;

    case "wyjdz":
      if (aktualnyStan.pokoj !== 4 || !aktualnyStan.karta || !aktualnyStan.zasilanie) {
        return { ...aktualnyStan, komunikat: "Nie możesz otworzyć drzwi (wymaga karty i zasilania)." };
      }
      nowyStan.wygrana = true;
      nowyStan.koniec = true;
      udane = true;
      console.log("Otwierasz drzwi wyjściowe!");
      break;

    default:
      return { ...aktualnyStan, komunikat: "Nieznana akcja." };
  }

  nowyStan.udane = udane;
  return nowyStan;
}

function akcja(co) {
  const wynik = wykonajAkcje(stan, co);
  if (wynik.udane) {
    stan = { ...wynik };
    delete stan.udane;
    stan = zakonczTure(stan);
  } else if (wynik.komunikat) {
    console.log(wynik.komunikat);
  }
}

// SEKCJA D — ZAPIS, ODCZYT (JSON) I WALIDACJA (TRY/CATCH)
function zapiszGre() {
  const jsonTekst = JSON.stringify(stan);
  console.log("--- ZAPIS GRY (JSON) ---");
  console.log(jsonTekst);
  return jsonTekst;
}

function wczytajGre(jsonTekst) {
  try {
    const wczytanyStan = JSON.parse(jsonTekst);
    
    // Walidacja struktury wczytanych danych
    if (
      typeof wczytanyStan.pokoj === 'number' &&
      typeof wczytanyStan.energia === 'number' &&
      typeof wczytanyStan.karta === 'boolean' &&
      typeof wczytanyStan.bezpiecznik === 'boolean' &&
      typeof wczytanyStan.zasilanie === 'boolean'
    ) {
      stan = wczytanyStan;
      console.log("Gra została pomyślnie wczytana!");
      status();
      rozejrzyj();
    } else {
      console.log("Błąd walidacji: Wczytane dane mają niepoprawny format lub typy pól!");
    }
  } catch (blad) {
    console.log("Błąd krytyczny: Podany tekst nie jest poprawnym obiektem JSON! Szczegóły: " + blad.message);
  }
}