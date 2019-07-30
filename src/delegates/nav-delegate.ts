import { history } from '../common/history'

export class NavDelegate {
  static to(path: string) {
    history.push(path)
  }
}
