import { Parser } from 'html-to-react'

const parser = new Parser()

export class HtmlParseHelper {
  static parse(text: string): any {
    const parsedText = parser.parse(text)
    return parsedText
  }
}
