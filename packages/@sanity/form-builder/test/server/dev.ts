import {createDevServer} from './start'

async function dev() {
  const server = await createDevServer({silent: false})

  return server.listen()
}

dev().catch((err) => {
  // eslint-disable-next-line no-console
  console.log(err)

  // eslint-disable-next-line no-process-exit
  process.exit(1)
})
