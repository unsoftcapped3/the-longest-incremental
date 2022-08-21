const tenthousandth = new Decimal(0.0001),
  thousandth = new Decimal(0.001),
  tenth = new Decimal(0.1),
  nearOne = new Decimal(0.99),
  e3 = new Decimal(1e3),
  e4 = new Decimal(1e4),
  e6 = new Decimal(1e6),
  e9 = new Decimal(1e9),
  e36 = new Decimal(1e36),
  ee3 = new Decimal("ee3"),
  ee4 = new Decimal("ee4"),
  ee6 = new Decimal("ee6"),
  eeee1000 = new Decimal("eeee1000"),
  standardPrefixes = [
    "",
    "",
    "M", 
    "B", 
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "N",
    "De"
  ];

function exponentialFormat(num, precision, mantissa = true) {
  let e = num.log10().floor();
  let m = num.div(Decimal.pow(10, e));
  if (
    m.toStringWithDecimalPlaces(precision) ===
    "10" + (precision > 0 ? "." + "0".repeat(precision) : "")
  ) {
    m = Decimal.dOne;
    e = e.add(Decimal.dOne);
  }
  e = e.gte(e9)
    ? format(e, 3)
    : e.gte(e4)
    ? commaFormat(e, 0)
    : e.toStringWithDecimalPlaces(0);
  if (mantissa) return `${m.toStringWithDecimalPlaces(precision)}e${e}`;
  return `e${e}`;
}

function commaFormat(num, precision) {
  if (num.lt(thousandth)) return (0).toFixed(precision);
  const portions = num.toStringWithDecimalPlaces(precision).split(".");
  portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  if (portions.length === 1) return portions[0];
  return `${portions[0]}."${portions[1]}`;
}

function regularFormat(num, precision) {
  if (num.lt(tenthousandth)) return (0).toFixed(precision);
  if (num.lt(tenth) && precision !== 0) precision = Math.max(precision, 4);
  return num.toStringWithDecimalPlaces(precision);
}

function format(decimal, precision = 2) {
  decimal = new Decimal(decimal);
  if (Decimal.isNaN(decimal)) return "[ERROR]: NaN";
  if (decimal.lt(Decimal.dZero)) return `-${format(decimal.neg(), precision)}`;
  if (!decimal.isFinite()) return "Infinity";
  if (decimal.gte(eeee1000)) {
    const slog = decimal.slog();
    if (slog.gte(e6)) return `F${format(slog.floor())}`;
    return `${Decimal.dTen
      .pow(slog.sub(slog.floor()))
      .toStringWithDecimalPlaces(3)}F${commaFormat(slog.floor(), 0)}`;
  }
  if (decimal.gte(ee6)) return exponentialFormat(decimal, 0, false);
  if (decimal.gte(ee4)) return exponentialFormat(decimal, 0);
  if (decimal.gte(e6)) {
    if (decimal.gte(e36) || player.notation === "sci") {
      return exponentialFormat(decimal, Math.max(precision, 2))
    };
    const decimalE = decimal.log10().floor().toNumber();
    const exp3 = Math.floor(decimalE / 3);
    return (
      `${decimal.div(Math.pow(10, exp3 * 3)).toFixed(Math.max(2 - decimalE + exp3 * 3, 0))} ${standardPrefixes[exp3]}`
    );
  }
  if (decimal.gte(e3)) return commaFormat(decimal, 0);
  if (decimal.gte(tenthousandth)) return regularFormat(decimal, precision);
  if (decimal.eq(Decimal.dZero)) return (0).toFixed(precision);
  decimal = invertOOM(decimal);
  if (decimal.lt(ee3)) return exponentialFormat(decimal, Math.max(precision, 2)).replace(
    /([^(?:e|F)]*)$/,
    "-$1"
  );
  return `${format(decimal, precision)}⁻¹`;
}

function formatWhole(decimal) {
  decimal = new Decimal(decimal);
  if (decimal.gte(e6)) return format(decimal, 3);
  if (decimal.lte(nearOne) && !decimal.eq(Decimal.dZero))
    return format(decimal, 2);
  return format(decimal, 0);
}

function formatTime(s, type) {
  s = D(s)
  if (s.gte(86400*365*10)) return format(s.div(86400*365))+"y"
  if (s.gte(86400*365)) return format(s.div(86400*365).floor(),0)+"y, "+formatTime(s.mod(86400*365))
  if (s.gte(86400*7)) return format(s.div(86400*7).floor(),0)+"w, "+formatTime(s.mod(86400*7),'w')
  if (s.gte(86400)||type=="w") return format(s.div(86400).floor(),0)+"d, "+formatTime(s.mod(86400),'d')
  if (s.gte(3600)||type=="d") return (s.div(3600).gte(10)||type!="d"?"":"0")+format(s.div(3600).floor(),0)+":"+formatTime(s.mod(3600),'h')
  if (s.gte(60)||type=="h") return (s.div(60).gte(10)||type!="h"?"":"0")+format(s.div(60).floor(),0)+":"+formatTime(s.mod(60),'m')
  return (s.gte(10)||type!="m"?"":"0")+format(s,2)+(type!="m"?"s":"")
  //credit to MrRedShark77
}

// Will also display very small numbers
function formatSmall(num, precision = 2) {
  return format(num, precision, true);
}

function invertOOM(x) {
  const e = x.log10().ceil();
  return Decimal.dTen.pow(e.neg()).times(x.div(Decimal.dTen.pow(e)));
}
