import { MascotStatus } from "./types";

export const APP_NAME = "MediPal";

export const MASCOT_MESSAGES: Record<MascotStatus, string[]> = {
  [MascotStatus.HAPPY]: [
    "O pai tá on e roteando!",
    "Receba! Saúde em dia!",
    "Sextou? Não, tomou!",
    "Aí eu vi vantagem!",
    "Amassou na saúde!",
    "Gloria a Deuxxx!",
    "Check na meta diária!",
    "Quem toma não passa aperto.",
    "Hoje eu durmo tranquilo.",
    "Eu sabia que você não ia falhar!",
  ],
  [MascotStatus.CONCERNED]: [
    "Não esquece de tomar o remédio, cabeção",
    "Calma calabreso, esqueceu o remédio?",
    "E aí fake natty, vai tomar não?",
    "Não esquece de mim não...",
    "Tô de olho hein...",
    "Não deixa a peteca cair...",
    "Não me deixa no vácuo não...",
    "Eu acredito em você, vai lá!",
  ],
  [MascotStatus.SICK]: [
    "Tô só o pó da rabiola...",
    "Me ajuda a te ajudar...",
    "A chapa tá esquentando aqui...",
    "Reage, bota um cropped!",
    "Não me abandona assim...",
    "Tô ficando fraco aqui...",
  ],
  [MascotStatus.VERY_SICK]: [
    "Não tô tankando...",
    "Socorro Deus...",
    "Tô nas últimas...",
    "O sistema tá caindo...",
    "A dor tá batendo na porta...",
    "Tá doendo até a alma...",
    "Esse plot não tá legal...",
    "O clima tá pesado...",
  ],
  [MascotStatus.CRITICAL]: [
    "Vou de arrasta pra cima...",
    "F no chat...",
    "Apagando luzes...",
  ],
  [MascotStatus.DEAD]: [
    "Foi de base.",
    "Foi de Vasco.",
    "Foi de Americanas.",
    "R.I.P. (Tome o remédio para reviver)",
    "Foi de link na bio.",
    "Foi de CLT.",
    "Foi de modo anônimo.",
    "Foi de comes e bebes.",
    "Foi de camisa da saudade.",
  ]
};

export const LOCAL_TIPS = [
  "Bebe água, sua pele agradece!",
  "Descasque mais, desembale menos.",
  "Banana evita cãibra e te deixa feliz.",
  "Maçã: o lanche prático de quem tem pressa.",
  "Evite café depois das 16h pra dormir igual pedra.",
  "Mastiga devagar, a comida não vai fugir.",
  "Iogurte é vida pro seu intestino."
];