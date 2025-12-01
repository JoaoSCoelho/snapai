import { ModelType } from "../utils/modelsUtils";
import { Model } from "./Model";

export abstract class DistributionModel extends Model {
  public static readonly type = ModelType.Distribution;
}
