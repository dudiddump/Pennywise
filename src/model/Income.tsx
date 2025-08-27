import mongoose, { Schema, Document } from "mongoose";

export interface IIncome extends Document {
  userId: string;
  monthlySalary: number;
  currentSavings: number;
  savingsGoal: number;
}

const IncomeSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  monthlySalary: { type: Number, required: true },
  currentSavings: { type: Number, required: true },
  savingsGoal: { type: Number, required: true },
});

export default mongoose.models.Income ||
  mongoose.model<IIncome>("Income", IncomeSchema);
