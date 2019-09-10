Date.prototype.addDays = function (days) {
  var dat = new Date(this.valueOf())
  dat.setDate(dat.getDate() + days);
  return dat;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(currentDate)
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

function getDatesMom(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate);
  var stopDate = moment(stopDate);
  while (currentDate <= stopDate) {
    dateArray.Push(moment(currentDate).format('YYYY-MM-DD'))
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}

var dateArray = getDates(new Date(), (new Date()).addDays(30));

for (i = 0; i < dateArray.length; i++) {
  //console.log(dateArray[i]);
}

function getFirstLast(parametro) {

  let periodo;

  (parametro == '') ? periodo = "0000-00": periodo = parametro

  let date = new Date(periodo),
    y = date.getFullYear(),
    m = date.getMonth() + 1;

  let retorno = []
  retorno.push(new Date(y, m, 1));
  retorno.push(new Date(y, m + 1, 0));

  return retorno
}

let t = getFirstLast()

console.log(t[0], t[1])
