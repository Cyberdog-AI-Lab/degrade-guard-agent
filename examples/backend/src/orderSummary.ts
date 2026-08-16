/**
 * ユーザーの注文サマリ集計（バック / 状態依存関数のサンプル）
 *
 * 戻り値は「リポジトリ（DB）にどんな注文レコードが入っているか」という
 * 前提状態に依存する。純粋関数と違い、机上トレース表では
 * 「前提状態（DB）」の列を立てて、状態パターンごとに不変を確認する。
 */

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';

export interface OrderRecord {
  id: string;
  status: OrderStatus;
  /** 税込金額（円） */
  amount: number;
}

export interface OrderRepository {
  /** 該当ユーザーの注文一覧を返す。存在しなければ空配列。 */
  findByUser(userId: string): Promise<OrderRecord[]>;
}

export interface OrderSummary {
  /** 支払済み（paid / shipped）の合計金額 */
  totalPaid: number;
  /** キャンセル以外の件数 */
  activeCount: number;
  /** 未払い（pending）が1件でもあるか */
  hasPending: boolean;
}

/**
 * ユーザーの注文サマリを集計する。
 *
 * 前提状態のパターン（＝入力空間の一部）:
 *   - 注文0件（新規ユーザー）
 *   - paid / shipped を含む
 *   - pending を含む
 *   - cancelled のみ
 */
export async function getOrderSummary(
  userId: string,
  repo: OrderRepository,
): Promise<OrderSummary> {
  const orders = await repo.findByUser(userId);

  // 支払済み合計（paid と shipped を売上として計上）
  const totalPaid = orders
    .filter((o) => o.status === 'paid' || o.status === 'shipped')
    .reduce((sum, o) => sum + o.amount, 0);

  // アクティブ件数（cancelled を除く）
  const activeCount = orders.filter((o) => o.status !== 'cancelled').length;

  // 未払いの有無
  const hasPending = orders.some((o) => o.status === 'pending');

  return { totalPaid, activeCount, hasPending };
}
