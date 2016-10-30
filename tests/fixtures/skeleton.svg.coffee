module.exports.shaven = (config, tools) ->
  defaults =
    width: 100
    height: 100

  {width, height} = Object.assign({}, defaults, config)

  return [
    'svg'
    width: width + 'mm'
    height: height + 'mm'
    viewBox: [
      0
      0
      width
      height
    ]
    [
      'g',
      [
        'circle'
        r: 10
        cx: 50
        cy: 50
      ]
    ]
  ]
