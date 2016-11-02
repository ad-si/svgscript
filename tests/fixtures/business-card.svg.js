module.exports.shaven = (options = {}, tools) => {
  return tools.businessCard({
    side: 'back',
    printLayout: true,
    cutView: true,
    cardGraphic: [
      'path#card',
      {'d': 'M0,0 h5 v7 h3 v6'},
    ],
  })
}
