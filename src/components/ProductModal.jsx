import React, { useState, useEffect } from 'react';
import { FaTimes, FaWhatsapp, FaRulerHorizontal, FaShieldAlt } from 'react-icons/fa';

const ProductModal = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    if (product) {
      if (product.imagens && product.imagens.length > 0) setMainImage(product.imagens[0]);
      if (product.tamanhos && product.tamanhos.length > 0) setSelectedSize(product.tamanhos[0]);
      if (product.cores && product.cores.length > 0) setSelectedColor(product.cores[0].nome);
    }
  }, [product]);

  if (!product) return null;

  const availableColors = product.cores || [];
  const availableSizes = product.tamanhos || [];
  const gallery = product.imagens || [];

  const handleWhatsAppClick = () => {
    const phoneNumber = "5511972276750"; 
    let message = `Olá! Estava olhando o catálogo e me interessei pelo *${product.nome}* (${product.preco}).\n`;
    
    if (selectedSize) message += `\nTamanho: *${selectedSize}*`;
    if (selectedColor) message += `\nCor: *${selectedColor}*`;
    message += `\n\nGostaria de saber se ainda está disponível!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}>
      
      {/* Modal levemente mais largo (max-w-5xl) para acomodar a foto maior */}
      <div className="bg-[#fcfaf9] w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-[#a88a87] bg-white/80 p-2 rounded-full hover:bg-[#dfcbc9] hover:text-[#3d2c2c] text-xl z-10 transition-all shadow-sm">
          <FaTimes />
        </button>

        {/* Lado Esquerdo - Galeria (Aumentado para 55% do espaço) */}
        <div className="w-full md:w-[55%] p-6 md:p-8 flex gap-4 md:gap-5 bg-white">
          
          {/* Miniaturas com largura fixa (w-24) e barra de rolagem invisível */}
          {gallery.length > 1 && (
            <div 
              className="hidden md:flex flex-col gap-3 w-20 md:w-24 shrink-0 overflow-y-auto max-h-[600px]" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Esconde a barra de rolagem feia
            >
              {gallery.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  onClick={() => setMainImage(img)}
                  className={`w-full h-28 md:h-32 object-cover rounded-xl cursor-pointer transition-all ${mainImage === img ? 'border-2 border-[#b57b77] opacity-100 ring-2 ring-offset-1 ring-[#dfcbc9]' : 'opacity-60 hover:opacity-100'}`} 
                  alt={`miniatura ${index + 1}`} 
                />
              ))}
            </div>
          )}
          
          {/* Imagem Principal Maior */}
          <div className="flex-1">
            {mainImage ? (
              <img src={mainImage} alt={product.nome} className="w-full aspect-[3/4] object-cover rounded-2xl shadow-sm" />
            ) : (
              <div className="w-full aspect-[3/4] bg-gray-100 rounded-2xl flex items-center justify-center text-sm text-gray-400">Sem Imagem</div>
            )}
          </div>
        </div>

        {/* Lado Direito - Informações (45% do espaço) */}
        <div className="w-full md:w-[45%] p-6 md:p-8 flex flex-col">
          <span className="text-xs font-bold tracking-widest text-[#a88a87] uppercase mb-3 bg-[#dfcbc9]/30 w-max px-3 py-1 rounded-full">
            {product.categoria}
          </span>
          
          <h2 className="text-3xl md:text-4xl font-serif text-[#3d2c2c] mb-3 leading-tight">{product.nome}</h2>
          <p className="text-2xl font-bold text-[#9c6662] mb-6">{product.preco}</p>
          
          <p className="text-[#5a4a42] text-sm mb-8 leading-relaxed">
            {product.descricao}
          </p>

          {/* Seletor de Tamanhos */}
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-[#3d2c2c]">Tamanhos disponíveis</span>
                <button className="text-xs text-[#a88a87] flex items-center gap-1 hover:underline font-medium">
                  <FaRulerHorizontal /> Guia de medidas
                </button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {availableSizes.map(size => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2.5 rounded-lg border font-semibold transition-all ${
                      selectedSize === size 
                        ? 'border-[#b57b77] bg-[#b57b77] text-white shadow-md' 
                        : 'border-[#dfcbc9] text-[#5a4a42] hover:border-[#b57b77] hover:bg-[#dfcbc9]/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seletor de Cores */}
          {availableColors.length > 0 && (
            <div className="mb-8">
              <span className="text-sm font-bold text-[#3d2c2c] block mb-3">
                Cores: <span className="font-normal text-[#5a4a42] ml-1">{selectedColor}</span>
              </span>
              <div className="flex gap-3">
                {availableColors.map(color => (
                  <button
                    key={color.nome}
                    onClick={() => setSelectedColor(color.nome)}
                    title={color.nome}
                    className={`w-9 h-9 rounded-full transition-all shadow-sm ${
                      selectedColor === color.nome ? 'ring-2 ring-offset-2 ring-[#b57b77] scale-110' : 'border border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  ></button>
                ))}
              </div>
            </div>
          )}

          {/* Botões - Margem ajustada para não esticar a tela */}
          <div className="mt-4">
            <button 
              onClick={handleWhatsAppClick}
              className="w-full py-4 bg-[#b57b77] text-white rounded-xl font-bold tracking-wider hover:bg-[#9c6662] transition-colors shadow-lg flex items-center justify-center gap-3 text-lg"
            >
              <FaWhatsapp className="text-2xl" /> CHAMAR NO WHATSAPP
            </button>

            <div className="flex items-center gap-2 mt-5 text-[#a88a87] text-[11px] justify-center uppercase tracking-widest font-bold">
              <FaShieldAlt className="text-sm" /> Compra 100% segura
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductModal;