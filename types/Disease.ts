import { DiseaseMedicineCorrelation } from "./DiseaseMedicineCorrelation";
import { DiseaseRecord } from "./DiseaseRecord";


export interface Disease {
  id: number;
  name: string;
  diseaseMedicineCorrelation: DiseaseMedicineCorrelation[];
  diseaseRecords: DiseaseRecord[];
}
