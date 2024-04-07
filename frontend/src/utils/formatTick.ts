export function formatTick(value: any) {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + 'млрд'
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'млн'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'тис'
  } else {
    return value
  }
}
