import { useEffect, useRef } from 'react';

const EpaycoButton = () => {
  const formRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.epayco.co/checkout.js';
    script.className = 'epayco-button';
    script.setAttribute('data-epayco-key', 'f102927facb1d03e880f81126e8b69e4');
    script.setAttribute('data-epayco-amount', '100000');
    script.setAttribute('data-epayco-tax', '0.00');
    script.setAttribute('data-epayco-tax-ico', '0.00');
    script.setAttribute('data-epayco-tax-base', '100000');
    script.setAttribute('data-epayco-name', 'Reserva de cancha');
    script.setAttribute('data-epayco-description', 'Reserva de cancha');
    script.setAttribute('data-epayco-currency', 'cop');
    script.setAttribute('data-epayco-country', 'CO');
    script.setAttribute('data-epayco-test', 'true');
    script.setAttribute('data-epayco-external', 'false');
    script.setAttribute('data-epayco-response', 'https://assessed-themes-licence-msgid.trycloudflare.com/reservas/pago');
    script.setAttribute('data-epayco-confirmation', 'https://comments-bone-christmas-decisions.trycloudflare.com/gestion-reserva');
    script.setAttribute('data-epayco-button', 'https://multimedia.epayco.co/dashboard/btns/btn5.png');

    if (formRef.current) {
      formRef.current.innerHTML = ''; // Limpia cualquier botón anterior
      formRef.current.appendChild(script);
    }
  }, []);

  return <form ref={formRef}></form>;
};

export default EpaycoButton;
