export function hashCode(str) {
  var h = 0;
  var len = str.length;
  var t = 2147483648;
  for (var i = 0; i < len; i++) {
    h = 31 * h + str.charCodeAt(i);
    if (h > 2147483647) h %= t; //java int溢出则取模
  }
  /*var t = -2147483648 * 2;
     while (h > 2147483647) {
     h += t
     }*/
  return h;
}

function randomWord(randomFlag, min, max = 36) {
  var str = "",
    range = min,
    arr = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  console.log(str);
  return str;
}
//获取hashcode
export function getHashCode() {
  //定义一个时间戳，计算与1970年相差的毫秒数  用来获得唯一时间
  // var timestamp = new Date().valueOf();
  var myRandom = randomWord(false, 6, 36);
  // console.log(hashCode(myRandom + timestamp.toString()))
  var hashcode = myRandom;
  // var hashcode = hashCode(myRandom + timestamp.toString());
  return hashcode;
}

export function getQueryString(name, url = window.location.search.substr(1)) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
