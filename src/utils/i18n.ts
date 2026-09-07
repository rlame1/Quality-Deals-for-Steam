import { Language } from '../types';

export interface Translations {
  appName: string;
  appTagline: string;
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  dealsInCatalog: string;
  searchPlaceholder: string;
  sortLabel: string;
  sortDiscount: string;
  sortMetacritic: string;
  sortSteamRating: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortDealRating: string;
  genreLabel: string;
  coopFilter: string;
  allTimeLowFilter: string;
  allTimeLowFilterShort: string;
  priceFilterLabel: string;
  priceAll: string;
  priceUnder5: string;
  priceUnder10: string;
  priceUnder20: string;
  filtersBtn: string;
  resetBtn: string;
  maxPriceLabel: string;
  noLimit: string;
  minDiscountLabel: string;
  minMetacriticLabel: string;
  minSteamRatingLabel: string;
  minReleaseYearLabel: string;
  topDealsBtn: string;
  refreshBtn: string;
  refreshDealsTooltip: string;
  releaseYearLabel: string;
  allYearsOption: string;
  releaseYearTooltip: string;
  newestGames: string;
  allOption: string;
  listHeaderGame: string;
  listHeaderRatings: string;
  listHeaderDiscount: string;
  listHeaderPrice: string;
  listHeaderAction: string;
  allTimeLowBadge: string;
  allTimeLowTooltip: string;
  recordLow: string;
  lowestEver: string;
  aboveRecord: string;
  coOpBadge: string;
  historicalLowBadge: string;
  coopBadge: string;
  inWatchlist: string;
  addToWatchlist: string;
  historicalLowTitle: string;
  historicalLowDesc: string;
  notHistoricalLowDesc: string;
  recordedHistoricalLow: string;
  noReviews: string;
  steamRatingLabel: string;
  aboutGame: string;
  aboutGameFallback: string;
  genresAndFeatures: string;
  regularPrice: string;
  youSave: string;
  metaScoreLabel: string;
  steamScoreLabel: string;
  steamStoreBtn: string;
  openSteamStore: string;
  saveToWatchlist: string;
  removeFromWatchlist: string;
  onWatchlist: string;
  watchlistTitle: string;
  watchlistSubtitle: string;
  watchlistEmptyTitle: string;
  watchlistEmptySubtitle: string;
  browseDeals: string;
  totalPrice: string;
  yourSavings: string;
  avgDiscount: string;
  continueBrowsing: string;
  allGamesOnSale: string;
  modalReleased: string;
  modalDeveloper: string;
  modalPublisher: string;
  modalMetascoreTitle: string;
  modalMetascoreAcclaimed: string;
  modalMetascoreMixed: string;
  modalMetascoreNone: string;
  modalSteamReviewsTitle: string;
  modalSteamPositiveRatio: string;
  modalHistoricalPriceTitle: string;
  modalHistoricalLowRecord: string;
  modalHistoricalLowAbove: string;
  modalNormalPrice: string;
  modalYouSave: string;
  modalDiscount: string;
  modalGoToStore: string;
  regionSelectorLabel: string;
  regionBannerNote: string;
  regionChangeTip: string;
  noResultsTitle: string;
  noResultsSubtitle: string;
  resetAllFiltersBtn: string;
  footerSyncNote: string;
  footerGamesCount: string;
  footerSteamOnline: string;
  footerMetaSync: string;
  footerRegionActive: string;
  paginationPrev: string;
  paginationNext: string;
  paginationFirst: string;
  paginationLast: string;
  paginationPageOf: string;
  paginationShowing: string;
  paginationPerPage: string;
  paginationAll: string;
  genres: Record<string, string>;
  steamRatings: Record<string, string>;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'Quality Deals for Steam',
    appTagline: 'Only games with Metascore ≥ 70% or Steam Rating ≥ 7.0 (70%+) listed',
    heroBannerTitle: 'Top Steam Deals Ranked by Discount Percentage',
    heroBannerSubtitle: 'Only games with Metascore ≥ 70% or Steam Rating ≥ 7.0 (70%+) listed. Compare regional prices, historical lows, and co-op features.',
    dealsInCatalog: '{count} games on sale in catalog',
    searchPlaceholder: 'Search games by title (e.g. Disco Elysium, It Takes Two, Hades)...',
    sortLabel: 'Sort by:',
    sortDiscount: 'Discount % (Highest first)',
    sortMetacritic: 'Metascore (Highest first)',
    sortSteamRating: 'User Reviews (Best first)',
    sortPriceAsc: 'Price (Lowest first)',
    sortPriceDesc: 'Price (Highest first)',
    sortDealRating: 'Deal Value (Best price/quality)',
    genreLabel: 'Genre:',
    coopFilter: 'Online Co-op',
    allTimeLowFilter: '🔥 All-Time Low Only',
    allTimeLowFilterShort: 'All-Time Low',
    priceFilterLabel: 'Max Price:',
    priceAll: 'All',
    priceUnder5: 'Under 5',
    priceUnder10: 'Under 10',
    priceUnder20: 'Under 20',
    filtersBtn: 'Filters',
    resetBtn: 'Reset',
    maxPriceLabel: 'Max price:',
    noLimit: 'No limit',
    minDiscountLabel: 'Minimum discount:',
    minMetacriticLabel: 'Minimum Metascore:',
    minSteamRatingLabel: 'Minimum user rating:',
    minReleaseYearLabel: 'Min release year:',
    topDealsBtn: 'Top Deals',
    refreshBtn: 'Refresh',
    refreshDealsTooltip: 'Refresh discount prices',
    releaseYearLabel: 'Release year:',
    allYearsOption: 'All years',
    releaseYearTooltip: 'Filter out older games by release year',
    newestGames: 'Latest (2024+)',
    allOption: 'All',
    listHeaderGame: 'Game Title & Genre',
    listHeaderRatings: 'Ratings (Meta & Steam)',
    listHeaderDiscount: 'Discount',
    listHeaderPrice: 'Price & Lowest Ever',
    listHeaderAction: 'Action',
    allTimeLowBadge: 'ALL-TIME LOW',
    allTimeLowTooltip: 'This game is currently at the lowest price ever recorded on Steam!',
    recordLow: 'Record Low!',
    lowestEver: 'Lowest ever:',
    aboveRecord: 'above lowest',
    coOpBadge: 'ONLINE CO-OP',
    historicalLowBadge: 'ALL-TIME LOW',
    coopBadge: 'CO-OP',
    inWatchlist: 'In Watchlist',
    addToWatchlist: 'Add to Watchlist',
    historicalLowTitle: 'All-Time Low Price',
    historicalLowDesc: 'This is the lowest price ever recorded for this game on Steam!',
    notHistoricalLowDesc: 'Current price is {diff} above historical low',
    recordedHistoricalLow: 'Recorded low',
    noReviews: 'No reviews',
    steamRatingLabel: 'Steam User Rating:',
    aboutGame: 'About This Game',
    aboutGameFallback: 'No description available for this deal.',
    genresAndFeatures: 'Genres & Features',
    regularPrice: 'Regular price',
    youSave: 'You save',
    metaScoreLabel: 'Meta',
    steamScoreLabel: 'Steam',
    steamStoreBtn: 'Steam',
    openSteamStore: 'Open official Steam store page',
    saveToWatchlist: 'Save to watchlist',
    removeFromWatchlist: 'Remove from watchlist',
    onWatchlist: 'On Watchlist',
    watchlistTitle: 'Your Watchlist',
    watchlistSubtitle: 'Track your favorite games and deals',
    watchlistEmptyTitle: 'Your watchlist is empty',
    watchlistEmptySubtitle: 'Bookmark games from the deal list to save them here.',
    browseDeals: 'Browse Deals',
    totalPrice: 'Total Price',
    yourSavings: 'Your Savings',
    avgDiscount: 'Avg Discount',
    continueBrowsing: 'Continue Browsing',
    allGamesOnSale: 'All {count} games on sale on Steam',
    modalReleased: 'Released:',
    modalDeveloper: 'Developer:',
    modalPublisher: 'Publisher:',
    modalMetascoreTitle: 'Metascore',
    modalMetascoreAcclaimed: 'Critically Acclaimed',
    modalMetascoreMixed: 'Mixed or Average',
    modalMetascoreNone: 'No Metacritic score',
    modalSteamReviewsTitle: 'User Reviews',
    modalSteamPositiveRatio: '{percent}% positive reviews',
    modalHistoricalPriceTitle: 'Historical Low Price Analysis',
    modalHistoricalLowRecord: '🔥 MATCHES ALL-TIME LOWEST PRICE EVER!',
    modalHistoricalLowAbove: 'All-time lowest recorded price: {price} ({diff} above record)',
    modalNormalPrice: 'Regular price:',
    modalYouSave: 'You save',
    modalDiscount: 'OFF',
    modalGoToStore: 'Go to Steam Store',
    regionSelectorLabel: 'Region & Currency:',
    regionBannerNote: 'Prices & availability matched for:',
    regionChangeTip: 'Click to switch regional store & currency',
    noResultsTitle: 'No games found matching selected filters',
    noResultsSubtitle: 'Try adjusting your search criteria or reset filters.',
    resetAllFiltersBtn: 'Reset All Filters',
    footerSyncNote: 'Data synchronized from Steam & Metacritic',
    footerGamesCount: '{count} games in database',
    footerSteamOnline: 'Steam API Online',
    footerMetaSync: 'Metacritic Sync Active',
    footerRegionActive: 'Regional Store Active',
    paginationPrev: 'Previous',
    paginationNext: 'Next',
    paginationFirst: 'First page',
    paginationLast: 'Last page',
    paginationPageOf: 'Page {current} of {total}',
    paginationShowing: 'Showing {start}–{end} of {total} results',
    paginationPerPage: 'Results per page:',
    paginationAll: 'All',
    genres: {
      'Kaikki': 'All',
      'All': 'All',
      'Toiminta': 'Action',
      'Action': 'Action',
      'Roolipelit': 'RPG',
      'RPG': 'RPG',
      'Strategia': 'Strategy',
      'Strategy': 'Strategy',
      'Seikkailu': 'Adventure',
      'Adventure': 'Adventure',
      'Simulaatio': 'Simulation',
      'Simulation': 'Simulation',
      'Roguelike': 'Roguelike',
      'Rogue-like': 'Roguelike',
      'Indie': 'Indie',
      'Kauhu': 'Horror',
      'Horror': 'Horror',
      'Ammunta': 'Shooter',
      'Shooter': 'Shooter',
      'FPS': 'FPS',
      'Pulmapelit': 'Puzzle',
      'Puzzle': 'Puzzle',
      'Tasohyppely': 'Platformer',
      'Platformer': 'Platformer',
      'Selviytyminen': 'Survival',
      'Survival': 'Survival',
      'Urheilu / Ajopelit': 'Sports / Racing',
      'Urheilu': 'Sports',
      'Sports': 'Sports',
      'Ajopelit': 'Racing',
      'Racing': 'Racing',
      'Avaruus': 'Sci-Fi / Space',
      'Sci-Fi': 'Sci-Fi',
      'Fantasia': 'Fantasy',
      'Fantasy': 'Fantasy',
      'Mysteeri': 'Mystery',
      'Mystery': 'Mystery',
      'Hiekkalaatikko': 'Sandbox',
      'Sandbox': 'Sandbox',
      'Vuoropohjainen': 'Turn-Based',
      'Turn-Based': 'Turn-Based',
      'Hiiviskely': 'Stealth',
      'Stealth': 'Stealth',
      'Korttipelit': 'Card Games',
      'Card Game': 'Card Game',
      'Taistelu': 'Fighting',
      'Fighting': 'Fighting',
      'Tarinapohjainen': 'Story-Rich',
      'Hack and Slash': 'Hack and Slash',
    },
    steamRatings: {
      'Valtavan myönteinen': 'Overwhelmingly Positive',
      'Erittäin myönteinen': 'Very Positive',
      'Enimmäkseen myönteinen': 'Mostly Positive',
      'Myönteinen': 'Positive',
      'Ristiriitainen': 'Mixed',
      'Enimmäkseen kielteinen': 'Mostly Negative',
      'Valtavan kielteinen': 'Overwhelmingly Negative',
      'Overwhelmingly Positive': 'Overwhelmingly Positive',
      'Very Positive': 'Very Positive',
      'Mostly Positive': 'Mostly Positive',
      'Positive': 'Positive',
      'Mixed': 'Mixed',
      'Mostly Negative': 'Mostly Negative',
      'Overwhelmingly Negative': 'Overwhelmingly Negative',
    },
  },
  fi: {
    appName: 'Quality Deals for Steam',
    appTagline: 'Listattuna vain pelit, joiden Metascore ≥ 70% tai Steam-arvosana ≥ 7.0 (70%+)',
    heroBannerTitle: 'Parhaat Steam-alennukset järjestettynä alennusprosentin mukaan',
    heroBannerSubtitle: 'Listattuna vain pelit, joiden Metascore on vähintään 70% tai Steam-arvostelu vähintään 7.0 (70%). Vertaa alueellisia hintoja, pohjahintoja ja yhteistyöpelitiloja.',
    dealsInCatalog: '{count} alennuspeliä valikoimassa',
    searchPlaceholder: 'Hae pelejä nimellä (esim. Disco Elysium, It Takes Two, Hades)...',
    sortLabel: 'Järjestys:',
    sortDiscount: 'Alennusprosentti (Suurin ensin)',
    sortMetacritic: 'Metascore (Korkein ensin)',
    sortSteamRating: 'Käyttäjäarvostelut (Paras ensin)',
    sortPriceAsc: 'Hinta (Edullisin ensin)',
    sortPriceDesc: 'Hinta (Kallein ensin)',
    sortDealRating: 'Diiliarvo (Paras hinta-laatu)',
    genreLabel: 'Lajityyppi:',
    coopFilter: 'Verkkoyhteistyö (Co-op)',
    allTimeLowFilter: '🔥 Vain halvin ikinä',
    allTimeLowFilterShort: 'Halvin ikinä',
    priceFilterLabel: 'Hintaraja:',
    priceAll: 'Kaikki',
    priceUnder5: 'Alle 5',
    priceUnder10: 'Alle 10',
    priceUnder20: 'Alle 20',
    filtersBtn: 'Suodattimet',
    resetBtn: 'Nollaa',
    maxPriceLabel: 'Maksimihinta:',
    noLimit: 'Ei rajaa',
    minDiscountLabel: 'Alennus vähintään:',
    minMetacriticLabel: 'Metascore vähintään:',
    minSteamRatingLabel: 'Käyttäjäarvostelut vähintään:',
    minReleaseYearLabel: 'Julkaisuvuosi vähintään:',
    topDealsBtn: 'Huippulöydöt',
    refreshBtn: 'Päivitä',
    refreshDealsTooltip: 'Päivitä alennushinnat',
    releaseYearLabel: 'Julkaisuvuosi:',
    allYearsOption: 'Kaikki vuodet',
    releaseYearTooltip: 'Karsi vanhemmat pelit pois asettamalla vähimmäisjulkaisuvuosi',
    newestGames: 'Uusimmat (2024+)',
    allOption: 'Kaikki',
    listHeaderGame: 'Pelin nimi & Lajityyppi',
    listHeaderRatings: 'Arvostelut (Meta & Steam)',
    listHeaderDiscount: 'Ale %',
    listHeaderPrice: 'Hinta & Alin ikinä',
    listHeaderAction: 'Toiminto',
    allTimeLowBadge: 'HALVIN IKINÄ',
    allTimeLowTooltip: 'Tämä peli on tällä hetkellä kaikkien aikojen alimmassa hinnassaan Steamissa!',
    recordLow: 'Pohjanoteeraus!',
    lowestEver: 'Alin ikinä:',
    aboveRecord: 'yli alimman',
    coOpBadge: 'VERKKOYHTEISTYÖ',
    historicalLowBadge: 'HISTORIALLINEN POHJAHINTA',
    coopBadge: 'CO-OP',
    inWatchlist: 'Seurantalistalla',
    addToWatchlist: 'Lisää seurantalistalle',
    historicalLowTitle: 'Kaikkien aikojen alin hinta',
    historicalLowDesc: 'Tämä on kaikkien aikojen halvin hinta, joka tälle pelille on Steamissa koskaan mitattu!',
    notHistoricalLowDesc: 'Nykyinen hinta on {diff} yli kaikkien aikojen alimman hinnan',
    recordedHistoricalLow: 'Mitattu pohjahinta',
    noReviews: 'Ei arvosteluja',
    steamRatingLabel: 'Steamin käyttäjäarvosana:',
    aboutGame: 'Tietoa pelistä',
    aboutGameFallback: 'Tälle pelille ei ole saatavilla kuvausta.',
    genresAndFeatures: 'Lajityypit & Ominaisuudet',
    regularPrice: 'Normaalihinta',
    youSave: 'Säästät',
    metaScoreLabel: 'Meta',
    steamScoreLabel: 'Steam',
    steamStoreBtn: 'Steam',
    openSteamStore: 'Avaa virallinen Steam-kauppasivu',
    saveToWatchlist: 'Tallenna seurantalistalle',
    removeFromWatchlist: 'Poista seurantalistalta',
    onWatchlist: 'Seurantalistalla',
    watchlistTitle: 'Seurantalistasi',
    watchlistSubtitle: 'Tallennetut pelit ja niiden alennukset',
    watchlistEmptyTitle: 'Seurantalistasi on tyhjä',
    watchlistEmptySubtitle: 'Tallenna kiinnostavia pelejä klikkaamalla kirjanmerkkikuvaketta.',
    browseDeals: 'Selaa alennuksia',
    totalPrice: 'Yhteishinta',
    yourSavings: 'Säästösi',
    avgDiscount: 'Keskim. ale',
    continueBrowsing: 'Jatka selaamista',
    allGamesOnSale: 'Kaikki {count} peliä Steam-alennuksessa',
    modalReleased: 'Julkaistu:',
    modalDeveloper: 'Kehittäjä:',
    modalPublisher: 'Julkaisija:',
    modalMetascoreTitle: 'Metascore',
    modalMetascoreAcclaimed: 'Kriitikoiden ylistämä',
    modalMetascoreMixed: 'Sekalaisia tai hyviä',
    modalMetascoreNone: 'Ei Metacritic-pistettä',
    modalSteamReviewsTitle: 'Käyttäjäarvosana',
    modalSteamPositiveRatio: '{percent}% myönteisiä arvioita',
    modalHistoricalPriceTitle: 'Historiallisen alimman hinnan vertailu',
    modalHistoricalLowRecord: '🔥 HISTORIALLISESTI HALVIN HINTA IKINÄ!',
    modalHistoricalLowAbove: 'Kaikkien aikojen pohjahinta: {price} ({diff} yli alimman)',
    modalNormalPrice: 'Normaalihinta:',
    modalYouSave: 'Säästät',
    modalDiscount: 'ALENNUS',
    modalGoToStore: 'Siirry Steam-kauppaan',
    regionSelectorLabel: 'Alue & Valuutta:',
    regionBannerNote: 'Hinnat ja saatavuus sovitettu alueelle:',
    regionChangeTip: 'Vaihda kauppa-alue ja valuutta klikkaamalla',
    noResultsTitle: 'Yhtään peliä ei löytynyt valituilla suodattimilla',
    noResultsSubtitle: 'Kokeile muuttaa hakusanaa tai nollaa suodattimet.',
    resetAllFiltersBtn: 'Nollaa kaikki suodattimet',
    footerSyncNote: 'Tiedot synkronoitu Steam & Metacritic -lähteistä',
    footerGamesCount: '{count} peliä tietokannassa',
    footerSteamOnline: 'Steam API Online',
    footerMetaSync: 'Metacritic Sync Aktiivinen',
    footerRegionActive: 'Alueellinen kauppa aktiivinen',
    paginationPrev: 'Edellinen',
    paginationNext: 'Seuraava',
    paginationFirst: 'Ensimmäinen sivu',
    paginationLast: 'Viimeinen sivu',
    paginationPageOf: 'Sivu {current} / {total}',
    paginationShowing: 'Näytetään {start}–{end} / {total} tulosta',
    paginationPerPage: 'Tuloksia sivulla:',
    paginationAll: 'Kaikki',
    genres: {
      'Kaikki': 'Kaikki',
      'All': 'Kaikki',
      'Toiminta': 'Toiminta',
      'Action': 'Toiminta',
      'Roolipelit': 'Roolipelit',
      'RPG': 'Roolipelit',
      'Strategia': 'Strategia',
      'Strategy': 'Strategia',
      'Seikkailu': 'Seikkailu',
      'Adventure': 'Seikkailu',
      'Simulaatio': 'Simulaatio',
      'Simulation': 'Simulaatio',
      'Roguelike': 'Roguelike',
      'Rogue-like': 'Roguelike',
      'Indie': 'Indie',
      'Kauhu': 'Kauhu',
      'Horror': 'Kauhu',
      'Ammunta': 'Ammunta',
      'Shooter': 'Ammunta',
      'FPS': 'Ammunta',
      'Pulmapelit': 'Pulmapelit',
      'Puzzle': 'Pulmapelit',
      'Tasohyppely': 'Tasohyppely',
      'Platformer': 'Tasohyppely',
      'Selviytyminen': 'Selviytyminen',
      'Survival': 'Selviytyminen',
      'Urheilu / Ajopelit': 'Urheilu / Ajopelit',
      'Urheilu': 'Urheilu',
      'Sports': 'Urheilu',
      'Ajopelit': 'Ajopelit',
      'Racing': 'Ajopelit',
      'Avaruus': 'Scifi / Avaruus',
      'Sci-Fi': 'Scifi / Avaruus',
      'Fantasia': 'Fantasia',
      'Fantasy': 'Fantasia',
      'Mysteeri': 'Mysteeri',
      'Mystery': 'Mysteeri',
      'Hiekkalaatikko': 'Hiekkalaatikko',
      'Sandbox': 'Hiekkalaatikko',
      'Vuoropohjainen': 'Vuoropohjainen',
      'Turn-Based': 'Vuoropohjainen',
      'Hiiviskely': 'Hiiviskely',
      'Stealth': 'Hiiviskely',
      'Korttipelit': 'Korttipelit',
      'Card Game': 'Korttipelit',
      'Taistelu': 'Taistelupelit',
      'Fighting': 'Taistelupelit',
      'Tarinapohjainen': 'Tarinapohjainen',
      'Hack and Slash': 'Hack and Slash',
    },
    steamRatings: {
      'Valtavan myönteinen': 'Valtavan myönteinen',
      'Erittäin myönteinen': 'Erittäin myönteinen',
      'Enimmäkseen myönteinen': 'Enimmäkseen myönteinen',
      'Myönteinen': 'Myönteinen',
      'Ristiriitainen': 'Ristiriitainen',
      'Enimmäkseen kielteinen': 'Enimmäkseen kielteinen',
      'Valtavan kielteinen': 'Valtavan kielteinen',
      'Overwhelmingly Positive': 'Valtavan myönteinen',
      'Very Positive': 'Erittäin myönteinen',
      'Mostly Positive': 'Enimmäkseen myönteinen',
      'Positive': 'Myönteinen',
      'Mixed': 'Ristiriitainen',
      'Mostly Negative': 'Enimmäkseen kielteinen',
      'Overwhelmingly Negative': 'Valtavan kielteinen',
    },
  },
};

export const GENRE_KEYS = [
  'All',
  'Toiminta',
  'Roolipelit',
  'Strategia',
  'Seikkailu',
  'Simulaatio',
  'Roguelike',
  'Indie',
  'Kauhu',
  'Ammunta',
  'Pulmapelit',
  'Tasohyppely',
  'Selviytyminen',
];
