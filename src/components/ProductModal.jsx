import React, { useState } from 'react';
import { FaTimes, FaWhatsapp, FaRulerHorizontal, FaShieldAlt } from 'react-icons/fa';

const ProductModal = ({ product, onClose }) => {
  // Estados para guardar o que a cliente selecionou
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Se nenhum produto for passado, não renderiza nada
  if (!product) return null;

  // Array provisório de cores (inspirado no seu design)
  const availableColors = [
    { name: 'Estampa Rosa', hex: '#d8c5c5' },
    { name: 'Verde Oliva', hex: '#8a9a86' }
  ];

  // Array de tamanhos
  const availableSizes = ['P', 'M', 'G', 'GG'];

  // Função que monta a mensagem e abre o WhatsApp
  const handleWhatsAppClick = () => {
    // Número atualizado com o seu (55 = Brasil, 11 = DDD, 972276750 = Número)
    const phoneNumber = "5511972276750"; 
    
    // Monta a mensagem bonitinha
    let message = `Olá! Estava olhando o catálogo e me interessei pelo *${product.name}* (${product.price}).\n`;
    
    // Adiciona os detalhes se ela tiver selecionado
    if (selectedSize) message += `\nTamanho: *${selectedSize}*`;
    if (selectedColor) message += `\nCor: *${selectedColor}*`;
    
    message += `\n\nGostaria de saber se ainda está disponível!`;

    // Converte a mensagem para o formato de link da internet e abre a janela
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      
      <div className="bg-[#fcfaf9] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-[#a88a87] hover:text-[#9c6662] text-2xl z-10 transition-colors">
          <FaTimes />
        </button>

        {/* Lado Esquerdo - Galeria */}
        <div className="w-full md:w-1/2 p-6 flex gap-4">
          <div className="hidden md:flex flex-col gap-3 w-1/4">
            <img src={product.image} className="w-full aspect-[4/5] object-cover rounded-lg border-2 border-[#b57b77] cursor-pointer" alt="miniatura 1" />
            <img src={product.image} className="w-full aspect-[4/5] object-cover rounded-lg opacity-50 hover:opacity-100 cursor-pointer transition-opacity" alt="miniatura 2" />
          </div>
          <div className="w-full md:w-3/4">
            <img src={product.image} alt={product.name} className="w-full aspect-[4/5] object-cover rounded-xl shadow-sm" />
          </div>
        </div>

        {/* Lado Direito - Informações */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <span className="text-xs font-bold tracking-widest text-[#a88a87] uppercase mb-2 bg-[#dfcbc9]/30 w-max px-3 py-1 rounded-full">
            {product.category}
          </span>
          <h2 className="text-3xl font-serif text-[#3d2c2c] mb-2">{product.name}</h2>
          <p className="text-2xl font-semibold text-[#9c6662] mb-6">{product.price}</p>
          
          <p className="text-[#5a4a42] text-sm mb-6 leading-relaxed">
            Peça com caimento perfeito, leve e feminina. Possui detalhes exclusivos para realçar sua beleza com muito conforto e elegância em qualquer ocasião.
          </p>

          {/* Seletor de Tamanhos */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-[#5a4a42]">Tamanhos disponíveis</span>
              <button className="text-xs text-[#a88a87] flex items-center gap-1 hover:underline">
                <FaRulerHorizontal /> Guia de medidas
              </button>
            </div>
            <div className="flex gap-3">
              {availableSizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 rounded-md border font-medium transition-all ${
                    selectedSize === size 
                      ? 'border-[#b57b77] bg-[#dfcbc9]/30 text-[#b57b77]' 
                      : 'border-[#dfcbc9] text-[#5a4a42] hover:border-[#b57b77]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Seletor de Cores */}
          <div className="mb-8">
            <span className="text-sm font-semibold text-[#5a4a42] block mb-3">Cores disponíveis</span>
            <div className="flex gap-3">
              {availableColors.map(color => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  title={color.name}
                  className={`w-8 h-8 rounded-full transition-all ${
                    selectedColor === color.name ? 'ring-2 ring-offset-2 ring-[#b57b77]' : 'ring-1 ring-gray-300 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                ></button>
              ))}
            </div>
          </div>

          {/* Botão do WhatsApp chamando a função */}
          <button 
            onClick={handleWhatsAppClick}
            className="w-full py-4 bg-[#b57b77] text-white rounded-lg font-medium tracking-wide hover:bg-[#9c6662] transition-colors shadow-md flex items-center justify-center gap-3 text-lg mt-auto"
          >
            <FaWhatsapp className="text-2xl" /> CHAMAR NO WHATSAPP
          </button>

          <div className="flex items-center gap-2 mt-4 text-[#a88a87] text-xs justify-center uppercase tracking-wider font-semibold">
            <FaShieldAlt /> Compra 100% segura
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;