export function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
    .format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    const thisAmount = getAmount(play.type, perf);

    volumeCredits += getCredit(play.type, perf);

    // 청구 내역을 출력한다.
    result += `${play.name}: ${format(thisAmount / 100)} ${perf.audience}석\n`;
    totalAmount += thisAmount;
  }
  result += `총액 ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 ${volumeCredits}점\n`;

  return result;
}

const getAmount = (playType, performance) => {
  let amount;

  switch (playType) {
    case 'tragedy':
      amount = 40_000;

      if (performance.audience > 30) {
        amount += 1_000 * (performance.audience - 30);
      }
      break;
    case 'comedy':
      amount = 30_000;

      if (performance.audience > 20) {
        amount += 10_000 + 500 * (performance.audience - 20);
      }
      amount += 300 * performance.audience;
      break;

    default:
      throw new Error(`알 수 없는 장르: ${playType}`);
  }

  return amount;
};

const getCredit = (playType, performance) => {
  let credit = 0;

  // 포인트를 적립한다.
  credit += Math.max(performance.audience - 30, 0);

  // 희극 관객 5명마다 추가 포인트를 제공한다.
  if ('comedy' === playType) {
    credit += Math.floor(performance.audience / 5);
  }

  return credit;
};
