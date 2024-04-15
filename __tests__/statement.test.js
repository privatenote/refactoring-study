import { describe, it, expect } from 'vitest';
import { statement } from '../src/statement';

describe('statement 함수 테스트', () => {
  it('Best Case', () => {
    const invoice = [
      {
        customer: 'BigCo',
        performances: [
          { playID: 'hamlet', audience: 55 },
          { playID: 'as-like', audience: 35 },
          { playID: 'othello', audience: 40 },
        ],
      },
    ];
    const plays = {
      hamlet: { name: 'Hamlet', type: 'tragedy' },
      'as-like': { name: 'As YOu Like it', type: 'comedy' },
      othello: { name: 'Othello', type: 'tragedy' },
    };

    const result = statement(invoice[0], plays);

    expect(result).toEqual(
      [
        '청구내역 (고객명: BigCo)',
        'Hamlet: $650.00 55석',
        'As YOu Like it: $580.00 35석',
        'Othello: $500.00 40석',
        '총액 $1,730.00',
        '적립 포인트 47점',
        '',
      ].join('\n')
    );
  });
});
