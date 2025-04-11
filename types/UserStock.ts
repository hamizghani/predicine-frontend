import { ForecastedUserStock } from "./ForecastedUserStock";
import { Medicine } from "./Medicine";
import { StockBatch } from "./StockBatch";

export interface UserStock {
    id: number;
    medicineId: number;
    medicine: Medicine;
    batches: StockBatch[];
    forecastedUserStock: ForecastedUserStock;
}