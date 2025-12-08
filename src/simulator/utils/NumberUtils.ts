// @ts-nocheck

export class NumberUtils {
  public static prettyNumber(
    num: number,
    opts?: {
      short?: boolean;
      lowerCase?: boolean;
      addCommas?: boolean;
      round?: number;
    },
  ): string {
    let defaultOpts = {
      short: true,
      lowerCase: false,
      addCommas: true,
      round: 2,
    };

    if (typeof num != "number") {
      return "";
    }

    function round(num: number, dec: number) {
      num = num * Math.pow(10, dec);

      num = Math.round(num);

      num /= Math.pow(10, dec);

      return num;
    }

    if (typeof opts == "undefined") {
      opts = {};
    }

    for (const i in defaultOpts) {
      // @ts-ignore
      opts[i] = typeof opts[i] != "undefined" ? opts[i] : defaultOpts[i];
    }

    if (opts.short) {
      let decimal_places = Math.floor(Math.log(num) / Math.log(10));

      let dec = [
        {
          suffix: "T",
          divisor: 12,
        },
        {
          suffix: "B",
          divisor: 9,
        },
        {
          suffix: "M",
          divisor: 6,
        },
        {
          suffix: "K",
          divisor: 3,
        },
        {
          suffix: "",
          divisor: 0,
        },
      ];

      for (let i = 0; i < dec.length; i++) {
        if (decimal_places > dec[i].divisor) {
          num = round(
            num / Math.pow(10, dec[i].divisor),
            2 - (decimal_places - dec[i].divisor),
          );

          if (num >= 1000 && i > 0) {
            decimal_places -= 3;
            num = round(num / 1000, 2 - (decimal_places - dec[i - 1].divisor));
            num += dec[i - 1].suffix as any;
          } else {
            num += dec[i].suffix as any;
          }

          break;
        }
      }

      num = "" + num;

      if (opts.lowerCase) {
        num = num.toLowerCase();
      }
    } else if (opts.addCommas) {
      let decnum = ("" + (round(num, opts.round!) - Math.floor(num))).slice(2);

      let tempnum = "" + Math.floor(num);
      let num = "";
      for (let i = tempnum.length - 1, j = 0; i >= 0; i--, j++) {
        if (j > 0 && j % 3 == 0) {
          num = "," + num;
        }
        num = tempnum[i] + num;
      }

      if (Number(decnum) > 0) {
        num = num + "." + decnum;
      }
    }

    return num;
  }

  public static commify(num: number) {
    return this.prettyNumber(num, { short: false });
  }
}
