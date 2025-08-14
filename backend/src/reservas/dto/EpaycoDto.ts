import { IsString } from "class-validator";

export class EpaycoDto {
  @IsString()
  extra1: string;

  @IsString()
  extra2: string;

  @IsString()
  extra3: string;

  @IsString()
  x_response: string;

  @IsString()
  x_payment_method: string;

  @IsString()
  x_amount: string;

  @IsString()
  x_ref_payco: string;

  @IsString()
  x_id_invoice: string;
}
