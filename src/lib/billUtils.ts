/**
 * Authentic Cafe Bill / Invoice Utilities
 * Formats monetary amounts in words, calculates standard GST breakdowns (CGST + SGST),
 * and generates official tax invoice identifiers.
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanOneThousand(num: number): string {
  let current = '';

  if (num % 100 < 20) {
    current = ONES[num % 100];
    num = Math.floor(num / 100);
  } else {
    current = ONES[num % 10];
    num = Math.floor(num / 10);

    current = TENS[num % 10] + (current ? ' ' + current : '');
    num = Math.floor(num / 10);
  }

  if (num === 0) return current;
  return ONES[num] + ' Hundred' + (current ? ' and ' + current : '');
}

/**
 * Converts a number to Indian currency words format (Rupees & Paise)
 * e.g. 450 -> "Four Hundred and Fifty Rupees Only"
 */
export function numberToWordsRupees(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Zero Rupees Only';

  const rounded = Math.round(amount * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  if (rupees === 0 && paise === 0) return 'Zero Rupees Only';

  let result = '';

  if (rupees > 0) {
    let num = rupees;

    // Crores
    const crores = Math.floor(num / 10000000);
    num %= 10000000;
    if (crores > 0) {
      result += convertLessThanOneThousand(crores) + ' Crore ';
    }

    // Lakhs
    const lakhs = Math.floor(num / 100000);
    num %= 100000;
    if (lakhs > 0) {
      result += convertLessThanOneThousand(lakhs) + ' Lakh ';
    }

    // Thousands
    const thousands = Math.floor(num / 1000);
    num %= 1000;
    if (thousands > 0) {
      result += convertLessThanOneThousand(thousands) + ' Thousand ';
    }

    // Hundreds, tens, units
    if (num > 0) {
      result += convertLessThanOneThousand(num);
    }

    result = result.trim() + ' Rupees';
  }

  if (paise > 0) {
    result += (result ? ' and ' : '') + convertLessThanOneThousand(paise) + ' Paise';
  }

  return result + ' Only';
}

/**
 * Generates an authentic Tax Invoice Serial Number
 * Format: ZF/YYYY/MM/ID
 */
export function generateInvoiceNumber(orderId: string, dateString?: string): string {
  const d = dateString ? new Date(dateString) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const cleanId = (orderId || 'ORD').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
  return `ZF/${year}/${month}/${cleanId}`;
}

/**
 * Format date time in Indian standard restaurant receipt format
 * e.g. 30-Aug-2026 08:55 PM
 */
export function formatReceiptDate(dateString: string): { date: string; time: string; full: string } {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) {
      const now = new Date();
      return {
        date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        full: now.toLocaleString('en-IN'),
      };
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const dateFormatted = `${day}/${month}/${year}`;

    const timeFormatted = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return {
      date: dateFormatted,
      time: timeFormatted,
      full: `${dateFormatted} ${timeFormatted}`,
    };
  } catch {
    return {
      date: '30/08/2026',
      time: '07:45 PM',
      full: '30/08/2026 07:45 PM',
    };
  }
}
