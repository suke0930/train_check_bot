import { emitKeypressEvents } from "readline";

function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let obj = new Array<number[]>(10).fill(
    new Array<number>(10).fill(getRandomNumber(0, 10))
);

const newobj = obj.map((elem) => {
    return elem.map((elem2) => {
        return getRandomNumber(0, 9)
    })
})
// console.log(newobj[0])
newobj.map((elem) => {
    let outstr = "";
    outstr = elem.join(",");
    console.log(outstr)
})

console.log("---------------");
/**
 * 足した後のやつ
 */



let sum: number[] = [];
const numlengrow = newobj.length;
const numlengcow = newobj[0].length;

//初期化
let rowSums = new Array(numlengrow).fill(0);
let colSums = new Array(numlengcow).fill(0);

// for (let i = 0; i < numlengrow; i++) {
//     for (let j = 0; j < numlengcow; j++) {
//         rowSums[i] += newobj[i][j];
//         colSums[j] += newobj[i][j];
//     }
// }

let rowSums2 = new Array(numlengrow).fill(0);
let colSums2 = new Array(numlengcow).fill(0);


newobj.map((elem, index) => { elem.map((elem2, index2) => { rowSums2[index] += elem2; colSums2[index2] += elem2; }) })

// console.log(rowSums);
// console.log(colSums);
// console.log("-----");
console.log(rowSums2);
console.log(colSums2);
// console.log(newobj[0].length);

