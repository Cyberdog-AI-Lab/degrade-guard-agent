/**
 * 注文サマリ表示（フロント / 呼び出し元の波及サンプル）
 *
 * calcTotal() の戻り値をそのまま表示する呼び出し元。
 * pricing.ts を変更したとき、シグネチャ（number を返す）が同じでも
 * 「同じ入力に対する表示金額が変わっていないか」＝振る舞いの波及を
 * 机上で確認する対象（呼び出し元1ホップ）。
 */

import { calcTotal, type Order } from './pricing';

interface Props {
  order: Order;
}

export function OrderSummary({ order }: Props) {
  const total = calcTotal(order);

  return (
    <div className="order-summary">
      <span className="label">お支払い金額</span>
      <span className="amount">{total.toLocaleString('ja-JP')} 円（税込）</span>
    </div>
  );
}
