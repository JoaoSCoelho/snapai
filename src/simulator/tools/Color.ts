export class Color {
  private constructor(
    public readonly r: number = 0,
    public readonly g: number = 0,
    public readonly b: number = 0,
  ) {}

  /**
   * Creates a Color object from three separate red, green, and blue values.
   * @param {number} r The red value of the color, in the range [0, 255].
   * @param {number} g The green value of the color, in the range [0, 255].
   * @param {number} b The blue value of the color, in the range [0, 255].
   * @returns A Color object representing the color.
   * @example
   * const color = Color.fromRGB(255, 0, 0);
   * console.log(color.r); // 255
   */
  public static fromRGB(r: number, g: number, b: number): Color {
    return new Color(r, g, b);
  }

  /**
   * Creates a Color object from a hexadecimal string in the format #RRGGBB.
   * @param {string} hex The hexadecimal string to convert.
   * @returns A Color object representing the color.
   * @example
   * const color = Color.fromHex("#FF0000");
   * console.log(color.r); // 255
   */
  public static fromHex(hex: `#${string}`): Color {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return new Color(r, g, b);
  }

  /**
   * Converts the color to a hexadecimal string in the format #RRGGBB.
   * @returns A string representing the color in hexadecimal format.
   */
  public toHex(): `#${string}` {
    const r = this.r.toString(16).padStart(2, "0");
    const g = this.g.toString(16).padStart(2, "0");
    const b = this.b.toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  /**
   * Returns the color as an RGB array.
   * @returns An array of three numbers in the range [0, 255] representing the red, green, and blue components of the color.
   */
  public toRgb(): [number, number, number] {
    return [this.r, this.g, this.b];
  }
}
