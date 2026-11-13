import { Sale, Product } from '../types';
import { formatCurrency, formatDate, getChannelLabel, getPaymentMethodLabel } from './formatters';

export function generateWhatsAppReceipt(
  sale: Sale,
  storeName: string = 'RL Market',
  pixKey?: string
): string {
  const lines: string[] = [
    `🧾 *COMPROVANTE DE PEDIDO — ${storeName.toUpperCase()}*`,
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `*Pedido:* #${sale.code}`,
    `*Data:* ${formatDate(sale.soldAt)}`,
    sale.customerName ? `*Cliente:* ${sale.customerName}` : '',
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `📦 *PRODUTO:*`,
    `${sale.productName}`,
    `*Qtd:* ${sale.quantity}x | *Unit:* ${formatCurrency(sale.unitFinalPrice)}`,
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `💰 *TOTAL DO PEDIDO:* *${formatCurrency(sale.totalReceived)}*`,
    `*Forma de Pagamento:* ${getPaymentMethodLabel(sale.paymentMethod)}`,
    sale.paymentStatus === 'pago'
      ? `*Status:* ✅ Pago com sucesso`
      : sale.paymentStatus === 'parcial'
      ? `*Status:* 🟡 Parcial (Pago: ${formatCurrency(sale.amountPaid)} | Restante: ${formatCurrency(sale.amountPending)})`
      : `*Status:* ⏳ Pagamento Pendente (${formatCurrency(sale.amountPending)})`,
  ];

  if (pixKey && sale.paymentMethod === 'pix' && sale.paymentStatus !== 'pago') {
    lines.push(`\n*Chave Pix para pagamento:* \`${pixKey}\``);
  }

  if (sale.warrantyDays) {
    lines.push(`\n🛡️ *Garantia:* ${sale.warrantyDays} dias com nossa loja.`);
  }

  lines.push(
    `━━━━━━━━━━━━━━━━━━━━━━━`,
    `_Agradecemos a sua preferência e confiança!_ 🙏`,
    `Dúvidas ou suporte? Estamos à disposição.`
  );

  return lines.filter(Boolean).join('\n');
}

export function generateWhatsAppLink(phone: string | undefined, message: string): string {
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  const encodedText = encodeURIComponent(message);
  if (cleanPhone) {
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${formattedPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
}

export function generateAdCopy(
  product: Product,
  storeName: string = 'RL Market'
): { olx: string; instagram: string } {
  const olx = [
    `🔥 ${product.name.toUpperCase()} 🔥`,
    ``,
    `✅ PRODUTO NOVO NA CAIXA COM GARANTIA!`,
    `Preço promocional: ${formatCurrency(product.salePrice)} à vista no Pix ou dinheiro.`,
    ``,
    `📋 ESPECIFICAÇÕES:`,
    product.description || `Produto de alta qualidade, resistente e pronto para uso imediato.`,
    ``,
    `📍 RETIRADA / ENTREGA:`,
    `- Retirada rápida em mãos no local combinado.`,
    `- Aceitamos Pix, Cartão de Crédito e Débito.`,
    `- Garantia de ${product.warrantyDays || 90} dias!`,
    ``,
    `💬 Interessados chamar no chat ou WhatsApp. Respondo rápido!`,
  ].join('\n');

  const instagram = [
    `Novidade na ${storeName}! ✨`,
    ``,
    `${product.name}`,
    ``,
    `Por apenas ${formatCurrency(product.salePrice)} à vista!`,
    ``,
    `${product.description || 'Garantia de procedência e melhor preço da região.'}`,
    ``,
    `⚡ Poucas unidades em estoque!`,
    `💳 Aceitamos Pix e Cartão.`,
    `📦 Entregamos ou combinamos retirada.`,
    ``,
    `👉 Chame no Direct ou no link da Bio para garantir a sua!`,
    ``,
    `#rlmarket #promoção #oferta #${product.category.toLowerCase().replace(/[^a-z0-9]/g, '')} #novidades #lojaonline`,
  ].join('\n');

  return { olx, instagram };
}
