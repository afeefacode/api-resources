import App from '../App'
import Test from '../components/Test'

export const routes = [
  {
    path: '/',
    component: App,

    children: [
      {
        path: '',
        component: Test
      }
    ]
  }
]
