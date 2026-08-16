/**
 * 注文金額の計算（フロント / 純粋計算関数のサンプル）
 *
 * 入力 → 出力が一意に決まる純粋関数。外部状態・副作用を持たない。
 * デグレチェックの検証対象として最適：ある分岐を変えたとき、
 * 触っていない金額帯・会員ランクの結果が不変であることを机上で確認できる。
 */

export type Member = 'none' | 'silver' | 'gold';

export interface Order {
  /** 税抜の商品合計 */
  subtotal: number;
  member: Member;
  couponCode?: string;
}

/** 会員ランク別の割引率 */
const MEMBER_DISCOUNT: Record<Member, number> = {
  none: 0,
  silver: 0.05,
  gold: 0.1,
};

/** クーポンコード別の定額割引（円） */
const COUPON: Record<string, number> = {
  WELCOME500: 500,
  THANKS1000: 1000,
};

/** 送料無料になる金額の閾値（円） */
const FREE_SHIPPING_THRESHOLD = 5000;
/** 送料（円） */
const SHIPPING_FEE = 660;
/** 消費税率 */
const TAX_RATE = 0.1;

/**
 * 支払総額を計算する（税込・割引適用後）。
 *
 * 割引の適用順序:
 *   1. 会員割引（率）
 *   2. クーポン（定額・下限0）
 *   3. 送料（閾値未満なら加算）
 *   4. 消費税
 */
export function calcTotal(order: Order): number {
  const { subtotal, member, couponCode } = order;

  // 1. 会員割引
  let price = subtotal * (1 - MEMBER_DISCOUNT[member]);

  // 2. クーポン（定額割引・下限0）
  if (couponCode && COUPON[couponCode] != null) {
    price = Math.max(0, price - COUPON[couponCode]);
  }

  // 3. 送料（閾値未満は加算、以上は無料）
  const shipping = price >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  price += shipping;

  // 4. 消費税
  price = Math.round(price * (1 + TAX_RATE));

  return price;
}
