const tenthousandth = new Decimal(0.0001),
      thousandth = new Decimal(0.001),
      tenth = new Decimal(0.1),
      nearOne = new Decimal(0.99),
      e3 = new Decimal(1e3),
      e4 = new Decimal(1e4),
      e6 = new Decimal(1e6),
      e9 = new Decimal(1e9),
      ee3 = new Decimal("ee3"),
      ee4 = new Decimal("ee4"),
      ee6 = new Decimal("ee6"),
      eeee1000 = new Decimal("eeee1000");

function exponentialFormat(num, precision, mantissa = true) {
  let e = num.log10().floor()
  let m = num.div(Decimal.pow(10, e))
  if (m.toStringWithDecimalPlaces(precision) === "10" + (precision>0?"."+"0".repeat(precision):"")) {
    m = Decimal.dOne;
    e = e.add(Decimal.dOne);
  }
  e = (e.gte(e9) ? format(e, 3) : (e.gte(e4) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)));
  if (mantissa) return `${m.toStringWithDecimalPlaces(precision)}e${e}`;
  return `e${e}`;
}

function commaFormat(num, precision) {
  if (num.lt(thousandth)) return (0).toFixed(precision);
  const portions = num.toStringWithDecimalPlaces(precision).split(".");
  portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
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
  if (Decimal.isNaN(decimal)) return  "[ERROR]: NaN";
  if (decimal.lt(Decimal.dZero)) return `-${format(decimal.neg(), precision)}`;
  if (!decimal.isFinite()) return "Infinity"
  if (decimal.gte(eeee1000)) {
    const slog = decimal.slog();
    if (slog.gte(e6)) return `F${format(slog.floor())}`;
    return `${Decimal.pow(Decimal.dTen, slog.sub(slog.floor())).toStringWithDecimalPlaces(3)}F${commaFormat(slog.floor(), 0)}`;
  } 
  if (decimal.gte(ee6)) return exponentialFormat(decimal, 0, false);
  if (decimal.gte(ee4)) return exponentialFormat(decimal, 0);
  if (decimal.gte(e6)) return exponentialFormat(decimal, precision);
  if (decimal.gte(e3)) return commaFormat(decimal, 0);
  if (decimal.gte(tenthousandth)) return regularFormat(decimal, precision);
  if (decimal.eq(Decimal.dZero)) return (0).toFixed(precision);
  decimal = invertOOM(decimal)
  if (decimal.lt(ee3)) {
    return exponentialFormat(decimal, precision).replace(/([^(?:e|F)]*)$/, "-$1");
  }
  return `${format(decimal, precision)}⁻¹`;
}

function formatWhole(decimal) {
  decimal = new Decimal(decimal);
  if (decimal.gte(e6)) return format(decimal, 3);
  if (decimal.lte(nearOne) && !decimal.eq(Decimal.dZero)) return format(decimal, 2);
  return format(decimal, 0);
}

function formatTime(s) {
  if (s < 60) return `${format(s)}s`;
  else if (s < 3600) return `${formatWhole(Math.floor(s / 60))}m ${format(s % 60)}s`;
  else if (s < 86400) return `${formatWhole(Math.floor(s / 3600))}h ${formatWhole(Math.floor(s / 60) % 60)}m ${format(s % 60)}s`;
  else if (s < 31536000) return `${formatWhole(Math.floor(s / 86400) % 365)}d ${formatWhole(Math.floor(s / 3600) % 24)}h ${formatWhole(Math.floor(s / 60) % 60)}m ${format(s % 60)}s`;
  else return `${formatWhole(Math.floor(s / 31536000))}y ${formatWhole(Math.floor(s / 86400) % 365)}d ${formatWhole(Math.floor(s / 3600) % 24)}h ${formatWhole(Math.floor(s / 60) % 60)}m ${format(s % 60)}s`;
}

// Will also display very small numbers
function formatSmall(num, precision = 2) {
  return format(num, precision, true);
}

function invertOOM(x){
  const e = x.log10().ceil();
  return Decimal.dTen.pow(e.neg()).times(x.div(Decimal.dTen.pow(e)));
}