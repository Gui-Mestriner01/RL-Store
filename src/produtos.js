export const produtosDaLoja = [
  {
    id: 1,
    nome: "Body Regata Decote Quadrado",
    preco: "R$ 189,90",
    categoria: "blusas",
    descricao: "Peça com caimento perfeito, leve e feminina. Possui detalhes exclusivos para realçar sua beleza com muito conforto e elegância em qualquer ocasião.",
    
    imagens: [
      "/roupas/body_regata1.png", 
      "/roupas/BodyRegataAzul.png",
      "/roupas/BodyRegataMarrom.png",
      "/roupas/body_regata2.png",
      "/roupas/body_regata3.png",
      "/roupas/body_regata4.png",
      "/roupas/body_regata5.png"
    ],
    
    tamanhos: ["Tamanho Único (36 ao 44)"],
    
    cores: [
      { nome: "Preto", hex: "#1a1a1a" },
      { nome: "Marrom", hex: "#4b2617" },
      { nome: "Azul Escuro", hex: "#0f0c3a" }
    ],
    
    novoLançamento: true
  },

  {
    id: 2,
    nome: "Vestido Midi Floral",
    preco: "R$ 229,90",
    categoria: "vestidos",
    descricao: "Vestido leve para o verão, estampa exclusiva RL Store.",
    imagens: [
      "/roupas/vestido-floral-1.jpg" // Se tiver uma foto só, não tem problema
    ],
    tamanhos: ["M", "G"], // Essa peça só tem M e G, por exemplo
    cores: [
      { nome: "Estampado", hex: "#e0aca3" }
    ],
    novoLançamento: false
  }
];