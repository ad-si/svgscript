export default function (options, tools) {
  return tools.shaven(tools.businessCard({
    side: 'back',
    printLayout: true,
    cutView: true,
    name: 'Thomas Smith',
    job: 'CEO',
    email: 'thomas@example.org',
  })).rootElement
}
