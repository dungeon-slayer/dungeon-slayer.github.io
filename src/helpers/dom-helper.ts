export class DomHelper {
  static getBrowserHeight(): number {
    const w = window
    const d = document
    const docEl = d.documentElement
    const body = document.body
    return w.innerHeight || docEl!.clientHeight || body.clientHeight
  }

  static getElementHeight($target: any): number | undefined {
    if (!$target) {
      return undefined
    }
    return $target.getBoundingClientRect().height
  }

  static scrollToTop() {
    window.scrollTo(0, 0)
  }

  static setTitle(title: string) {
    document.title = title
  }
}
