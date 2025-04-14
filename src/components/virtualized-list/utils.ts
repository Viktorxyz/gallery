import { Align } from './types'

function findFirstVisibleItem(
  scroll: number,
  positions: number[],
  length: number
) {
  let k = 0
  for (let b = Math.trunc(length / 2); b >= 1; b = Math.trunc(b / 2)) {
    while (k + b < length && positions[k + b] <= scroll) k += b
  }
  return k
}

function findLastVisibleItem(
  positions: number[],
  firstVisibleItem: number,
  length: number,
  containerSize: number
) {
  let lastVisibleItem
  for (
    lastVisibleItem = firstVisibleItem;
    lastVisibleItem < length;
    lastVisibleItem++
  ) {
    if (
      positions[lastVisibleItem] >
      positions[firstVisibleItem] + containerSize
    ) {
      return lastVisibleItem
    }
  }
  return lastVisibleItem
}

function getScrollPercentage(
  scroll: number,
  scrollSize: number,
  clientSize: number
) {
  return scroll / (scrollSize - clientSize)
}

function getAlignmentOffset(itemSize: number, align: Align) {
  if (align === 'center') return itemSize / 2
  else if (align === 'end') return itemSize
  else return 0
}

export {
  findFirstVisibleItem,
  findLastVisibleItem,
  getAlignmentOffset,
  getScrollPercentage
}
