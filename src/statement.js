export function statement(invoice, plays) {
  const { totalAmount, volumeCredits, dataByPerformance } = calculateData(invoice, plays);

  return [
    ...dataByPerformance,
    `총액 ${format(totalAmount / 100)}`,
    `적립 포인트 ${volumeCredits}점`
  ].join('\n');
}

const format = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format;

const calculateData = (invoice, plays) => invoice.performances.map((perf) => {
  const play = plays[perf.playID];
  let thisAmount = 0;
  let thisVolumeCredits = 0;

  switch (play.type) {
    case 'tragedy':
      thisAmount = getTragedyAmount(perf);
      thisVolumeCredits = getTragedyPoints(perf);
      break;
    case 'comedy':
      thisAmount = getComedyAmount(perf);
      thisVolumeCredits = getComedyPoints(perf);
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }

  return [
    `${play.name}: ${format(thisAmount / 100)} ${perf.audience}석`,
    thisAmount,
    thisVolumeCredits,
  ];
}).reduce((acc, [data, amount, volumeCredits]) => (
  {
    dataByPerformance: [...acc.dataByPerformance, data],
    totalAmount: acc.totalAmount + amount,
    volumeCredits: acc.volumeCredits + volumeCredits,
  }
), {
  dataByPerformance: [`청구내역 (고객명: ${invoice.customer})`],
  totalAmount: 0,
  volumeCredits: 0,
});

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
