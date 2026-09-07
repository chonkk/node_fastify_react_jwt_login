import cors from '@fastify/cors'
import Fastify from 'fastify'
import jwt from 'jsonwebtoken'

const app = Fastify({ logger: true })
const port = process.env.PORT || 4000
const jwtSecret = process.env.JWT_SECRET || 'local-development-secret-change-me'

const demoUser = {
  id: 'usr_01',
  name: '민지',
  email: 'demo@nova.io',
  password: 'nova1234',
}

await app.register(cors, { origin: 'http://localhost:5173' })

app.post('/api/auth/login', async (request, reply) => {
  const { email, password } = request.body
  if (email !== demoUser.email || password !== demoUser.password) {
    return reply.code(401).send({ message: '이메일 또는 비밀번호를 확인해주세요.' })
  }

  const user = { id: demoUser.id, name: demoUser.name, email: demoUser.email }
  const token = jwt.sign(user, jwtSecret, { expiresIn: '1h' })
  return reply.send({ token, user })
})

app.get('/api/me', async (request, reply) => {
  const authorization = request.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null
  if (!token) return reply.code(401).send({ message: '인증 토큰이 필요합니다.' })

  try {
    const user = jwt.verify(token, jwtSecret)
    return reply.send({ user })
  } catch {
    return reply.code(401).send({ message: '유효하지 않거나 만료된 토큰입니다.' })
  }
})

try {
  await app.listen({ port, host: '0.0.0.0' })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
