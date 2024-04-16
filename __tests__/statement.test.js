import { describe, it, expect } from 'vitest';
import { statement } from '../src/statement';

describe('statement 함수 테스트', () => {
  describe('장르가 비극일 때', () => {
    it('관객이 30명 미만이면 400달러', () => {
      const invoice = [{
        customer: 'PrivateNote',
        performances: [
          { playID: 'math', audience: 30 }
        ]
      }]
      const plays = {
        math: { name: '수학 1', type: 'tragedy' }
      }
      const result = statement(invoice[0], plays);

      expect(result).toMatch(
        [
          '수학 1: $400.00 30석',
          '총액 $400.00',
        ].join('\n')
      );
    })

    it('관객이 30명 이상이면 추가 인원당 10달러씩 추가', () => {
      const invoice = [{
        customer: 'PrivateNote',
        performances: [
          { playID: 'math', audience: 40 }
        ]
      }]
      const plays = {
        math: { name: '수학 1', type: 'tragedy' }
      }
      const result = statement(invoice[0], plays);

      expect(result).toMatch(
        [
          '수학 1: $500.00 40석',
          '총액 $500.00',
        ].join('\n')
      );
    })

    it('관객이 30명 이상이면 초과 인원당 1포인트씩 적립', () => {
      const invoice = [{
        customer: 'PrivateNote',
        performances: [
          { playID: 'math', audience: 40 }
        ]
      }]
      const plays = {
        math: { name: '수학 1', type: 'tragedy' }
      }
      const result = statement(invoice[0], plays);

      expect(result).toMatch(
        '적립 포인트 10점',
      );
    })
  })

  describe('장르가 희극일 때', () => {
    it('관객이 20명 미만이면 기본 300달러에 인당 3달러씩 추가', () => {
      const invoice = [{
        customer: 'PrivateNote',
        performances: [
          { playID: 'physics', audience: 20 }
        ]
      }]
      const plays = {
        physics: { name: '물리학', type: 'comedy' }
      }
      const result = statement(invoice[0], plays);

      expect(result).toMatch(
        [
          '물리학: $360.00 20석',
          '총액 $360.00',
        ].join('\n')
      );
    })

    it('관객이 20명 이상이면 기본 300달러에 추가로 100달러, 전체 인원당 3달러씩 추가하고 20달러 넘는 인원들은 5달러 추가', () => {
      const invoice = [{
        customer: 'PrivateNote',
        performances: [
          { playID: 'physics', audience: 30 }
        ]
      }]
      const plays = {
        physics: { name: '물리학', type: 'comedy' }
      }
      const result = statement(invoice[0], plays);

      expect(result).toMatch(
        [
          '물리학: $540.00 30석',
          '총액 $540.00',
        ].join('\n')
      );
    })

    it('관객이 30명 이상이면 초과 인원당 1포인트씩 적립하고 총 관객 5명마다 1포인트 추가 적립', () => {
      const invoice = [{
        customer: 'PrivateNote',
        performances: [
          { playID: 'physics', audience: 40 }
        ]
      }]
      const plays = {
        physics: { name: '물리학', type: 'comedy' }
      }
      const result = statement(invoice[0], plays);

      expect(result).toMatch(
        '적립 포인트 18점',
      );
    })
  })

  it('통합 테스트', () => {
    const invoice = [
      {
        customer: 'PrivateNote',
        performances: [
          { playID: 'hamlet', audience: 55 },
          { playID: 'as-like', audience: 35 },
          { playID: 'othello', audience: 40 },
        ],
        performances: [
          { playID: 'math', audience: 55 },
          { playID: 'physics', audience: 35 },
          { playID: 'kmo', audience: 40 },
        ]
      },
    ];
    const plays = {
      math: { name: '수학 1', type: 'tragedy' },
      physics: { name: '물리학', type: 'comedy' },
      kmo: { name: 'KMO', type: 'tragedy' },
    };

    const result = statement(invoice[0], plays);

    expect(result).toMatch(
      [
        '청구내역 (고객명: PrivateNote)',
        '수학 1: $650.00 55석',
        '물리학: $580.00 35석',
        'KMO: $500.00 40석',
        '총액 $1,730.00',
        '적립 포인트 47점',
      ].join('\n')
    );
  });

});
