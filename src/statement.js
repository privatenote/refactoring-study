export function statement(invoice, plays) {
  const { totalAmount, volumeCredits, dataByPerformance } = calculateData(invoice, plays);

  return dataByPerformance + [
    `총액 ${format(totalAmount / 100)}`,
    `적립 포인트 ${volumeCredits}점`
  ].join('\n');
}

const calculateData = (invoice, plays) => {
  let totalAmount = 0;
  let volumeCredits = 0;
  let dataByPerformance = `청구내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case 'tragedy':
        thisAmount = getTragedyAmount(perf);
        volumeCredits += getTragedyPoints(perf);
        break;
      case 'comedy':
        thisAmount = getComedyAmount(perf);
        volumeCredits += getComedyPoints(perf);
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    dataByPerformance += `${play.name}: ${format(thisAmount / 100)} ${perf.audience}석\n`;
    totalAmount += thisAmount;
  }

  return { totalAmount, volumeCredits, dataByPerformance };
}

const getTragedyAmount = (perf) => {
  let thisAmount = 40_000;

  if (perf.audience > 30) {
    thisAmount += 1_000 * (perf.audience - 30);
  }
  return thisAmount;
};

const getComedyAmount = (perf) => {
  let thisAmount = 30_000;

  if (perf.audience > 20) {
    thisAmount += 10_000 + 500 * (perf.audience - 20);
  }
  thisAmount += 300 * perf.audience;
  return thisAmount;
};

const getTragedyPoints = (perf) => {
  let volumeCredits = Math.max(perf.audience - 30, 0);

  return volumeCredits;
};

const getComedyPoints = (perf) => {
  let volumeCredits = Math.max(perf.audience - 30, 0);

  volumeCredits += Math.floor(perf.audience / 5);

  return volumeCredits;
};
