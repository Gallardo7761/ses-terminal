export const pick = (list, not) => {
  const options = list.length > 1 ? list.filter((x) => x !== not) : list
  return options[Math.floor(Math.random() * options.length)]
}
