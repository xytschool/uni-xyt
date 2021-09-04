
var arr = [0, 8, 5, 0, 134, 0, 3, 6, 5, 0, 7, 0]
// for (var i = 0 ;  i < arr.length ; i++){
//     if(arr[i] != 0 ) {
//         left  = i
//         break
//     }
// }

var left  = 0
for (var right = left ;  right < arr.length ; right++){
    if(arr[right] == 0) {
        var tmp = arr[right]
        arr[right] = arr[left]
        arr[left] = tmp
        left++
    }
}

console.log(arr)
