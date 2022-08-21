var NumToString = [null,"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
//just an idea now, currently isnt been loaded
function getString(x) {
    let s = ""
    x = Decimal.floor(x)
    if (x.lte(0)) return ""
    while (x.gt(0)){
        s = NumToString[x.sub(x.div(26).floor().mul(26)).toNumber()] + s
        x = x.div(26).floor()
    }
    return s
    //return format(decimal,0)
}

//when it formed "incrementalgame", it will return true and unlock a new layer
// what????
function gteIncrementalGame(x){
  return x.gte(6.17e20)
}

//let's move that function to utils.js.