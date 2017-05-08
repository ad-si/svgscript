module.exports.shaven = (options = {}, tools) => {
  return tools.businessCard({
    side: 'back',
    printLayout: true,
    cutView: true,
    cardGraphic: [
      'path#card',
      {
        // eslint-disable-next-line id-length
        d: 'M0,0 h5 v7 h3 v6',
      },
    ],
  })
}
