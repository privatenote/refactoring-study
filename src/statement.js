class Play {
  constructor(name) {
    this.name = name;
  }

  calcAmount(perf) {
    throw new Error('not implemented');
  }

  calcVolumeCredit(perf) {
    return Math.max(perf.audience - 30, 0);
  }
}

class TragedyPlay extends Play {
  constructor(name) {
    super(name);
  }

  calcAmount(perf) {
    let amount = 40_000;
    if (perf.audience > 30) {
      amount += 1_000 * (perf.audience - 30);
    }
    return amount;
  }
}

class ComedyPlay extends Play {
  constructor(name) {
    super(name);
  }

  calcAmount(perf) {
    let amount = 30_000;
    if (perf.audience > 20) {
      amount += 10_000 + 500 * (perf.audience - 20);
    }
    amount += 300 * perf.audience;
    return amount;
  }

  calcVolumeCredit(perf) {
    return super.calcVolumeCredit(perf) + Math.floor(perf.audience / 5);
  }
}

function createPlayObject(play) {
  if ('tragedy' === play.type) {
    return new TragedyPlay(play.name);
  } else if ('comedy' === play.type) {
    return new ComedyPlay(play.name);
  } else {
    throw new Error(`알 수 없는 장르: ${play.type}`);
  }
}

export function statement(invoice, plays) {
  const amounts = invoice.performances.map((perf) => {
    const play = createPlayObject(plays[perf.playID]);
  });
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;
  const formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    const playObject = createPlayObject(play);
    const thisAmount = playObject.calcAmount(perf);

    // 포인트를 적립한다.
    volumeCredits += playObject.calcVolumeCredit(perf);

    // 청구 내역을 출력한다.
    result += `${play.name}: ${formatCurrency(thisAmount / 100)} ${perf.audience}석\n`;
    totalAmount += thisAmount;
  }
  result += `총액 ${formatCurrency(totalAmount / 100)}\n`;
  result += `적립 포인트 ${volumeCredits}점\n`;

  return result;
}
