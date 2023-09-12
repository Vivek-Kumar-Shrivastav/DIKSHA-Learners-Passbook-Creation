import { CategoryPerformanceCard } from "./CategoryPerformanceCard";
import { SubjectPerformanceCard } from "./SubjectPerformanceCard";

export interface PerformanceCard {
    subjectsPerformanceCard: SubjectPerformanceCard[];
    categoryPerformanceCard: CategoryPerformanceCard;
  }