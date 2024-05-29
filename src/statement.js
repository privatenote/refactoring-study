export function statement(invoice, plays) {
  const statementData = {}
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumeCredits = totalVolumeCredits(statementData);
  return renderPlainText(statementData, plays)

  function enrichPerformance(perf) {
    const result = Object.assign({}, perf);
    result.play = playFor(perf);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }

  function playFor(perf) {
    return plays[perf.playID];
  }

  function amountFor(perf) {
    let result = 0;

    switch (perf.play.type) {
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
        throw new Error(`알 수 없는 장르: ${perf.play.type}`);
    }

    return result;
  }

  function volumeCreditsFor(perf) {
    let result = 0;

    // 포인트를 적립한다.
    result += Math.max(perf.audience - 30, 0);

    // 희극 관객 5명마다 추가 포인트를 제공한다.
    if ('comedy' === perf.play.type) {
      result += Math.floor(perf.audience / 5);
    }

    return result;
  }

  function totalAmount(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }

    return result;
  }

  function totalVolumeCredits(data) {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumeCredits;
    }

    return result;
  }
}

function renderPlainText(data) {
  let result = `청구내역 (고객명: ${data.customer})\n`;

  for (let perf of data.performances) {
    // 청구 내역을 출력한다.
    result += `${perf.play.name}: ${usd(perf.amount / 100)} ${perf.audience}석\n`;
  }

  result += `총액 ${usd(totalAmount() / 100)}\n`;
  result += `적립 포인트 ${totalVolumeCredits()}점\n`;

  return result;

  function usd(amount) {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
      .format;
    return formatter(amount);
  }

  function totalVolumeCredits() {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.volumeCredits;
    }

    return result;
  }

  function totalAmount() {
    let result = 0;
    for (let perf of data.performances) {
      result += perf.amount;
    }

    return result;
  }
}
