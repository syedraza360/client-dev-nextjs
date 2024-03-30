export const share = () => {
  if (
    navigator.share &&
    navigator.canShare({
      url: window.location.href
    })
  ) {
    navigator
      .share({
        url: window.location.href
      })
      .catch((err) => {
        console.log(err)
      })
  } else {
    alert("Your browser does not support sharing!")
  }
}
