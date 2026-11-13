import { SalesChannel, PaymentMethod } from '../types';

export interface FeeRule {
  defaultFeePct: number;
  fixedFee: number;
  description: string;
}

export function getDefaultChannelFee(channel: SalesChannel, method: PaymentMethod): { feePct: number; fixedFee: number } {
  // Se for Pix ou Dinheiro em balcão/WhatsApp
  if (channel === 'balcao' || channel === 'whatsapp') {
    if (method === 'pix' || method === 'dinheiro' || method === 'transferencia') {
      return { feePct: 0, fixedFee: 0 };
    }
    if (method === 'cartao_debito') {
      return { feePct: 1.5, fixedFee: 0 };
    }
    if (method === 'cartao_credito') {
      return { feePct: 3.5, fixedFee: 0 };
    }
    return { feePct: 0, fixedFee: 0 };
  }

  // Mercado Livre (Comissão padrão de eletrônicos/ferramentas ~13%)
  if (channel === 'mercado_livre') {
    return { feePct: 13.0, fixedFee: 0 };
  }

  // OLX Pay com entrega / garantia da OLX (~10%)
  if (channel === 'olx') {
    if (method === 'dinheiro' || method === 'pix') {
      // Negociação direta no chat com encontro em mãos
      return { feePct: 0, fixedFee: 0 };
    }
    return { feePct: 10.0, fixedFee: 0 };
  }

  // Instagram Direct
  if (channel === 'instagram') {
    if (method === 'pix' || method === 'dinheiro') {
      return { feePct: 0, fixedFee: 0 };
    }
    if (method === 'cartao_credito') {
      return { feePct: 3.5, fixedFee: 0 };
    }
    return { feePct: 0, fixedFee: 0 };
  }

  // Loja Virtual própria
  if (channel === 'loja_virtual') {
    return { feePct: 4.0, fixedFee: 0.5 };
  }

  return { feePct: 0, fixedFee: 0 };
}

/**
 * Calcula o preço ideal de venda no canal para atingir um lucro líquido desejado.
 * Preço = (Custo + LucroDesejado + TaxaFixa) / (1 - TaxaPct/100)
 */
export function calculateIdealPrice(costPrice: number, desiredProfit: number, feePct: number, fixedFee: number = 0): number {
  if (feePct >= 100) return costPrice + desiredProfit;
  const divisor = 1 - feePct / 100;
  if (divisor <= 0) return costPrice + desiredProfit;
  const price = (costPrice + desiredProfit + fixedFee) / divisor;
  return Math.ceil(price); // Arredonda para cima
}
