import { Disease } from "./Disease";
import { Medicine } from "./medicine";

export interface DiseaseMedicineCorrelation {
  id: number;
  diseaseId: number;
  medicineId: number;
  disease: Disease;
  medicine: Medicine;
  correlationPercentage: number;
}
