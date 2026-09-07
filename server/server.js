import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()
const port = process.env.PORT || 4000
const jwtSecret = process.env.JWT_SECRET || 'local-development-secret-change-me'

const demoUser = {
  id: 'usr_01',
  name: '민지',
  email: 'demo@nova.io',
  password: 'nova1234',
}

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.post('/api/auth/login', (request, response) => {
  const { email, password } = request.body
  if (email !== demoUser.email || password !== demoUser.password) {
    return response.status(401).json({ message: '이메일 또는 비밀번호를 확인해주세요.' })
  }

  const user = { id: demoUser.id, name: demoUser.name, email: demoUser.email }
  const token = jwt.sign(user, jwtSecret, { expiresIn: '1h' })
  return response.json({ token, user })
})

app.get('/api/me', (request, response) => {
  const authorization = request.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null
  if (!token) return response.status(401).json({ message: '인증 토큰이 필요합니다.' })

  try {
    const user = jwt.verify(token, jwtSecret)
    return response.json({ user })
  } catch {
    return response.status(401).json({ message: '유효하지 않거나 만료된 토큰입니다.' })
  }
})

app.listen(port, () => {
  console.log(`NOVA API listening on http://localhost:${port}`)
})
