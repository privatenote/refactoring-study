export function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
    .format;

  for (let perf of invoice.performances) {
    const play = playFor(perf);
    const thisAmount = amountFor(perf);

    volumeCredits += volumeCreditsFor(perf, play);

    // 청구 내역을 출력한다.
    result += `${play.name}: ${format(thisAmount / 100)} ${perf.audience}석\n`;
    totalAmount += thisAmount;
  }
  result += `총액 ${format(totalAmount / 100)}\n`;
  result += `적립 포인트 ${volumeCredits}점\n`;

  return result;

  function playFor(perf) {
    return plays[perf.playID];
  }

  function amountFor(perf) {
    const play = playFor(perf);
    let result = 0;

    switch (play.type) {
      case 'tragedy':
        result = 40_000;

        if (perf.audience > 30) {
          result += 1_000 * (perf.audience - 30);
        }
        break;
      case 'comedy':
        result = 30_000;

        if (perf.audience > 20) {
          result += 10_000 + 500 * (perf.audience - 20);
        }
        result += 300 * perf.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    return result;
  }

  function volumeCreditsFor(perf, play) {
    let result = 0;

    // 포인트를 적립한다.
    result += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' === play.type) {
      result += Math.floor(perf.audience / 5);
    }

    return result;
  }
}
