import numeral from "numeral";

let dias = [{
  "fecha": "2019-10-01",
  "dia": "Martes",
  "cobranzas": 2871082.1,
  "ventas": 10330737.16
}, {
  "fecha": "2019-10-02",
  "dia": "Miércoles",
  "cobranzas": 1759326.53,
  "ventas": 3542391.05
}, {
  "fecha": "2019-10-03",
  "dia": "Jueves",
  "cobranzas": 6443957.95,
  "ventas": 2573820.92
}, {
  "fecha": "2019-10-04",
  "dia": "Viernes",
  "cobranzas": 1956025.17,
  "ventas": 0
}, {
  "fecha": "2019-10-05",
  "dia": "Sábado",
  "cobranzas": 114101.77,
  "ventas": 0
}, {
  "fecha": "2019-10-06",
  "dia": "Domingo",
  "cobranzas": 26013.64,
  "ventas": 0
}, {
  "fecha": "2019-10-07",
  "dia": "Lunes",
  "cobranzas": 726279.22,
  "ventas": 0
}, {
  "fecha": "2019-10-08",
  "dia": "Martes",
  "cobranzas": 465437.59,
  "ventas": 0
}, {
  "fecha": "2019-10-09",
  "dia": "Miércoles",
  "cobranzas": 124856.17,
  "ventas": 0
}, {
  "fecha": "2019-10-10",
  "dia": "Jueves",
  "cobranzas": 1662690.58,
  "ventas": 0
}, {
  "fecha": "2019-10-11",
  "dia": "Viernes",
  "cobranzas": 967527.32,
  "ventas": 0
}, {
  "fecha": "2019-10-12",
  "dia": "Sábado",
  "cobranzas": 459669.36,
  "ventas": 0
}, {
  "fecha": "2019-10-13",
  "dia": "Domingo",
  "cobranzas": 38775.9,
  "ventas": 0
}, {
  "fecha": "2019-10-14",
  "dia": "Lunes",
  "cobranzas": 383713.05,
  "ventas": 0
}, {
  "fecha": "2019-10-15",
  "dia": "Martes",
  "cobranzas": 946989.03,
  "ventas": 0
}, {
  "fecha": "2019-10-16",
  "dia": "Miércoles",
  "cobranzas": 329779.16,
  "ventas": 0
}, {
  "fecha": "2019-10-17",
  "dia": "Jueves",
  "cobranzas": 1598624.3,
  "ventas": 0
}, {
  "fecha": "2019-10-18",
  "dia": "Viernes",
  "cobranzas": 481564.46,
  "ventas": 0
}, {
  "fecha": "2019-10-19",
  "dia": "Sábado",
  "cobranzas": 254692.9,
  "ventas": 0
}, {
  "fecha": "2019-10-20",
  "dia": "Domingo",
  "cobranzas": 257382.44,
  "ventas": 0
}, {
  "fecha": "2019-10-21",
  "dia": "Lunes",
  "cobranzas": 1717369.04,
  "ventas": 0
}, {
  "fecha": "2019-10-22",
  "dia": "Martes",
  "cobranzas": 107576.43,
  "ventas": 0
}, {
  "fecha": "2019-10-23",
  "dia": "Miércoles",
  "cobranzas": 101186.95,
  "ventas": 0
}, {
  "fecha": "2019-10-24",
  "dia": "Jueves",
  "cobranzas": 213885.32,
  "ventas": 0
}, {
  "fecha": "2019-10-25",
  "dia": "Viernes",
  "cobranzas": 2521986.42,
  "ventas": 0
}, {
  "fecha": "2019-10-26",
  "dia": "Sábado",
  "cobranzas": 77622.63,
  "ventas": 0
}, {
  "fecha": "2019-10-27",
  "dia": "Domingo",
  "cobranzas": 76153.77,
  "ventas": 0
}, {
  "fecha": "2019-10-28",
  "dia": "Lunes",
  "cobranzas": 46485.61,
  "ventas": 0
}, {
  "fecha": "2019-10-29",
  "dia": "Martes",
  "cobranzas": 606051.81,
  "ventas": 0
}, {
  "fecha": "2019-10-30",
  "dia": "Miércoles",
  "cobranzas": 578394.52,
  "ventas": 0
}, {
  "fecha": "2019-10-31",
  "dia": "Jueves",
  "cobranzas": 5104198.66,
  "ventas": 0
}];

function formatearPeso(valor) {
  return numeral(valor).format("0,0.00");
}

let sumaVentas = 0
let iterVentas = 0

for (const dia of dias) {
  sumaVentas += dia.ventas;
  if (dia.ventas > 0) iterVentas++;
}

console.log("Iteraciones: " + iterVentas); // []
console.log("Promedio Ventas: " + sumaVentas / iterVentas); // []


let sumaCobra = 0
let iterCobra = 0
for (const dia of dias) {
  sumaCobra += dia.cobranzas;
  if (dia.cobranzas > 0) iterCobra++;
}
console.log("Iteraciones: " + iterCobra); // []
console.log("Promedio Cobranzas: " + formatearPeso(sumaCobra / iterCobra)); // []
console.log("2019-10-31" == "2019-10-31"); // []



var filterNumArray = dias.filter(function (dias) {
  return dias.fecha == "2019-10-02"
})
console.log(filterNumArray);

newDaysArray = dias.filter((fecha, index) => index > 2)
console.log("newDaysArray => ", newProductsArray)
