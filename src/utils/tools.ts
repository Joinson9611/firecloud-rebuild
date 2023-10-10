// 删除数据某一特定元素
export function removeElement(arr, element) {
	const index = arr.indexOf(element)
	if (index > -1) {
		arr.splice(index, 1)
	}
}
// 范围筛选数组
export function rangeFilter(A, B, arr) {
	const newArr:number[] = []
	arr.forEach((ele) => {
		if (typeof ele !== "number") return
		if (ele < B && ele > A) {
      newArr.push(ele)
		}
	})
  return newArr
}
