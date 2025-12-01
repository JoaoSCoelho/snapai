import { ModelType } from "../utils/modelsUtils";
import { Model } from "./Model";

export abstract class MobilityModel extends Model {
  public static readonly type = ModelType.Mobility;
}
