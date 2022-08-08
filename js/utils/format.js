const tenthousandth = new Decimal(0.0001)
const thousandth = new Decimal(0.001);
const tenth = new Decimal(0.1);
const e4 = new Decimal(1e4);
const e6 = new Decimal(1e6);
const e9 = new Decimal(1e9);
const eeee1000 = new Decimal("eeee1000");

function exponentialFormat(num, precision, mantissa = true) {
  let e = num.log10().floor()
  let m = num.div(Decimal.pow(10, e))
  if (m.toStringWithDecimalPlaces(precision) === "10") {
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

//PLEASE STOP MESSING WITH FORMAT IT IS BREAKING EVERYTHING
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
  if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
        else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
        else if (decimal.gte(1e6)) return exponentialFormat(decimal, precision)
        else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
        else if (decimal.gte(0.0001)) return regularFormat(decimal, precision)
        else if (decimal.eq(0)) return (0).toFixed(precision)

        decimal = invertOOM(decimal)
        let val = ""
        if (decimal.lt("1e1000")) {
            val = exponentialFormat(decimal, precision)
            return val.replace(/([^(?:e|F)]*)$/, '-$1')
        } else
            return format(decimal, precision) + "⁻¹"
}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e6)) return format(decimal, 3)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) {
    return format(x, precision, true)
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}