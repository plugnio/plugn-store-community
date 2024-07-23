export class Voucher {
  voucher_id: number;
  restaurant_uuid: string;
  code: string;
  description: string;
  description_ar: string;
  discount_type: string;
  discount_amount: number;
  voucher_status: number;
  valid_from: string;
  valid_until: string;
  max_redemption: number;
  limit_per_customer: number;
  minimum_order_amount: number;
  voucher_created_at: string;
  voucher_updated_at: string;
}
