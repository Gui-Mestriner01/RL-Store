import React from 'react';
import { FaRegCreditCard, FaTruck, FaLock, FaRegHeart } from 'react-icons/fa';

const BenefitsBar = () => {
  const benefits = [
    {
      icon: <FaRegCreditCard className="text-4xl text-[#3d2c2c] stroke-[0.5]" />,
      title: "PARCELE EM ATÉ 6X",
      desc: "Sem juros no cartão de crédito"
    },
    {
      icon: <FaTruck className="text-4xl text-[#3d2c2c]" />,
      title: "ENTREGA RÁPIDA",
      desc: "Entregas expressas em toda a cidade" // Adaptado para a operação local!
    },
    {
      icon: <FaLock className="text-4xl text-[#3d2c2c]" />,
      title: "COMPRA SEGURA",
      desc: "Seus dados protegidos com segurança"
    },
    {
      icon: <FaRegHeart className="text-4xl text-[#3d2c2c]" />,
      title: "ATENDIMENTO",
      desc: "Suporte humanizado e próximo"
    }
  ];

  return (
    <section className="bg-[#fcfaf9] border-y border-[#dfcbc9] py-12 mt-16">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-5">
              <div className="text-[#a88a87]">{benefit.icon}</div>
              <div>
                <h4 className="text-sm font-bold text-[#3d2c2c] tracking-wide mb-1">{benefit.title}</h4>
                <p className="text-xs text-[#5a4a42]">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsBar;