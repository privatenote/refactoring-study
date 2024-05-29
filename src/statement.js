export function statement(invoice, plays) {
  let totalAmount = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    const thisAmount = amountFor(perf);

    // 청구 내역을 출력한다.
    result += `${playFor(perf).name}: ${usd(thisAmount / 100)} ${perf.audience}석\n`;
    totalAmount += thisAmount;
  }

  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
  }

  result += `총액 ${usd(totalAmount / 100)}\n`;
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

  function volumeCreditsFor(perf) {
    const play = playFor(perf);
    let result = 0;

    // 포인트를 적립한다.
    result += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' === play.type) {
      result += Math.floor(perf.audience / 5);
    }

    return result;
  }

  function usd(amount) {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      .format;
    return formatter(amount);
  }
}
